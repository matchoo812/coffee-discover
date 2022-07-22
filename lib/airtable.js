const Airtable = require("airtable");
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID
);

const table = base("coffee-shops");

const getRecord = record => {
  return {
    ...record.fields,
  };
};

const getShopRecords = records => {
  return records.map(shop => getRecord(shop));
};

export { table, getShopRecords };
