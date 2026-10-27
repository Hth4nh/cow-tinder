# Elephant-Goldfish Model (EGM) — Auto-Routing & Flexible Execution Rules

This workspace uses the **Elephant-Goldfish Model (EGM)** for Spec-Driven Development.
Because EGM skills set `disable-model-invocation: true` by default, you **MUST** proactively and flexibly route user tasks to the appropriate EGM skill or Goldfish subagent based on task intent—**without waiting for the user to type `/egm-*` slash commands**.

---

## 1. Core Principles & Flexible Mode Selection

When the user gives a task, classify the intent and choose the right level of EGM engagement:

1. **Full Skill Workflow (Structured SDD Phases)**:
   - When the user is starting a new idea/feature, drafting a design doc, asking for a full spec review, bootstrapping folder documentation, or checking codebase-vs-spec drift, **read the corresponding `SKILL.md` file first** (using `read_file`) and follow its workflow.
2. **Lightweight / Targeted Goldfish Subagent Dispatch (Ad-hoc Checks)**:
   - When the user asks for a quick critique, sanity check, or targeted review on a specific section, architecture idea, or implementation plan without wanting a multi-stage interactive gate ceremony, directly spawn the relevant `egm-*` subagent(s) via `invoke_subagent`.
3. **Direct Implementation Mode (Coding / Bug Fixing)**:
   - When the user explicitly asks to write, modify, or debug application source code, proceed with coding normally. Do **not** apply the `NO CODE` constraint from `egm-draft` / `egm-bootstrap` during actual implementation tasks. If a design doc exists under `docs/designs/`, use it as the source of truth.

---

## 2. Intent-to-Skill Auto-Routing Matrix

Plugin root path: `C:/Users/Hth4nh/.gemini/config/plugins/egm`

| User Intent / Task Context | EGM Skill to Activate | `SKILL.md` Path to Read | Key Output / Behavior |
| :--- | :--- | :--- | :--- |
| **Ideation & Brainstorming**<br>Exploring a raw idea, new feature concept, problem boundaries, or stress-testing an early hypothesis before writing a spec. | `egm-brainstorm` | `C:/Users/Hth4nh/.gemini/config/plugins/egm/skills/egm_brainstorm/SKILL.md` | Multi-turn open-ended clarification → parallel Goldfish lens critique via `egm-synthesizer` → `concepts_brief.md`. |
| **Design Document Drafting**<br>Turning a brainstorm brief (`concepts_brief.md`) or feature requirements into a structured technical specification or implementation plan. | `egm-draft` | `C:/Users/Hth4nh/.gemini/config/plugins/egm/skills/egm_draft/SKILL.md` | Section-by-section iterative drafting (`Overview`, `Technical Plan`, `Alternatives`, `Detailed Implementation`) → `design_draft.md` / `docs/designs/<feature>.md`. |
| **Full Spec / Plan Review**<br>Reviewing, auditing, or validating a design document or implementation plan end-to-end. | `egm-review` | `C:/Users/Hth4nh/.gemini/config/plugins/egm/skills/egm_review/SKILL.md` | 5-stage pipeline (Zoom Out → Comprehension → Critic → Intermediate Zoom Out → Implementation Readiness) or targeted preset (`feature_spec`, `implementation`, `uninterrupted`). |
| **Targeted / Iterative Section Review**<br>Auditing a specific section or running a custom combination of Goldfish reviewers in a loop until clean. | `egm-review-loop` | `C:/Users/Hth4nh/.gemini/config/plugins/egm/skills/egm_review_loop/SKILL.md` | Spawns selected Goldfish reviewers against mapped standards and hands findings to `egm-resolve`. |
| **Resolving Review Findings**<br>Triaging, contesting, or applying fixes from a Goldfish review report (`critic_report.md`, `implementation_readiness_report.md`, etc.). | `egm-resolve` | `C:/Users/Hth4nh/.gemini/config/plugins/egm/skills/egm_resolve/SKILL.md` | Classifies findings into `CONTEST` vs. `PROPOSE FIX` → writes `goldfish_review_report.md` → applies approved edits. |
| **Spec-to-Code Drift Detection**<br>Checking whether current source code matches `docs/designs/*.md` or directory `README.md` contracts, or finding unimplemented/diverged specs. | `egm-drift-report` | `C:/Users/Hth4nh/.gemini/config/plugins/egm/skills/egm_drift_report/SKILL.md` | Scans specs vs. live code sequentially and writes `{YYYY-MM-DD}_DRIFT_REPORT.md`. |
| **Codebase Documentation / Onboarding**<br>Generating or updating architectural `README.md` (or `EGM.md`) contracts (`Interface`, `Invariants`, `Side Effects`) across directories. | `egm-bootstrap` | `C:/Users/Hth4nh/.gemini/config/plugins/egm/skills/egm_bootstrap/SKILL.md` | Bottom-up Peanuts (leaf packages) & Hay (parent blueprints) contract generation. |

---

## 3. Flexible Subagent Dispatch (Goldfish Personas)

You can invoke any of the following registered subagents directly via `invoke_subagent` (using `TypeName`) whenever a task benefits from an isolated, zero-context perspective:

