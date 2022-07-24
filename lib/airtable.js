const Airtable = require("airtable");
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID
);

const table = base("coffee-shops");

const getRecord = record => {
  return {
    recordId: record.id,
    ...record.fields,
  };
};

const getShopRecords = records => {
  return records.map(shop => getRecord(shop));
};

const findRecordByFilter = async id => {
  const findCoffeeShopInfo = await table
    .select({
      // stringify id
      filterByFormula: `id="${id}"`,
    })
    .firstPage();

  return getShopRecords(findCoffeeShopInfo);
};

export { table, findRecordByFilter, getShopRecords };
