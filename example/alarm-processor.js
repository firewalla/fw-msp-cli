#!/usr/bin/env node
/**
 * Firewalla Alarm Processor with AI Analysis
 * 
 * Reads alarms, analyzes them with AI, and takes action based on risk score.
 * Supports multiple AI providers: OpenAI, Anthropic, OpenRouter, Ollama
 */

const axios = require('axios');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Load config
const configPath = path.join(__dirname, 'config.json');
if (!fs.existsSync(configPath)) {
  console.error('Error: config.json not found. Copy config.example.json to config.json and fill in your settings.');
  process.exit(1);
}
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// No hardcoded providers - all configuration comes from config.json

/**
 * Call AI to analyze an alarm
 */
async function analyzeAlarm(alarm) {
  // Require baseUrl in config (format is always openai now)
  if (!config.baseUrl) {
    throw new Error('config.json must include baseUrl');
  }
  const provider = {
    baseUrl: config.baseUrl,
    format: 'openai'
  };

  const prompt = `You are a network security analyst. Analyze this Firewalla alarm and respond with ONLY a JSON object (no markdown, no explanation).

Alarm data:
${JSON.stringify(alarm, null, 2)}

Respond with this exact JSON structure:
{
  "risk_score": <number 0-10>,
  "action": "<block|delete|ignore>",
  "reason": "<brief explanation>"
}

Guidelines:
- risk_score 0-3: Low risk, usually safe activity
- risk_score 4-6: Medium risk, investigate further
- risk_score 7-10: High risk, likely malicious
- "block" for high-risk threats that should be blocked
- "delete" for false positives or resolved issues
- "ignore" for low-risk or informational alarms`;

  try {
    const response = await callOpenAICompatible(provider.baseUrl, prompt, provider);
    
    // Parse the AI response
    const content = response.choices?.[0]?.message?.content || response.content?.[0]?.text || '';
    
    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in AI response');
    }
    
    return JSON.parse(jsonMatch[0]);
  } catch (err) {
    console.error('AI analysis failed:', err.message);
    return { risk_score: 5, action: 'ignore', reason: 'AI analysis failed' };
  }
}

/**
 * Call OpenAI-compatible API (OpenAI, OpenRouter, Ollama, etc.)
 */
async function callOpenAICompatible(baseUrl, prompt, provider = {}) {
  const response = await axios.post(`${baseUrl}/chat/completions`, {
    model: config.model,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.1
  }, {
    headers: {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json'
    }
  });
  return response.data;
}


/**
 * Fetch alarms using the fw CLI
 */
function fetchAlarms(limitParam = '') {
  try {
    const output = execSync(`node ${path.join(__dirname, '..', 'cli', 'src', 'index.js')} alarms list ${limitParam}`, {
      encoding: 'utf8',
      env: { ...process.env, ...loadEnv() }
    });
    const data = JSON.parse(output);
    return data.results || [];
  } catch (err) {
    console.error('Failed to fetch alarms:', err.message);
    return [];
  }
}

/**
 * Load environment variables from .env file
 */
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  const env = {};
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        env[match[1].trim()] = match[2].trim();
      }
    }
  }
  return env;
}


/**
 * Parse command line arguments
 */
function parseArgs() {
  const args = {};
  for (let i = 2; i < process.argv.length; i++) {
    const arg = process.argv[i];
    if (arg.startsWith('--')) {
      const [key, value] = arg.slice(2).split('=');
      if (value !== undefined) {
        args[key] = value;
      } else {
        // Next argument is the value
        args[key] = process.argv[++i];
      }
    }
  }
  return args;
}

/**
 * Main function
 */
async function main() {
  // Parse command line arguments
  const cliArgs = parseArgs();
  
  console.log('Firewalla Alarm Processor');
  console.log('========================\n');
  console.log(`Provider: OpenAI-compatible`);
  console.log(`Model: ${config.model}\n`);
  
  // Fetch alarms - if --limit provided, use that; otherwise get all alarms
  let limitParam = '';
  let limitLog = 'all';
  if (cliArgs.limit !== undefined) {
    const limit = parseInt(cliArgs.limit);
    if (!isNaN(limit) && limit > 0) {
      limitParam = `--params '{"limit": ${limit}}'`;
      limitLog = limit.toString();
    } else {
      console.error('Invalid limit value. Must be a positive integer.');
      process.exit(1);
    }
  }
  
  console.log(`Fetching ${limitLog} alarms...`);
  const alarms = fetchAlarms(limitParam);
  
  if (alarms.length === 0) {
    console.log('No alarms found.');
    return;
  }
  
  console.log(`Found ${alarms.length} alarms.\n`);
  
  // Process each alarm
  for (const alarm of alarms) {
    const analysis = await analyzeAlarm(alarm);
    
    console.log(`\n--- Alarm ${alarm.aid} ---`);
    console.log(`Type: ${alarm._type}`);
    console.log(`Message: ${alarm.message}`);
    console.log(`AI Analysis:`);
    console.log(`  Risk Score: ${analysis.risk_score}/10`);
    console.log(`  Suggested Action: ${analysis.action}`);
    console.log(`  Reason: ${analysis.reason}`);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
  });
}

module.exports = { analyzeAlarm, fetchAlarms };
