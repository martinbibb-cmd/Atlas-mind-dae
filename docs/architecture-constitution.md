# Mind Architecture Constitution & AI Guardrails

This document establishes the constitutional rules for Atlas Mind before any simulation engines, visualisations, or user interfaces are implemented.

## Purpose

Atlas Mind exists to transform evidence into understanding.

It is responsible for:

* Building twins from evidence
* Running simulations
* Exploring scenarios
* Supporting decisions
* Explaining outcomes

It is not responsible for:

* Capturing evidence
* Producing quotations
* Financial advice
* Grant advice
* Mortgage advice
* CRM workflows

## Core Product Boundaries

### Atlas Contracts DAE

* Owns truth
* Owns evidence
* Owns provenance
* Owns signed outputs

### Atlas Scan DAE

* Owns capture
* Owns observations
* Owns field evidence collection

### Atlas Mind DAE

* Owns understanding
* Owns inference
* Owns simulation
* Owns decision support

## Architectural Rules

1. Nothing visual exists until the contract exists.
2. Nothing is recommended until it can be simulated.
3. Nothing is simulated until it can be represented in a twin.
4. Unknown is a valid state.
5. Provenance is never discarded.
6. Evidence may be observed, measured, inferred, customer-stated, or unknown.
7. Engines own computation.
8. Visualisation owns presentation.
9. Simulation Core owns orchestration.
10. Cost, finance, grants, and lending remain external integrations.

## AI Guardrails

AI may:

* Assist extraction
* Assist summarisation
* Assist explanation
* Assist content generation

AI may not:

* Invent evidence
* Invent measurements
* Invent provenance
* Invent confidence

All inferred values must remain explicitly marked as inferred.

All recommendations must be explainable through evidence, twins, and simulation outputs.

## Falsification Tests

The architecture should be reconsidered if:

* Most recommendations cannot be explained through simulation
* Most simulations require manual overrides
* Provenance becomes impossible to trace
* New features repeatedly bypass the Simulation Core

## Success Criteria

A survey can be captured in Scan, imported into Mind, converted into twins, simulated, and explained without requiring manual data migration or duplicate data entry.
