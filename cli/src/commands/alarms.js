const { getClient, resolveBoxGid } = require('../api/client');

const Alarms = {
  list: async (options) => {
    const gid = await resolveBoxGid(options.box, options);
    const client = getClient(options);
    
    let apiParams = { gid };
    
    // Only pass through supported API parameters
    if (options.params) {
      const parsedParams = JSON.parse(options.params);
      // Filter to only supported parameters (limit, cursor, etc.)
      const supportedParams = ['limit', 'cursor', 'query', 'groupBy', 'sortBy'];
      supportedParams.forEach(param => {
        if (parsedParams[param] !== undefined) {
          apiParams[param] = parsedParams[param];
        }
      });
    }

    try {
      const { data } = await client.get('/alarms', { params: apiParams });
      console.log(JSON.stringify(data, null, 2));
    } catch (err) {
      console.error(JSON.stringify({ error: "Fetch failed", details: err.response?.data || err.message }));
    }
  }
};

module.exports = Alarms;
