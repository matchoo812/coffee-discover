import { table, getShopRecords } from "../../../lib/airtable";

const getCoffeeShopById = async (req, res) => {
  const { id } = req.query;

  try {
    if (id) {
      // res.json({ message: `Searching for coffee shop ${id}` });
      const findCoffeeShopInfo = await table
        .select({
          // add quotes around value to make it a string instead of a number
          filterByFormula: `id="${id}"`,
        })
        .firstPage();

      if (findCoffeeShopInfo.length !== 0) {
        const shopRecords = getShopRecords(findCoffeeShopInfo);
        res.json(shopRecords);
      } else {
        res.json({ message: "id could not be found" });
      }
    } else {
      res.status(400);
      res.json({ message: "id is missing" });
    }
  } catch (error) {
    res.status(500);
    res.json({ message: "Unable to retrieve coffee shop", error });
  }
};

export default getCoffeeShopById;
