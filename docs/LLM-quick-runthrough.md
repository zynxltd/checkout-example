# Large Language Models — quick run-through

Goal: **recognise how LLMs work and where they fit in your job** — coding with AI, shipping AI features, and not getting fooled by hype.

For Laravel/Vue → modern SE path. Pair with [WALKTHROUGH.md](./WALKTHROUGH.md) · [2026 landscape (AI workflow)](./2026-stack-landscape.md) · crash-course “AI review” exercises.

---

## 30-second version

An **LLM** predicts the next tokens (pieces of text) given what came before.  
It does **not** “know” your database or “understand” like a person. It is a **pattern machine** trained on huge text/code corpora.

| Term | Meaning |
|------|---------|
| **Model** | The trained neural net (GPT-*, Claude*, Gemini*, open weights, etc.) |
| **Tokens** | Chunks of text the model reads/writes (~¾ of a word on average in English) |
| **Context window** | How much text it can see at once (prompt + history + output budget) |
| **Prompt** | What you send in (instructions + data + examples) |
| **Completion / response** | What it generates |
| **Hallucination** | Confident nonsense — treat as untrusted until verified |
| **Tool / function calling** | Model asks your app to run a function (search DB, call API) then continues |
| **RAG** | Retrieve docs from *your* data, stuff into prompt, then generate |
| **Fine-tune** | Extra training on your data (expensive/rare vs good prompting + RAG) |
| **Agent** | Loop: model ↔ tools ↔ memory until a goal (Cursor/Claude Code style) |

---

## How generation works (mental model)

```text
[ system instructions ]
[ your prompt + retrieved docs + conversation ]
        │
        ▼
   LLM samples next token
   again… again… until stop
        │
        ▼
[ assistant reply  ±  tool calls ]
```

**Temperature** (and cousins): higher → more random/creative; lower → more deterministic.  
For code and APIs, prefer **low temperature** + tests.

**Recognise:** changing the prompt changes behaviour more than “the model is smart/dumb today.”

---

## LLM vs “traditional” software

| Traditional app | LLM-shaped feature |
|-----------------|-------------------|
| Deterministic rules | Probabilistic text |
| Unit-test exact output | Test *contracts* (schema, citations, “must not invent IDs”) |
| Exceptions | Soft failures + hallucinations |
| Cheap CPU | Token cost + latency |
| AuthZ in code | Must still AuthZ in **your** code — model is not a security boundary |

**Laravel brain:** treat the model like an **untrusted HTTP client** that returns strings. Validate like a FormRequest.

---

## Where you’ll meet LLMs in 2026 jobs

### A) AI-assisted engineering (you as user)

| Tool style | Use | Risk |
|------------|-----|------|
| IDE agents (Cursor, Claude Code, Codex-class, OpenCode) | Implement tickets, explain repos | Merging unread diffs |
| Chat | Specs, trade-offs, rubber-duck | Outdated APIs / invented packages |
| CI assist | Draft tests/docs | Green CI ≠ correct product |

**Rule from job ads:** use AI for speed; **you** own review, tests, smoke, security.

Practice: Python/React **Ex 10** and React **Ex 10** (deliberately bad AI code).

### B) Product features (you as builder)

```text
User → Your API → (optional RAG / tools) → LLM provider → Your API → User
                      ↑
              Auth, rate limits, logging, PII scrubbing
```

Examples: support chat over **your** help centre, “summarise this order”, generate product blurbs, classify leads.

### C) Data / ML platforms

Separate track (pipelines, evals, fine-tunes). Web SE roles usually touch **A + light B**.

---

## Core building blocks

### 1. Prompting

| Pattern | What |
|---------|------|
| **System** | Role + hard rules (“never invent SKUs”) |
| **User** | Task + data |
| **Few-shot** | 1–3 examples of good I/O |
| **Structured out** | “Respond JSON matching schema X” |

Bad: “write a discount function.”  
Better: “Implement `apply_discount(price, code)` in Python; codes SAVE10=10%, SAVE50=£50 off capped at price; no eval; include pytest cases.”

### 2. RAG (Retrieval-Augmented Generation)

```text
Query → embed/search your docs/DB → top chunks → prompt → answer
```

| When | Why |
|------|-----|
| Need **your** policies/products | Model weights don’t include private data |
| Reduce hallucinations | Ground answers in retrieved text |

**Recognise:** “chat over PDFs/Notion/tickets” ≈ RAG, not magic memory.

### 3. Tools / function calling

Model returns: `call get_order(id=123)` → **your** server runs it → result back into context → final answer.

Same idea as a controller calling a service — **you** enforce auth and SQL.

