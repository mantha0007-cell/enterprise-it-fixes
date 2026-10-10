---
title: "OpenAI agents compared: Codex, Agents SDK, and API"
slug: "choosing-a-multi-agent-setup"
description: "Choose between separate chats, Codex delegation, the Agents SDK, Agents API, and Responses API multi-agent workflows."
datePublished: 2026-10-08
dateModified: 2026-10-10
product: "ChatGPT, Codex, and OpenAI agent tools"
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
  - label: "OpenAI agents overview"
    url: "https://developers.openai.com/api/docs/guides/agents"
  - label: "OpenAI API: Agents SDK"
    url: "https://developers.openai.com/api/docs/guides/agents/sdk"
  - label: "OpenAI API: Agents API"
    url: "https://developers.openai.com/api/docs/guides/agents-api/overview"
  - label: "OpenAI API: Responses API Multi-agent"
    url: "https://developers.openai.com/api/docs/guides/responses-multi-agent"
  - label: "OpenAI Help Center: ChatGPT and API billing"
    url: "https://help.openai.com/en/articles/9039756-managing-billing-for-chatgpt-and-the-api-platform"
---

## Short answer

Choose the workflow by deciding who should coordinate the work and retain its state. Separate chats leave coordination to you. Codex delegation is for work inside a supported Codex task. For an application, the Agents SDK leaves the agent loop under your control; the Agents API runs an OpenAI-managed Codex harness with durable sessions. Responses API Multi-agent is a separate beta option for delegating parallel work from a Responses API request.

## Compare the coordination boundary

| Setup | Who coordinates and keeps state | A good fit |
|---|---|---|
| Separate ChatGPT or Codex threads | Each thread has its own conversation. You carry findings between them. | Independent questions or drafts that do not need shared state. |
| Codex delegation | A supported Codex task can assign bounded work to subagents; the coordinating task reviews and combines the results. | Parallel code review, research, or implementation inside Codex. |
| Agents SDK | Your application runs the agent loop and owns tools, storage, deployment, and approval decisions. | A product workflow that needs custom orchestration and infrastructure. |
| Agents API | OpenAI runs a managed Codex harness and maintains sessions; your application configures tools and an optional execution environment. | Durable cloud-agent sessions where you prefer a managed harness. |
| Responses API Multi-agent | A Responses API request can delegate parallel work to subagents; this feature is currently documented as beta. | Direct API workflows that need parallel analysis and can accept beta feature constraints. |

These options solve different coordination problems. A list of roles in one prompt does not create independently running workers, and multiple threads do not share results automatically. The Agents API, Agents SDK, and Responses API Multi-agent also differ in who runs the orchestration and how session state is handled.

## When separate threads are enough

Use separate threads when each task can stand on its own or when you are comfortable collecting the answers manually. For example, one conversation can review a proposal while another drafts a checklist. Bring the useful findings into a final synthesis yourself, and verify that both threads used the same requirements and source material.

When the work depends on shared files or decisions, manual transfer can become the weak link. Keep one thread responsible for integrating findings, or choose a runtime with explicit coordination.

## When Codex delegation helps

Codex delegation is useful when a coding task has independent, bounded workstreams and the active product environment supports it. A coordinating task might ask one worker to inspect test coverage, another to review security-sensitive code, and another to examine a separate module. The coordinator then checks those findings against the repository, integrates any changes, and runs the appropriate validation.

Keep each assignment narrow and make the expected output clear. Have workers report evidence and file locations, and avoid parallel edits to the same files. Delegation does not remove the need for integration and review.

The interface must actually expose delegation. A prompt that lists several roles does not guarantee that multiple workers will run. If the current Codex product or environment does not support subagents, perform the same review sequentially in one task.

## When to use an API workflow

The Agents SDK fits when your application should run and control the agent loop. Your code owns deployment, tools, storage, and approval logic while the SDK provides reusable agent and orchestration primitives, including handoffs.

Choose the Agents API when you want OpenAI to run the managed Codex harness and maintain durable session state. Your application still configures the agent and tools, handles its own function calls, and chooses whether to connect an OpenAI-hosted, self-hosted, or no execution environment.

Responses API Multi-agent is a different route: it adds parallel subagent delegation to a Responses API request. OpenAI currently documents this feature as beta, with model and interface constraints that can change. Do not treat it as interchangeable with the durable sessions and managed harness of the Agents API.

## A practical decision path

1. **Need independent answers only?** Use separate threads and combine the results yourself.
2. **Working in a code project with independent tasks?** Use Codex delegation if it is available in the current environment; keep one task responsible for review and integration.
3. **Building an application that should own the workflow?** Start with the Agents SDK and define its tools, state, and approval points in your application.
4. **Want OpenAI to manage durable agent sessions?** Evaluate the Agents API, including environment, data handling, and billing requirements.
5. **Need parallel work in a direct Responses API request?** Check whether the beta Multi-agent feature supports the chosen models and workflow.

Before enabling external tools or consequential actions, define what the agent may read or change and where human approval is required.

## Cost and account boundaries

Do not assume a ChatGPT subscription covers API usage. ChatGPT and API platform billing are managed separately. Agents API model usage and hosted tools or sandboxes can add API charges; an SDK application also needs its own runtime and infrastructure. Check current plan terms, API pricing, and organization billing settings before running a workflow at scale.

## Common misconceptions

- **“Five threads are five collaborating agents.”** Threads are separate conversations unless a workflow explicitly coordinates them.
- **“A prompt with four roles starts four workers.”** Separate execution depends on product and runtime support, not role wording alone.
- **“The Agents SDK and Agents API are the same thing.”** The SDK runs within your application; the Agents API uses an OpenAI-managed harness and durable sessions. Their state, execution, and operational boundaries differ.
- **“Agents API and Responses API Multi-agent are the same feature.”** One provides managed sessions and a Codex harness; the other adds parallel subagents to a Responses API request and is documented as beta.
- **“The SDK is a no-cost hosted service.”** The SDK is a development framework. API model and tool usage can incur charges, and an application also needs an execution environment.
- **“More agents always finish faster.”** Delegation can add coordination and review work. It helps most when tasks are independent and their outputs can be checked separately.

## Sources

- [OpenAI Codex](https://openai.com/codex/)
- [OpenAI agents overview](https://developers.openai.com/api/docs/guides/agents)
- [OpenAI API: Agents SDK](https://developers.openai.com/api/docs/guides/agents/sdk)
- [OpenAI API: Agents API](https://developers.openai.com/api/docs/guides/agents-api/overview)
- [OpenAI API: Responses API Multi-agent](https://developers.openai.com/api/docs/guides/responses-multi-agent)
- [OpenAI Help Center: ChatGPT and API billing](https://help.openai.com/en/articles/9039756-managing-billing-for-chatgpt-and-the-api-platform)

Product names and capabilities can change. Treat the comparison as a way to choose what to investigate; verify supported features, model availability, beta limitations, pricing, and interface steps in current OpenAI documentation before implementation.
