const { getClient, resolveBoxGid, loadJson } = require('../api/client');

const Alarms = {
  list: async (options) => {
    const gid = await resolveBoxGid(options.box, options);
    const client = getClient(options);
    
    let apiParams = { gid };
    if (options.params) {
      apiParams = { ...apiParams, ...JSON.parse(options.params) };
    }

    try {
      const { data } = await client.get('/alarms', { params: apiParams });
      console.log(JSON.stringify(data, null, 2));
    } catch (err) {
      console.error(JSON.stringify({ error: "Fetch failed", details: err.response?.data || err.message }));
    }
  },

  update: async (id, options) => {
    const gid = await resolveBoxGid(options.box, options);
    const client = getClient(options);
    const body = loadJson(options.json);

    try {
      const { data } = await client.put(`/alarms/${id}`, body, { params: { gid } });
      console.log(JSON.stringify(data, null, 2));
    } catch (err) {
      console.error(JSON.stringify({ error: "Update failed", details: err.response?.data || err.message }));
    }
  }
};

module.exports = Alarms;
