---
name: no-asking
description: >-
  Autonomous zero-question execution mode (/no-asking). Analyzes input, makes
  all architectural and implementation decisions independently, bypasses all
  interactive confirmation gates (including EGM checkpoints), and executes the
  entire task end-to-end without asking the user any questions.
---

# Autonomous Zero-Question Mode (`/no-asking`)

When `/no-asking` is invoked (or when the user instructs you to work autonomously without asking questions), you MUST operate in **100% Autonomous Execution Mode** for the entire task.

---

## 1. Strict Non-Interruption Rules (CRITICAL)

1. **FORBIDDEN Tools**: You are **STRICTLY FORBIDDEN** from calling `ask_question` under any circumstance.
2. **NO Clarifying Questions in Chat**: Do **not** ask open-ended questions, yes/no questions, or confirmation prompts in chat. Do **not** stop early to ask *"Would you like me to proceed?"* or *"Which option do you prefer?"*.
3. **NO Checkpoint Pauses**: Do **not** pause between steps or phases waiting for user approval. Execute all required steps continuously until the final deliverable is complete.

---

## 2. Autonomous Decision-Making Protocol

Whenever you encounter ambiguity, missing requirements, or multiple design options:

1. **Gather Context First**: Read relevant files, configs, specs (`docs/designs/`), and directory structures in the workspace to infer conventions and constraints.
2. **Think & Resolve Internally**:
   - Evaluate trade-offs using **YAGNI** (simplest working architecture), codebase consistency, and platform best practices.
   - Choose the strongest, most pragmatic option yourself.
3. **Execute Immediately**: Proceed directly with the chosen solution (writing specs, reviewing, or implementing & testing code).
4. **Log Assumptions Concisely**: At the very end of your final response, include a brief bullet list of any key assumptions or autonomous decisions you made so the user has full visibility.

---

## 3. Auto-Bypassing EGM Interactive Gates under `/no-asking`

When `/no-asking` is combined with any **Elephant-Goldfish Model (EGM)** workflow (auto-routed via `GEMINI.md` or explicitly requested), you MUST automatically bypass all interactive gates defined in the EGM `SKILL.md` files:

| EGM Phase / Skill | Normal Behavior | `/no-asking` Autonomous Override |
| :--- | :--- | :--- |
| **`egm-brainstorm`** | Multi-turn open-ended Q&A + Readiness Gate + Handoff Modal | Derive problem boundaries, constraints, and anchored hypothesis directly from the prompt and codebase → immediately spawn `egm-synthesizer` for multi-lens Goldfish critique → synthesize and write `concepts_brief.md` (and proceed to drafting/coding if requested). |
| **`egm-draft`** | Pauses after each section (`Overview`, `Technical Plan`, `Alternatives`, `Implementation`) for approval | Draft all sections sequentially in one continuous run → self-evaluate against `zoom-out-standard.md` → write final spec directly to `docs/designs/<feature>.md`. |
| **`egm-review` & `egm-review-loop`** | Asks for `TargetFile`, `GoldfishContext`, preset mode, and pauses at Stages 5–9 | Auto-detect `TargetFile` and semantic split → run **Uninterrupted Full Flow** → automatically trigger `egm-resolve`. |
| **`egm-resolve`** | Writes `goldfish_review_report.md` and goes idle waiting for `"Auto accept"` or `"Interactive breakdown"` | Evaluate all findings (`PROPOSE FIX` vs `CONTEST`), write `goldfish_review_report.md`, and **automatically batch-apply all `PROPOSE FIX` edits** to the target document without pausing. |
| **`egm-bootstrap`** | Pauses at >15 subdirectories safety gate and optional drift report gate | Auto-approve full-tree execution, generate/update all `README.md` contracts bottom-up, verify links/targets, and complete without prompting. |

---

## 4. End-to-End Execution Pipeline

Depending on the user's request, execute the full lifecycle in one uninterrupted pass:

1. **Analyze**: Deconstruct the user's prompt, inspect the repository state, and determine the required deliverables (spec, review, code implementation, bug fix, or full feature).
2. **Design / Decide**: Make all architectural, data model, UI/UX, and edge-case decisions autonomously.
3. **Execute**: Create/modify all necessary files, documentation, or source code.
4. **Verify**: Run available static analysis, linters, or tests (e.g., `dart analyze`, `flutter test`, build checks) and autonomously fix any issues discovered.
5. **Deliver**: Present the completed result, clickable links to created/modified files, and a concise summary of autonomous decisions made.
