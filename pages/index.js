import useTrackedLocation from "../hooks/useTrackedLocation";
import { fetchCoffeeShops } from "../lib/coffeeShops";

import Banner from "../components/Banner";
import Card from "../components/Card";
import Head from "next/head";
import Image from "next/image";

import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";

export async function getStaticProps() {
  const coffeeShops = await fetchCoffeeShops();

  return {
    props: { coffeeShops },
  };
}

export default function Home({ coffeeShops }) {
  const { handleTrackLocation, isFindingLocation, latLong, locationErrorMessage } =
    useTrackedLocation();
  // console.log({ latLong, locationErrorMessage });

  const [coffeeShopsNearMe, setCoffeeShopsNearMe] = useState([]);
  const [coffeeShopsError, setCoffeeShopsError] = useState(null);

  useEffect(() => {
    const getCoffeeShopsByLocation = async () => {
      if (latLong) {
        try {
          // set coffee shops based on user's location
          const fetchedCoffeeShops = await fetchCoffeeShops(latLong, 30);
          console.log({ fetchedCoffeeShops });
          setCoffeeShopsNearMe(fetchedCoffeeShops);
        } catch (error) {
          // console.log({ error });
          setCoffeeShopsError(error.message);
        }
      }
    };
    getCoffeeShopsByLocation();
  }, [latLong]);

  const handleBannerButtonClick = () => {
    handleTrackLocation();
  };

  const { cardLayout, container, heading2, heroImage, main, sectionWrapper } =
    styles;
  return (
    <div className={container}>
      <Head>
        <title>Coffee Discover</title>
        <meta name='description' content='Find new coffee shops near you' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={main}>
        <Banner
          buttonText={isFindingLocation ? "Locating..." : "View cafes nearby"}
          handleClick={handleBannerButtonClick}
        />
        <p>
          {locationErrorMessage && `Something went wrong: ${locationErrorMessage}`}
        </p>
        <p>{coffeeShopsError && `Something went wrong: ${coffeeShopsError}`}</p>

        <div className={heroImage}>
          <Image src='/static/hero-image.png' alt='' width={700} height={400} />
        </div>

        {coffeeShopsNearMe.length > 0 && (
          <div className={sectionWrapper}>
            <h2 className={heading2}>Coffee Shops Near Me</h2>

            <div className={cardLayout}>
              {coffeeShopsNearMe.map(shop => (
                <Card
                  key={shop.id}
                  shopId={shop.id}
                  name={shop.name}
                  imgUrl={
                    shop.imgUrl ||
                    "https://images.unsplash.com/photo-1498804103079-a6351b050096?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2468&q=80"
                  }
                  url={`/coffee-shop/${shop.id}`}
                />
              ))}
            </div>
          </div>
        )}

        {coffeeShops.length > 0 && (
          <div className={sectionWrapper}>
            <h2 className={heading2}>Akron Coffee Shops</h2>

            <div className={cardLayout}>
              {coffeeShops.map(shop => (
                <Card
                  key={shop.id}
                  shopId={shop.id}
                  name={shop.name}
                  imgUrl={
                    shop.imgUrl ||
                    "https://images.unsplash.com/photo-1498804103079-a6351b050096?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2468&q=80"
                  }
                  url={`/coffee-shop/${shop.id}`}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
