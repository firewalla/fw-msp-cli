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
  "apiKey": "your-api-key",
  "model": "gpt-5.4"
}
```

### Required Fields

| Field | Description |
|-------|-------------|
| `baseUrl` | API endpoint (OpenAI-compatible format) |
| `apiKey` | Your API key |
| `model` | Model name to use |

### Provider Examples

All providers use OpenAI-compatible format:

#### OpenAI
```json
{
  "baseUrl": "https://api.openai.com/v1",
  "apiKey": "sk-...",
  "model": "gpt-5.4"
}
```

#### OpenRouter (Free Models Available)
```json
{
  "baseUrl": "https://openrouter.ai/api/v1",
  "apiKey": "sk-or-...",
  "model": "nvidia/nemotron-3-super-120b-a12b:free"
}
```

#### Anthropic Claude
```json
{
  "baseUrl": "https://api.anthropic.com/v1",
  "apiKey": "sk-ant-...",
  "model": "claude-3-7-sonnet-20250219"
}
```

#### Google Gemini
```json
{
  "baseUrl": "https://generativelanguage.googleapis.com/v1beta",
  "apiKey": "AIza...",
  "model": "gemini-3.1-pro"
}
```

#### Ollama (Local)
```json
{
  "baseUrl": "http://localhost:11434/v1",
  "apiKey": "ollama",
  "model": "llama3.3"
}
```

#### Custom Provider
```json
{
  "baseUrl": "https://your-llm.example.com/v1",
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
