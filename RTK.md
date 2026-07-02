# Budget-APP Repository Tooling Kit (RTK)

## Purpose

This document defines how agents should operate in the Budget-APP repository.

## Lifecycle

Features move through:

pending -> spec_ready -> approved -> in_progress -> review -> done

Do not implement application code until a feature is explicitly approved.

## Execution Modes

- MVP
- SHIP

Budget-APP defaults to SHIP unless a feature explicitly states otherwise.

## Source of Truth

1. feature_list.json
2. specs/<feature>/requirements.md
3. specs/<feature>/design.md
4. specs/<feature>/tasks.md
5. progress/current.md
6. progress/history.md

## Core Principle

No evidence = no answer.
Evidence = grounded implementation.

## File Boundaries

Agents must only modify files that are explicitly in scope for the active feature.

## Verification

Before moving a feature to review, run the verification commands defined in its specification.
