---
name: error-solving-code-reviewer
user-invocable: true
description: "A workspace skill for reviewing TypeScript/React/Next.js issues, identifying root causes, and producing exact fixes with minimal changes. Use when you need a code review that resolves compile errors, type mismatches, import issues, runtime bugs, or auth/data-shape problems."
---

# Error Solving Code Reviewer

## Purpose

This skill is designed to help with error-driven code review in this workspace. It focuses on quickly understanding the reported failure, locating the underlying problem, and recommending or producing a precise code fix.

## Workflow

1. Identify the error source.
   - Use file paths, line numbers, stack traces, and TypeScript diagnostics.
   - Confirm whether the issue is compile-time, runtime, or logical.

2. Gather the relevant context.
   - Read the affected file(s) and any related types, schemas, or helper exports.
   - Check the surrounding code for mismatched shapes, missing imports, wrong property names, or incorrect assumptions.

3. Determine the fix strategy.
   - Fix the immediate bug with minimal code changes.
   - Prefer type-safe adjustments over broad casts unless necessary.
   - Use existing application conventions and names.

4. Validate the correction.
   - Ensure the proposed change matches the declared types and schema definitions.
   - When possible, update the code so it compiles cleanly without adding unnecessary runtime-workarounds.

5. Summarize the result.
   - Describe the root cause clearly.
   - Show the exact file and line or code block to change.
   - Include the before/after or the corrected snippet.

## Decision Points

- If the error refers to a missing field in Prisma or schema, verify the model and prefer `undefined` or a safe fallback rather than remove unrelated logic.
- If the error is from a form prop type mismatch, normalize optional values before passing them to UI components.
- If the error is about an import that no longer exists, remove the import and any dead code that depends on it.
- If the error involves `signIn` or auth options, check the auth library version and use the correct function signature.

## Quality Criteria

- Fixes should be precise and minimal.
- Recommendations should cite the actual file path and code location.
- Use workspace-specific conventions for data shapes, folder structure, and naming.
- Prefer `?.` and fallback values for optional nested data.

## Example Prompts

- "Review this TypeScript compile error and suggest the exact fix."
- "Help me fix the failing prop type in `seller/animals/[id]/edit/page.tsx`."
- "Find the root cause of the runtime bug in `cart/page.tsx` and update only the affected lines."