### 4. Agents

Loop until done: plan → tool → observe → repeat.  
Powerful for coding; dangerous in prod without caps (max steps, allowlists, human approval).

### 5. Embeddings

Vectors for “semantic similarity” (search, clustering). Often used under RAG. Smaller/cheaper models than chat LLMs.

---

## APIs you’ll see in code

| Piece | Typical |
|-------|---------|
| HTTP | `POST https://api…/chat/completions` (or SDK) |
| Auth | `Authorization: Bearer …` (env/secret store — never commit) |
| Body | `model`, `messages[]`, `temperature`, `tools` |
| Streaming | SSE chunks for token-by-token UI |
| SDK | OpenAI-compatible clients, Anthropic SDK, Azure OpenAI, Bedrock, etc. |

**Laravel:** Http facade / SDK in a service class, queued for long jobs.  
**Python:** `httpx` / official SDK in FastAPI.  
**.NET:** `HttpClient` / Azure OpenAI SDK.  
**Node:** `fetch` / SDK in Express route.

Pseudo-shape:

```text
messages = [
  { role: "system", content: "You are … Rules: …" },
  { role: "user", content: userText }
]
→ LLM
→ parse JSON / show markdown / run tool
```

---

## Quality, evals, and “tests”

You rarely assert exact strings. Prefer:

| Check | Example |
|-------|---------|
| Schema | JSON parses; required fields present |
| Grounding | Answer cites retrieved chunk IDs |
| Safety | No PII leaked; refusals on disallowed |
| Regression set | Fixed prompts + expected properties |
| Human spot-check | Smoke before demo |

**Hallucination smoke:** ask for a SKU that doesn’t exist — must not invent stock.

---

## Cost, latency, limits

| Lever | Effect |
|-------|--------|
| Smaller / faster model | Cheaper, quicker, weaker reasoning |
| Shorter prompts | Fewer tokens in |
| Cap `max_tokens` | Bound cost/latency |
| Cache repeated system prompts | Provider-dependent |
| Queue long jobs | Don’t block HTTP request |

**Context window full?** Truncate old chat, summarise, or retrieve only top-k docs.

---

## Security & privacy (non-negotiable)

| Risk | Do this |
|------|---------|
| Secrets in prompts/logs | Redact; use vault/env |
| Prompt injection (“ignore rules…”) | Treat retrieved/user text as hostile; never let model set auth |
| Data exfiltration | Don’t send whole DB to vendor; minimise PII |
| SSRF via tools | Allowlist URLs/tools |
| Over-trust | Server-side validation always |

**Recognise:** the model is **inside** your trust boundary only as much as **your** tool layer allows.

---

## Local vs cloud models

| | Cloud API | Local / self-host |
|--|-----------|-------------------|
| Pros | Strong models, no GPU ops | Data stays in-house |
| Cons | Cost, data leaves machine | Weaker/harder ops |
| When | Most product features | Regulated / offline / experiments |

Open weights (Llama, Mistral, etc.) run via Ollama/vLLM — useful for demos; prod needs ops maturity.

---

## Glossary (interview / stand-up)

| Term | One-liner |
|------|-----------|
| **Token** | Billing + length unit |
| **Context window** | Working memory size |
| **System prompt** | Sticky instructions |
| **Hallucination** | Plausible falsehood |
| **RAG** | Search then generate |
| **Fine-tuning** | Extra training (heavy) |
| **LoRA** | Lightweight fine-tune technique |
| **Embedding** | Vector for similarity |
| **Temperature** | Randomness knob |
| **Guardrails** | Filters/policies around I/O |
| **Multimodal** | Text + image/audio |
| **MCP** | Tool/context protocol some agents use to talk to apps |

---

## Five-minute drill

1. Explain LLM vs database lookup to a non-dev.  
2. Name one hallucination you’d catch with a test.  
3. Sketch RAG for “answer from our FAQ.”  
4. Where does AuthZ live — model or your API? (**Your API.**)  
5. Open an AI-generated PR: list two SOLID/security smells ([OOP guide](./OOP-patterns-cross-stack.md)).

---

## Tie-in to your demos

| Demo exercise | LLM angle |
|---------------|-----------|
| React / Python **Ex 10** AI fixtures | Review agent output like prod code |
| Lead queue workers | Place for “classify lead” *later* — still validate |
| Plotline SaaS | Product copy / alert summarisation = classic feature shape |
| Agile walkthrough | AI drafts PR body — you verify test plan |

---

## One-liner cheat

> **LLMs autocomplete with flair. Ground them with your data (RAG), constrain them with schemas and tools you control, and never let them skip auth, tests, or code review.**
