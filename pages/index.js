import { useContext, useEffect, useState } from "react";

import useTrackedLocation from "../hooks/useTrackedLocation";
import { fetchCoffeeShops } from "../lib/coffeeShops";
import { ACTION_TYPES, StoreContext } from "../store/storeContext";

import Banner from "../components/Banner";
import Card from "../components/Card";
import Head from "next/head";
import Image from "next/image";

import styles from "../styles/Home.module.css";

export async function getStaticProps() {
  // note: call library function directly; don't use API in getStaticProps, as it won't be reachable until app is loaded
  const coffeeShops = await fetchCoffeeShops();

  return {
    props: { coffeeShops },
  };
}

export default function Home(props) {
  const { handleTrackLocation, isFindingLocation, locationErrorMessage } =
    useTrackedLocation();
  // console.log({ latLong, locationErrorMessage });

  // const [coffeeShopsNearMe, setCoffeeShopsNearMe] = useState([]);
  const [coffeeShopsError, setCoffeeShopsError] = useState(null);

  const { dispatch, state } = useContext(StoreContext);
  const { coffeeShops, latLong } = state;

  useEffect(() => {
    const getCoffeeShopsByLocation = async () => {
      if (latLong) {
        try {
          // set coffee shops based on user's location
          const response = await fetch(
            `/api/getCoffeeShopsByLocation?latLong=${latLong}&limit=30`
          );
          // console.log({ fetchedCoffeeShops });
          // setCoffeeShopsNearMe(fetchedCoffeeShops);
          const coffeeShops = await response.json();
          setCoffeeShopsError("");

          dispatch({
            type: ACTION_TYPES.SET_COFFEE_SHOPS,
            payload: { coffeeShops },
          });
        } catch (error) {
          // console.log({ error });
          setCoffeeShopsError(error.message);
        }
      }
    };
    getCoffeeShopsByLocation();
  }, [dispatch, latLong]);

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
        <link rel='icon' href='/static/beans.png' />
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
          <Image src='/static/beans.png' alt='' width={500} height={500} />
          {/* icon attribution */}
          {/* <a href="https://www.flaticon.com/free-icons/coffee" title="coffee icons">Coffee icons created by Smashicons - Flaticon</a> */}
        </div>

        {coffeeShops.length > 0 && (
          <div className={sectionWrapper}>
            <h2 className={heading2}>Coffee Shops Near Me</h2>

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

        {coffeeShops.length === 0 && props.coffeeShops.length > 0 && (
          <div className={sectionWrapper}>
            <h2 className={heading2}>Busan Coffee Shops</h2>

            <div className={cardLayout}>
              {props.coffeeShops.map(shop => (
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
