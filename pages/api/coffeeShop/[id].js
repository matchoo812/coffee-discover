import { findRecordByFilter } from "../../../lib/airtable";

const getCoffeeShopById = async (req, res) => {
  const { id } = req.query;

  try {
    if (id) {
      const shopRecords = await findRecordByFilter(id);

      if (shopRecords.length !== 0) {
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
