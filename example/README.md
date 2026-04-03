# Alarm Processor Prototype

AI-powered alarm analysis for Firewalla. Reads alarms, analyzes them with AI, and recommends actions.

## Quick Start

```bash
cd example
cp config.example.json config.json
# Edit config.json with your AI provider settings
node alarm-processor.js
```

## Configuration

Edit `config.json`:

```json
{
  "provider": "openai",
  "apiKey": "your-api-key",
  "model": "gpt-4o-mini",
  "limit": 10,
  "dryRun": true
}
```

### Built-in Providers

| Provider | Config |
|----------|--------|
| OpenAI | `"provider": "openai"` |
| OpenRouter | `"provider": "openrouter"` |
| Anthropic | `"provider": "anthropic"` |
| Ollama | `"provider": "ollama"` |

### Custom Providers

For any OpenAI-compatible API:

```json
{
  "provider": "custom",
  "format": "openai",
  "baseUrl": "https://your-llm.example.com/v1",
  "apiKey": "your-key",
  "model": "your-model"
}
```

For Anthropic-compatible APIs:

```json
{
  "provider": "custom",
  "format": "anthropic",
  "baseUrl": "https://your-llm.example.com/v1",
  "apiKey": "your-key",
  "model": "your-model"
}
```

## AI Provider Examples

### OpenAI
```json
{
  "provider": "openai",
  "apiKey": "sk-...",
  "model": "gpt-4o-mini"
}
```

### OpenRouter (Free Models Available)
```json
{
  "provider": "openrouter",
  "apiKey": "sk-or-...",
  "model": "meta-llama/llama-3-8b-instruct:free"
}
```

### Anthropic Claude
```json
{
  "provider": "anthropic",
  "apiKey": "sk-ant-...",
  "model": "claude-3-haiku-20240307"
}
```

### Ollama (Local)
```json
{
  "provider": "ollama",
  "apiKey": "ollama",
  "model": "llama3"
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
| `limit` | Number of alarms to process | 10 |
| `dryRun` | Log actions without executing | true |

## How It Works

1. Fetches alarms using `fw alarms list`
2. Sends each alarm to AI for analysis
3. AI returns risk score (0-10) and recommended action
4. Executes action (or logs in dry-run mode)

## Adding Custom LLMs

Most LLM providers support OpenAI-compatible APIs. To add a new provider:

1. Check if your provider has an OpenAI-compatible endpoint
2. Use `"format": "openai"` in config
3. Set `baseUrl` to your provider's API endpoint

**Compatible providers:**
- Mistral AI
- Together AI
- Groq
- Azure OpenAI
- Google Gemini (compatible endpoint)
- Any vLLM/LiteLLM server