| Subagent `TypeName` | Persona File | When to Dispatch Automatically |
| :--- | :--- | :--- |
| `egm-zoom-out` | `C:/Users/Hth4nh/.gemini/config/plugins/egm/agents/zoom_out.md` | When evaluating if a proposal/design is over-engineered, violates YAGNI, duplicates existing patterns, or misses the root problem. |
| `egm-design` | `C:/Users/Hth4nh/.gemini/config/plugins/egm/agents/design_critic.md` | When stress-testing system architecture, scalability, failure modes, edge cases, quota/cost economics, or security risks. |
| `egm-comprehension` | `C:/Users/Hth4nh/.gemini/config/plugins/egm/agents/comprehension.md` | When checking if a spec, README, or RFC is understandable to a newcomer with zero prior context (flags undefined terms and ambiguity). |
| `egm-implementation-readiness` | `C:/Users/Hth4nh/.gemini/config/plugins/egm/agents/implementation_readiness.md` | Before starting coding from a plan/spec, to verify the plan is unambiguous and leaves no impactful design decisions to guess. |
| `egm-codebase-details` | `C:/Users/Hth4nh/.gemini/config/plugins/egm/agents/codebase_details.md` | When verifying that file paths, symbols, schemas, APIs, and library reuse opportunities in a plan or doc match the actual codebase. |
| `egm-structural` | `C:/Users/Hth4nh/.gemini/config/plugins/egm/agents/structural.md` | When validating document layout, heading hierarchy, symmetry, and template compliance. |
| `egm-style` | `C:/Users/Hth4nh/.gemini/config/plugins/egm/agents/style.md` | When editing technical prose for clarity, brevity, plain English, and stripping promotional fluff/buzzwords. |
| `egm-synthesizer` | `C:/Users/Hth4nh/.gemini/config/plugins/egm/agents/synthesizer.md` | When running multiple Goldfish reviewers in parallel to aggregate, deduplicate findings, and produce a single report without cluttering main context. |
| `egm-bootstrap-orchestrator` | `C:/Users/Hth4nh/.gemini/config/plugins/egm/agents/bootstrap_orchestrator.md` | When partitioning and documenting directory subtrees in parallel during `egm-bootstrap`. |

---

## 4. Shared Standards & Resources

When drafting or auditing documents, reference the authoritative standards in `C:/Users/Hth4nh/.gemini/config/plugins/egm/resources/`:

- **Execution Instructions**: `C:/Users/Hth4nh/.gemini/config/plugins/egm/resources/execution_instructions.md`
- **Feature Spec Standard**: `C:/Users/Hth4nh/.gemini/config/plugins/egm/resources/document_standards/feature-spec-standard.md`
- **Heilmeier Standard**: `C:/Users/Hth4nh/.gemini/config/plugins/egm/resources/document_standards/heilmeier-standard.md`
- **Implementation Readiness Standard**: `C:/Users/Hth4nh/.gemini/config/plugins/egm/resources/document_standards/implementation-readiness-standard.md`
- **Re-implementation Standard**: `C:/Users/Hth4nh/.gemini/config/plugins/egm/resources/document_standards/re-implementation-standard.md`
- **Zoom-Out Standard**: `C:/Users/Hth4nh/.gemini/config/plugins/egm/resources/document_standards/zoom-out-standard.md`

---

## 5. Practical Execution Guidelines

1. **Always Read `SKILL.md` Before Running a Full Skill**: Whenever a task matches an entry in the **Intent-to-Skill Auto-Routing Matrix** (Section 2), call `read_file` on its `SKILL.md` path first so you follow its exact templates, artifact rules, and checkpoint gates.
2. **Adapt Ceremony to User Intent**:
   - If the user asks *"brainstorm tính năng X"* or *"viết spec cho tính năng Y"*, run the full `egm-brainstorm` or `egm-draft` workflow.
   - If the user asks *"xem giúp thiết kế/plan này ổn chưa, có bị phức tạp quá hay thiếu gì không?"*, you can either offer the full `egm-review` pipeline or immediately run a fast parallel check via `egm-synthesizer` (with `egm-zoom-out`, `egm-design`, and `egm-implementation-readiness`) depending on how quick the user wants feedback.
3. **Preserve Elephant vs. Goldfish Separation**:
   - Keep deep project context and reasoning in the main conversation (**Elephant**).
   - Always run critiques and audits in fresh, isolated subagents via `invoke_subagent` (**Goldfish**) rather than self-reviewing in the main context.
4. **Autonomous Zero-Question Mode (`/no-asking`)**:
   - When the user invokes `/no-asking` (or asks to execute autonomously without asking back, e.g., *"tự phân tích, tự làm, không cần hỏi lại"*), read and follow [`.agents/skills/no-asking/SKILL.md`](file:///d:/Projects/PetProjects/cow-tinder/.agents/skills/no-asking/SKILL.md).
   - In `/no-asking` mode, **never** call `ask_question` and **never** pause at EGM interactive gates (Readiness Gate, Section Approval Gate, Review Checkpoint Gates, or Resolution Gate); make best-judgment decisions autonomously and execute the entire pipeline end-to-end.

