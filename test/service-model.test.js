'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const heatingSurveyFixture = require('./fixtures/daedalus-package-v3-heating-survey.json');
const { importDaedalusPackage } = require('../src/daedalus-package');
const { buildDomesticWaterServiceModel } = require('../src/service-model');

test('builds domestic water service scaffold from water observations and service points', () => {
  const compiled = importDaedalusPackage(structuredClone(heatingSurveyFixture));
  const model = buildDomesticWaterServiceModel(compiled);

  assert.equal(model.domain, 'domesticHotWater');
  assert.equal(model.state, 'scaffold');
  assert.deepEqual(model.relatedWaterSupplyObservationIDs, [
    'water-flow-cup-kitchen',
    'water-pressure-flow-pairs',
    'water-flow-cup-bath',
    'water-customer-report',
    'water-not-tested',
  ]);
  assert.deepEqual(model.relatedServicePointObservationIDs, ['service-point-bath-tap']);
  assert.deepEqual(model.relatedSystemAssetIDs, ['boiler-kitchen', 'cylinder-airing-cupboard']);
  assert.ok(model.relatedEvidenceIDs.includes('evidence-cylinder-photo'));
  assert.ok(model.uncertainty.some((state) => state.sourceRef === 'waterSupplyObservation:water-not-tested'));
  assert.ok(model.provenance.some((entry) => entry.sourceRef === 'service-point-bath-tap'));
});

test('domestic water service scaffold does not output recommendation fields', () => {
  const compiled = importDaedalusPackage(structuredClone(heatingSurveyFixture));
  const model = buildDomesticWaterServiceModel(compiled);
  const json = JSON.stringify(model);

  assert.doesNotMatch(json, /recommendedOption|suitabilityScore|rank|winner|price|productRecommendation/i);
  assert.doesNotMatch(json, /calculatedPerformance|performanceCalculation/i);
});
