'use strict';

function buildDomesticWaterServiceModel(compiledTwin) {
  const waterSupplyObservations = cloneArray(compiledTwin.waterSupplyObservations);
  const servicePointObservations = cloneArray(compiledTwin.servicePointObservations);
  const relevantAssets = collectDomesticWaterAssets(compiledTwin);
  const evidenceIds = collectEvidenceIds(waterSupplyObservations, servicePointObservations, relevantAssets);
  const sourceRefs = new Set([
    ...waterSupplyObservations.map((observation) => `waterSupplyObservation:${readStringField(observation, ['id'])}`),
    ...servicePointObservations.map((observation) => `servicePointObservation:${readStringField(observation, ['id'])}`),
    ...relevantAssets.map((asset) => `observation:${asset.observationId}`),
  ]);

  return {
    id: `domestic-water-service:${compiledTwin.visitId}`,
    domain: 'domesticHotWater',
    state: waterSupplyObservations.length === 0 && servicePointObservations.length === 0 && relevantAssets.length === 0 ? 'unknown' : 'scaffold',
    relatedWaterSupplyObservationIDs: waterSupplyObservations
      .map((observation) => readStringField(observation, ['id']))
      .filter(Boolean),
    relatedServicePointObservationIDs: servicePointObservations
      .map((observation) => readStringField(observation, ['id']))
      .filter(Boolean),
    relatedSystemAssetIDs: relevantAssets.map((asset) => asset.observationId),
    relatedEvidenceIDs: Array.from(evidenceIds),
    relatedAssets: relevantAssets.map((asset) => ({
      id: asset.observationId,
      tag: asset.tag,
      subtype: inferAssetSubtype(asset),
    })),
    uncertainty: collectServiceUncertainty(
      compiledTwin.confidenceStates,
      waterSupplyObservations,
      servicePointObservations,
      relevantAssets,
      sourceRefs,
    ),
    provenance: compiledTwin.provenanceLinks
      .filter((link) => {
        if (sourceRefs.has(`${link.sourceType}:${link.sourceRef}`)) {
          return true;
        }
        return relevantAssets.some((asset) => asset.observationId === link.sourceRef);
      })
      .map((link) => ({
        evidenceRefs: cloneArray(link.evidenceRefs),
        sourceRef: link.sourceRef,
        sourceType: link.sourceType,
      })),
    notes: [
      'Domestic water service scaffold assembled from observations, service points, assets, evidence, provenance, and uncertainty.',
      'No pressure, flow, recovery, simultaneity, or product calculation has been made; this is not a performance calculation.',
    ],
  };
}

function collectServiceUncertainty(
  confidenceStates,
  waterSupplyObservations,
  servicePointObservations,
  relevantAssets,
  sourceRefs,
) {
  const states = confidenceStates
    .filter((state) => sourceRefs.has(state.sourceRef))
    .map((state) => ({
      path: state.path || '(root)',
      sourceRef: state.sourceRef,
      state: state.state,
    }));

  waterSupplyObservations.forEach((observation) => {
    addDirectConfidenceState(states, `waterSupplyObservation:${readStringField(observation, ['id'])}`, observation.confidence);
  });
  servicePointObservations.forEach((observation) => {
    addDirectConfidenceState(states, `servicePointObservation:${readStringField(observation, ['id'])}`, observation.confidence);
  });
  relevantAssets.forEach((asset) => {
    const confidence = typeof asset.confidence?.confidence === 'string' ? asset.confidence.confidence : null;
    addDirectConfidenceState(states, `observation:${asset.observationId}`, confidence);
  });

  return dedupeUncertainty(states);
}

function addDirectConfidenceState(states, sourceRef, confidence) {
  if (!sourceRef || !['approximate', 'unknown', 'unresolved'].includes(confidence)) {
    return;
  }

  states.push({
    path: 'confidence',
    sourceRef,
    state: confidence,
  });
}

function dedupeUncertainty(states) {
  const seen = new Set();
  return states.filter((state) => {
    const key = `${state.sourceRef}:${state.path}:${state.state}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function collectDomesticWaterAssets(compiledTwin) {
  const observations = [
    ...(compiledTwin.systemTwin?.observations ?? []),
    ...(compiledTwin.homeTwin?.observations ?? []),
  ];
  const seen = new Set();

  return observations.filter((asset) => {
    if (!asset || asset.classification === 'evidence') {
      return false;
    }

    const tokens = [
      asset.tag,
      readStringField(asset.rawObservation, ['type']),
      readStringField(asset.rawObservation, ['name']),
      readStringField(asset.rawObservation, ['canonicalSubtype', 'canonical_subtype']),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    const isRelevant =
      tokens.includes('boiler') ||
      tokens.includes('combi') ||
      tokens.includes('system boiler') ||
      tokens.includes('regular boiler') ||
      tokens.includes('cylinder') ||
      tokens.includes('thermal store') ||
      tokens.includes('water main') ||
      tokens.includes('stop tap');

    if (!isRelevant || seen.has(asset.observationId)) {
      return false;
    }
    seen.add(asset.observationId);
    return true;
  });
}

function collectEvidenceIds(waterSupplyObservations, servicePointObservations, relevantAssets) {
  const evidenceIds = new Set();

  waterSupplyObservations.forEach((observation) => {
    readStringArrayField(observation, ['evidenceIDs', 'evidence_ids']).forEach((id) => evidenceIds.add(id));
  });
  servicePointObservations.forEach((observation) => {
    readStringArrayField(observation, ['evidenceIDs', 'evidence_ids']).forEach((id) => evidenceIds.add(id));
  });
  relevantAssets.forEach((asset) => {
    cloneArray(asset.evidenceRefs).forEach((id) => evidenceIds.add(id));
  });

  return evidenceIds;
}

function inferAssetSubtype(asset) {
  const type = readStringField(asset.rawObservation, ['type']);
  return type ? `${asset.tag}:${type}` : asset.tag;
}

function readStringField(value, keys) {
  if (!value || typeof value !== 'object') {
    return null;
  }

  for (const key of keys) {
    if (typeof value[key] === 'string' && value[key].trim() !== '') {
      return value[key];
    }
  }

  return null;
}

function readStringArrayField(value, keys) {
  if (!value || typeof value !== 'object') {
    return [];
  }

  for (const key of keys) {
    if (Array.isArray(value[key])) {
      return value[key].filter((entry) => typeof entry === 'string');
    }
  }

  return [];
}

function cloneArray(value) {
  return Array.isArray(value) ? value.slice() : [];
}

module.exports = {
  buildDomesticWaterServiceModel,
};
