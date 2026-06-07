'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const heatingSurveyFixture = require('./fixtures/daedalus-package-v3-heating-survey.json');
const { importDaedalusPackage } = require('../src/daedalus-package');
const {
  buildInspectionData,
  handleImportShellRequest,
  summarizeCompiledTwin,
} = require('../src/import-shell');
const { buildTwinMapData, renderTwinMapViews } = require('../src/twin-map');

test('cross-repo heating survey fixture imports and renders without recommendations', async () => {
  const compiled = importDaedalusPackage(structuredClone(heatingSurveyFixture));
  const summary = summarizeCompiledTwin(compiled);
  const inspection = buildInspectionData(compiled);
  const mapData = buildTwinMapData(inspection);
  const mapHtml = renderTwinMapViews(inspection);

  assert.equal(summary.packageVersion, 3);
  assert.equal(summary.propertyRef, 'DAE-SMOKE-HEATING-001');
  assert.equal(summary.houseAreaCount, 3);
  assert.equal(summary.systemAssetCount, 6);
  assert.equal(summary.relationshipCount, 7);
  assert.equal(summary.evidenceCount, 3);
  assert.equal(summary.waterSupplyObservationCount, 4);
  assert.ok(summary.approximateCount > 0);
  assert.ok(summary.unknownCount > 0);
  assert.ok(summary.unresolvedCount > 0);

  assert.deepEqual(
    inspection.areas.map((area) => area.name),
    ['Kitchen', 'Airing Cupboard', 'Hall'],
  );
  assert.deepEqual(
    inspection.systemAssets.map((asset) => asset.id),
    [
      'boiler-kitchen',
      'cylinder-airing-cupboard',
      'thermostat-hall',
      'radiator-kitchen',
      'radiator-hall',
      'radiator-living-room',
    ],
  );
  assert.ok(mapData.placedSet.has('boiler-kitchen'));
  assert.ok(mapData.placedSet.has('cylinder-airing-cupboard'));
  assert.ok(mapData.placedSet.has('thermostat-hall'));
  assert.match(mapHtml, /Twin map — 2D spatial view/);
  assert.match(mapHtml, /Twin map — relationship graph/);
  assert.match(mapHtml, /rel-thermostat-controls-hall-radiator/);
  assert.match(mapHtml, /evidence-boiler-photo/);
  assert.deepEqual(
    inspection.waterSupply.map((observation) => observation.id),
    ['water-flow-cup-kitchen', 'water-pressure-flow-pairs', 'water-customer-report', 'water-not-tested'],
  );
  assert.ok(inspection.waterSupplyUncertainty['measured pressure+flow'].includes('water-pressure-flow-pairs'));
  assert.ok(inspection.waterSupplyUncertainty['flow-only'].includes('water-flow-cup-kitchen'));
  assert.ok(inspection.waterSupplyUncertainty['customer-reported'].includes('water-customer-report'));
  assert.ok(inspection.waterSupplyUncertainty['not tested'].some((value) => value.includes('water-not-tested')));

  const response = await handleImportShellRequest(
    new Request('https://example.com/import', {
      body: JSON.stringify(heatingSurveyFixture),
      headers: {
        'content-type': 'application/json',
      },
      method: 'POST',
    }),
  );
  const shellHtml = await response.text();

  assert.equal(response.status, 200);
  assert.match(shellHtml, /Compiled Twin Summary/);
  assert.match(shellHtml, /System assets:<\/strong> 6/);
  assert.match(shellHtml, /Relationships:<\/strong> 7/);
  assert.match(shellHtml, /Evidence count:<\/strong> 3/);
  assert.match(shellHtml, /Water supply observations:<\/strong> 4/);
  assert.match(shellHtml, /Water Supply/);
  assert.match(shellHtml, /pressureFlowTestKit/);
  assert.match(shellHtml, /Water supply uncertainty/);
  assert.match(shellHtml, /Unknown facts/);
  assert.match(shellHtml, /Approximate facts/);
  assert.match(shellHtml, /Unresolved facts/);
  assert.doesNotMatch(shellHtml, /recommendedOption|bestOption|suitabilityScore|pricing|customerAdvice/i);
});
