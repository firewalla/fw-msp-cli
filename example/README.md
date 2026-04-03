# Alarm Processor Prototype

AI-powered alarm analysis for Firewalla. Reads alarms, analyzes them with AI, and recommends actions.

## Quick Start

```bash
cd example
cp config.example.json config.json
# Edit config.json with your AI provider settings
node alarm-processor.js        # Get all alarms
node alarm-processor.js --limit=20  # Get only 20 alarms
```

## Configuration

Edit `config.json`:

```json
{
  "baseUrl": "https://api.openai.com/v1",
  "format": "openai",
  "apiKey": "your-api-key",
  "model": "gpt-4o-mini",
  "limit": 10,
  "dryRun": true
}
```

### Required Fields

| Field | Description |
|-------|-------------|
| `baseUrl` | API endpoint (must be OpenAI-compatible) |
| `apiKey` | Your API key |
| `model` | Model name to use |

### Provider Examples

All providers must use OpenAI-compatible format:

#### OpenAI
```json
{
  "baseUrl": "https://api.openai.com/v1",
  "apiKey": "sk-...",
  "model": "gpt-4o"
}
```

#### OpenRouter (Free Models Available)
```json
{
  "baseUrl": "https://openrouter.ai/api/v1",
  "apiKey": "sk-or-...",
  "model": "meta-llama/llama-3.1-8b-instruct:free"
}
```

#### Anthropic Claude (via OpenAI-compatible proxy)
```json
{
  "baseUrl": "https://api.anthropic.com/v1",  // Only if using a proxy that converts to OpenAI format
  "apiKey": "sk-ant-...",
  "model": "claude-3-5-sonnet-20241022"
}
```

#### Ollama (Local)
```json
{
  "baseUrl": "http://localhost:11434/v1",
  "apiKey": "ollama",
  "model": "llama3.1"
}
```

#### Custom Provider
```json
{
  "baseUrl": "https://your-llm.example.com/v1",
  "format": "openai",  // or "anthropic"
  "apiKey": "your-key",
  "model": "your-model"
}
```

## Actions

The AI analyzes each alarm and recommends:

| Action | Description |
|--------|-------------|
| `block` | High-risk threat, create firewall rule |
| `delete` | False positive or resolved, remove alarm |
| `ignore` | Low-risk or informational, no action |

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `limit` (CLI) | Number of alarms to process via `--limit=N` | Get all alarms |
| `dryRun` | Log actions without executing | true |

## How It Works

1. Fetches alarms using `fw alarms list`
2. Sends each alarm to AI for analysis
3. AI returns risk score (0-10) and recommended action
4. Executes action (or logs in dry-run mode)

## Adding Custom LLMs

Any LLM with an OpenAI-compatible API will work. Simply specify:
- `baseUrl`: The API endpoint
- `apiKey`: Your authentication token
- `model`: The model identifier

**Compatible providers include:**
- Mistral AI
- Together AI
- Groq
- Azure OpenAI
- Google Gemini (via compatible endpoint)
- Any vLLM/LiteLLM server
- Anthropic Claude (via OpenAI-compatible proxy)
