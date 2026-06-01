# Mind Core Architecture Foundation

This document defines the initial architecture of Atlas Mind before implementation begins.

## Current Architectural Position

Atlas Contracts stores truth.

Atlas Mind creates understanding from that truth.

## Identity Resolution

Atlas recognises that long-term property identity may require concepts such as:

* Locus
* Timeline
* Snapshot

However these concepts remain internal to Mind during Alpha.

They are not persisted within Contracts DAE.

## Reasoning

A Visit Package is an observation.

A Locus is an inference.

Contracts stores observations.

Mind performs inferences.

## Locus Promotion Rule

Locus should only be promoted into Contracts if one or more of the following become true:

1. Multi-visit comparisons are required directly within Scan.
2. External systems require high-volume current-state queries.
3. Legally binding multi-stage retrofit pathways require immutable temporal identity.

## Simulation Architecture

Mind consists of:

### Twin Builder

* Builds System, House, and Home twins from evidence

### Simulation Core

* Coordinates all simulation disciplines
* Resolves dependency loops
* Produces stable simulation outputs

### Simulation Disciplines

#### Thermodynamics

* Heat movement

#### Hydraulics

* Water movement

#### Plant Dynamics

* Equipment behaviour

#### Controls & Logic

* Operating behaviour

#### Electrical

* Electrical energy flow

#### Environment & Climate

* External influences

#### Lifecycle & Decay

* Performance degradation

#### Physical Fit & Serviceability

* Access and installation constraints

#### Policy & Compliance

* Rules and constraints

### Decision Engine

Consumes simulation outputs.

Produces:

* Scenarios
* Recommendations
* Pathways

### Journey Engine

Explains decisions in human language.

### Visualisation

Consumes outputs only.

Owns no truth.

### Traffic Layer

Owns:

* Navigation
* Accessibility routes
* Progressive disclosure
* Role-based journeys

## Future Investigation Areas

The following remain under active review:

* Locus architecture
* Timeline architecture
* Snapshot architecture
* Stable identity models
* Temporal simulation
* Scenario branching

These concepts must earn promotion through practical implementation rather than assumption.

## Success Criteria

Mind Alpha can:

* Import Atlas Scan outputs
* Build twins
* Run simulations
* Compare scenarios
* Generate explanations

without requiring Locus, Timeline, or Snapshot to exist in Contracts.
