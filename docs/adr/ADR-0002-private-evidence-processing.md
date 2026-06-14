# ADR-0002: Private Evidence Processing

## Status

Accepted

## Context

Daedalus processing handles raw evidence, transcripts, observations, provenance, and compiled twin state.

Cloudflare Pages can host public and demo UI. Cloudflare Tunnel can route ingress to private services. Neither role makes Cloudflare the system of record for sensitive evidence or durable twin state.

The current proved infrastructure shape uses VM 100 as the runner/API/database host and reserves VM 102 for future local LLM and speech-to-text work.

## Decision

Raw evidence stays inside Daedalus infrastructure.

External LLM APIs are not required for core processing.

Cloudflare is ingress, not the system of record.

The runner VM is the private service boundary.

The LLM VM is a worker, not an authority.

## Consequences

Cloudflare Pages remains public/demo UI only.

Cloudflare Tunnel routes ingress to private services without changing data ownership.

VM 100 owns runner/API state, Postgres-backed private state, and future durable twin storage.

VM 102 may run Whisper, a local model, and extraction workers, but it does not own durable twin authority.

The tunnel token must be treated as a secret and rotated if exposed.

Future external model providers may be added only behind explicit provider interfaces that preserve evidence minimisation, provenance, consent, and runner-side acceptance of outputs.

This decision does not add runtime behaviour, storage schemas, model selection, worker queues, or secrets.
