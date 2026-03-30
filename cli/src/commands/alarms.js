const { getClient, resolveBoxGid, loadJson } = require('../api/client');

const Alarms = {
  list: async (options) => {
    const gid = await resolveBoxGid(options.box, options.debug);
    const client = getClient(options.debug);
    
    let apiParams = { gid };
    if (options.params) {
      apiParams = { ...apiParams, ...JSON.parse(options.params) };
    }

    try {
      const { data } = await client.get('/alarms', { params: apiParams });
      console.log(JSON.stringify(data, null, 2));
    } catch (err) {
      console.error(JSON.stringify({ error: "API Error", details: err.response?.data || err.message }));
    }
  },

  update: async (id, options) => {
    const gid = await resolveBoxGid(options.box, options.debug);
    const client = getClient(options.debug);
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
