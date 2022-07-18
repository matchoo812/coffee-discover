import { Record } from "airtable";

const Airtable = require("airtable");
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID
);

const table = base("coffee-shops");
// console.log(table);

const createCoffeeShop = async (req, res) => {
  console.log({ req });

  if (req.method === "POST") {
    // find record
    const { id, name, neighborhood, address, imgUrl, votes } = req.body;

    try {
      if (id) {
        // locate record of coffee shop if it exists
        const findCoffeeShopInfo = await table
          .select({
            filterByFormula: `id=${id}`,
          })
          .firstPage();

        if (findCoffeeShopInfo.length !== 0) {
          const shopRecords = findCoffeeShopInfo.map(shop => {
            return {
              ...shop.fields,
            };
          });
          res.json(shopRecords);
        } else {
          // create a record if it doesn't exist
          if (name) {
            const createRecords = await table.create([
              {
                fields: {
                  id,
                  name,
                  address,
                  neighborhood,
                  imgUrl,
                  votes,
                },
              },
            ]);

            const shopRecords = createRecords.map(shop => {
              return {
                ...shop.fields,
              };
            });
            res.json({ message: "record created!", records: shopRecords });
          } else {
            res.status(400);
            res.json({ message: "Name and id fields are required." });
          }
        }
      } else {
        res.status(400);
        res.json({ message: "Id and name fields are required." });
      }
    } catch (error) {
      console.error("There was a problem creating or finding the shop: ", error);
      res.status(500);
      res.json({
        message: "There was a problem creating or finding the shop: ",
        error,
      });
    }
  }
};

export default createCoffeeShop;
