import { createApi } from "unsplash-js";

const unsplash = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
});

const getImages = async () => {
  const photos = await unsplash.search.getPhotos({
    query: "coffee shop",
    perPage: 30,
  });
  const photoResults = photos.response.results;
  return photoResults.map(result => result.urls["small"]);
};

export const fetchCoffeeShops = async (
  latLong = "41.0814,-81.5190",
  limit = 9,
  query = "coffee"
) => {
  const photos = await getImages();
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY,
    },
  };

  const getCoffeeShopsUrl = (latLong, limit, query) => {
    return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latLong}&limit=${limit}`;
  };

  const response = await fetch(getCoffeeShopsUrl(latLong, limit, query), options);
  // console.log(response);

  const data = await response.json();
  return data.results.map((result, index) => {
    const neighborhood = result.location.neighborhood;
    const postalArea = result.location.post_town;
    return {
      name: result.name,
      id: result.fsq_id,
      address: result.location.address || "",
      neighborhood: neighborhood ? neighborhood[0] : postalArea ? postalArea : "",
      imgUrl: photos.length > 0 ? photos[index] : null,
    };
  });
  // .catch(err => console.error(err));
};
