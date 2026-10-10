---
title: "OpenAI multi-agent setup: ChatGPT and Codex"
slug: "choosing-a-multi-agent-setup"
description: "Compare separate chat threads, Codex subagents, and programmable OpenAI agent workflows to choose a practical setup for collaborative AI work."
datePublished: 2026-10-08
dateModified: 2026-10-10
product: "ChatGPT, Codex, and OpenAI Agents SDK"
vendor: "OpenAI"
versions: ["Product capabilities and interfaces change; verify current documentation before implementation"]
category: "AI and automation"
tags: ["ChatGPT", "Codex", "agents", "subagents", "automation", "OpenAI API"]
errorCodes: []
eventIds: []
logFiles: []
symptoms: ["Unclear whether to open separate chats, delegate to subagents, or build an agent workflow", "Need to coordinate specialist analysis or implementation tasks"]
visibility: published
sources:
  - label: "OpenAI Codex"
    url: "https://openai.com/codex/"
  - label: "OpenAI API: Agents SDK"
    url: "https://developers.openai.com/api/docs/guides/agents/sdk"
  - label: "OpenAI API: Multi-agent"
    url: "https://developers.openai.com/api/docs/guides/responses-multi-agent"
  - label: "OpenAI Help Center: ChatGPT and API billing"
    url: "https://help.openai.com/en/articles/9039756-managing-billing-settings-on-chatgpt-web-and-platform"
---

## Short answer

Choose the lightest setup that gives you the coordination you need. Separate chats are useful for independent conversations, but they do not exchange work automatically. In a Codex environment that supports delegation, subagents can handle bounded parts of one project under a coordinating task. If you are building your own application and need repeatable routing, tools, and handoffs, use a programmable agent workflow such as the OpenAI Agents SDK.

## Start with the work pattern

The word “agent” is used for several different things. The useful distinction is where coordination happens and who is responsible for carrying results between steps.

| Setup | How coordination works | A good fit |
|---|---|---|
| Separate ChatGPT or Codex threads | Each conversation has its own context. You move information between them yourself. | Independent questions, parallel drafts, or work that does not need shared state. |
| Codex task with subagents | A coordinating task delegates defined pieces of work where the current Codex environment supports it, then reviews the results. | Codebase work that can be split into focused reviews, research, or implementation tasks. |
| OpenAI Agents SDK | Your application defines agents, tools, handoffs, state, and approval logic in code. | A reusable workflow that must run as part of a product or service. |
| OpenAI Agents API | OpenAI provides a managed agent runtime for supported long-running tasks. | An application that needs a managed agent session and sandbox. |

These options are related, but they are not interchangeable. A set of role descriptions in one prompt does not by itself create separately running agents, and opening several threads does not connect them.

## When separate threads are enough

Use separate threads when each task can stand on its own or when you are comfortable collecting the answers manually. For example, one conversation can review a proposal while another drafts a checklist. Copy the relevant findings into a final synthesis yourself, and verify that both threads used the same requirements and source material.

If the work depends on shared files, decisions, or a common final answer, independent threads add coordination overhead. Write down the shared context and ask one coordinating task to combine and check the results, or use an environment with actual delegation support.

## When Codex subagents help

Subagents are useful when a coding task has independent, bounded workstreams. A coordinator might ask one worker to inspect test coverage, another to review security-sensitive code, and another to examine a separate module. The coordinator then checks those findings against the repository, integrates any changes, and runs the appropriate validation.

Keep tasks narrow and state the expected output. For instance:

> Review this PowerShell project in three independent areas: script correctness, security-sensitive behavior, and test coverage. Report findings with file paths and line numbers. Do not modify files. I will use the results to decide what to change.

This request describes a possible delegation plan; it does not guarantee that a particular interface will start subagents. First confirm that the Codex product, model, and current task environment expose delegation. If they do not, the same checklist can be completed sequentially by one task.

For implementation, assign distinct files or modules to separate workers where possible. Have the coordinator resolve disagreements, inspect the combined diff, and run tests. Multiple agents changing the same files at once can create conflicts and make review harder.

## When to build a workflow with the Agents SDK

Use the Agents SDK when you are writing an application that needs code-controlled agent behavior. It supports defining agents and tools and building orchestration patterns, including handoffs. Your application remains responsible for the surrounding product decisions: which tools are available, how state is stored, what needs approval, and how the workflow is deployed.

Start with one focused agent and a small task. Add a specialist or handoff only when you can identify a concrete boundary, such as a separate research step or an approval before a consequential action. Define the expected input and output for each stage, handle failures, and test the workflow with realistic cases before relying on it.

The Agents API is another option when a managed runtime is a better fit than running the agent loop inside your own application. Check the current API documentation to compare runtime, session, sandbox, and availability requirements before choosing.

## A practical decision path

1. **Need independent answers only?** Use separate threads and manually compare or combine the results.
2. **Working inside a code project with separable tasks?** Use Codex delegation if it is available in the current environment; keep one task responsible for integration and verification.
3. **Need the same workflow to run repeatedly in your own application?** Prototype it with the Agents SDK, starting with one agent and adding specialists only for clear responsibilities.
4. **Need a managed agent runtime?** Compare the Agents API with the SDK using the current official documentation.
5. **Before enabling external tools or consequential actions,** define what the agent may read or change and where human approval is required.

## Cost and account boundaries

Do not assume a ChatGPT subscription includes API usage. OpenAI documents ChatGPT billing and API platform billing as separate systems. An application that calls the API may incur API charges according to its usage and billing configuration. Check the current plan, API pricing, and organization billing settings before running a workflow at scale.

The Agents SDK is software for building an application workflow; model/API use and the infrastructure around that application have their own requirements and costs. Verify current pricing and terms directly before committing to a design.

## Common misconceptions

- **“Five threads are five collaborating agents.”** No. Threads are separate conversations unless a workflow explicitly coordinates them.
- **“A prompt with four roles starts four workers.”** Not necessarily. Separate execution depends on product and runtime support, not role wording alone.
- **“The SDK is a no-cost hosted service.”** The SDK is a development framework. Model API use is billed separately from a ChatGPT subscription, and an application also needs an execution environment.
- **“More agents always finish faster.”** Delegation can add coordination and review work. It helps most when tasks are independent and their outputs can be checked separately.

## Sources

- [OpenAI Codex](https://openai.com/codex/)
- [OpenAI API: Agents SDK](https://developers.openai.com/api/docs/guides/agents/sdk)
- [OpenAI API: Multi-agent](https://developers.openai.com/api/docs/guides/responses-multi-agent)
- [OpenAI Help Center: ChatGPT and API billing](https://help.openai.com/en/articles/9039756-managing-billing-settings-on-chatgpt-web-and-platform)

Product names and capabilities can change. Treat the comparison as a way to choose what to investigate; verify supported features, model availability, pricing, and interface steps in current OpenAI documentation before implementation.
