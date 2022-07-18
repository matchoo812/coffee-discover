// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { fetchCoffeeShops } from "../../lib/coffeeShops";

const getCoffeeShopsByLocation = async (req, res) => {
  try {
    // configure latLong and limit from request
    const { latLong, limit } = req.query;
    const response = await fetchCoffeeShops(latLong, limit);

    res.status(200);
    res.json(response);
  } catch (error) {
    res.status(500);
    res.json({ message: "Oh no! ", error });
    console.error("Something went wrong: ", error);
  }
};

export default getCoffeeShopsByLocation;
