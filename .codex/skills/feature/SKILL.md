---
name: feature
description: Manage current feature workflow - load, start, implement, review, explain or complete
argument-hint: load|start|implement|review|explain|complete
---

# Feature Workflow

Manages the full lifecycle of a feature from spec to merge.

## Working File

@context/current-feature.md

### File Structure

current-feature.md has these sections:

- `# Current Feature` - H1 heading with feature name when active
- `## Status` - Not Started | In Progress | Complete
- `## Goals` - Bullet points of what success looks like
- `## Notes` - Additional context, constraints, or details from spec
- `## History` - Completed features (append only)

## Workflow

The feature workflow is a multi-step process with branching logic:

1. **Load/Start**: Initialize feature from spec
   - Load existing spec or start new feature
   - Set up current-feature.md

2. **Implement**: Iterative development
   - Execute implementation steps
   - Update progress in current-feature.md
   - Branch based on complexity:
     - Simple: Direct implementation
     - Complex: Break into sub-tasks, iterative reviews

3. **Review**: Quality validation
   - Check against goals and requirements
   - Run automated checks
   - If issues found: Loop back to Implement
   - If approved: Proceed to Explain

4. **Explain**: Documentation
   - Document changes and rationale
   - Update current-feature.md

5. **Complete**: Finalization
   - Commit, push, merge
   - Reset to main branch
   - Archive in History

## Task

Execute the requested action: $ARGUMENTS

| Action      | Description                                   |
| ----------- | --------------------------------------------- |
| `load`      | Load a feature spec or inline description     |
| `start`     | Begin implementation, create branch           |
| `implement` | Execute implementation steps, update progress |
| `review`    | Check goals met, code quality                 |
| `explain`   | Document what changed and why                 |
| `complete`  | Commit, push, merge, reset                    |

## Actions Folder

Detailed instructions for each action are in the `actions/` folder:

- `load.md`: Steps for loading and validating specs
- `start.md`: Branch creation and initial setup
- `implement.md`: Implementation guidelines with branching logic
- `review.md`: Review checklist and validation steps
- `explain.md`: Documentation templates and best practices
- `complete.md`: Merge process and cleanup

Each action file provides specific workflows and can include conditional logic based on feature complexity or current state.

## Quality Gate

Before completing a feature:

- Run `/quality-gate` to execute all automated checks
- Fix all critical and high severity issues
- Re-run `/quality-gate` to verify fixes
- Ensure all goals in current-feature.md are met
- Confirm no regressions in existing functionality

If no action provided, explain the available options.
