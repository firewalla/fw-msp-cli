const axios = require('axios');
const fs = require('fs');

const API_BASE_URL = 'https://api.firewalla.net/v2';

const getClient = (debug = false) => {
  const token = process.env.FIREWALLA_TOKEN;
  if (!token) {
    console.error(JSON.stringify({ error: "Auth missing. Set FIREWALLA_TOKEN env var." }));
    process.exit(1);
  }

  const instance = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Authorization': `Token ${token}` }
  });

  if (debug) {
    instance.interceptors.request.use(config => {
      console.error(`[DEBUG] ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
      console.error(`[DEBUG] Params: ${JSON.stringify(config.params)}`);
      return config;
    });
  }

  return instance;
};

/**
 * Enhanced Smart Routing: 
 * Resolves Nicknames (e.g. "Home") OR GIDs.
 */
const resolveBoxGid = async (input, debug) => {
  const client = getClient(debug);
  const { data: boxes } = await client.get('/boxes');

  // 1. If no input, check env var or auto-discover
  if (!input) {
    const envGid = process.env.FIREWALLA_BOX_GID;
    if (envGid) return envGid;
    if (boxes.length === 1) return boxes[0].gid;
    
    console.error(JSON.stringify({ error: "Ambiguous request. Specify --box <name|gid>." }));
    process.exit(1);
  }

  // 2. Try to match by GID first
  const matchByGid = boxes.find(b => b.gid === input);
  if (matchByGid) return matchByGid.gid;

  // 3. Try to match by Name (case-insensitive)
  const matchByName = boxes.find(b => b.name.toLowerCase() === input.toLowerCase());
  if (matchByName) return matchByName.gid;

  console.error(JSON.stringify({ error: `Box "${input}" not found.` }));
  process.exit(1);
};

/**
 * Helper to load JSON from string OR file (@path/to/file)
 */
const loadJson = (input) => {
  if (!input) return {};
  if (input.startsWith('@')) {
    const filePath = input.substring(1);
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
  return JSON.parse(input);
};

module.exports = { getClient, resolveBoxGid, loadJson };
