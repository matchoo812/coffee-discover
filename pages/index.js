import Banner from "../components/Banner";
import Card from "../components/Card";
import Head from "next/head";
import Image from "next/image";

import styles from "../styles/Home.module.css";
import coffeeStores from "../data/coffee-stores.json";

export async function getStaticProps(context) {
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY,
    },
  };

  const latLong = "35.8242%2C127.1480";
  const limit = "6";
  const response = await fetch(
    `https://api.foursquare.com/v3/places/search?query=coffee%20shop&ll=${latLong}&limit=${limit}`,
    options
  );
  const data = await response.json();

  // .catch(err => console.error(err));

  return {
    props: { coffeeShops: data.results },
  };
}

export default function Home({ coffeeShops }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Discover</title>
        <meta name='description' content='Find new coffee shops near you' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        <Banner buttonText='View cafes nearby' />

        <div className={styles.heroImage}>
          <Image src='/static/hero-image.png' alt='' width={700} height={400} />
        </div>

        {coffeeShops.length > 0 && (
          <div>
            <h2 className={styles.heading2}>Jeonju Coffee Shops</h2>

            <div className={styles.cardLayout}>
              {coffeeShops.map(shop => (
                <Card
                  key={shop.fsq_id}
                  shopId={shop.id}
                  name={shop.name}
                  imgUrl={
                    shop.imgUrl ||
                    "https://images.unsplash.com/photo-1498804103079-a6351b050096?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2468&q=80"
                  }
                  url={`/coffee-shop/${shop.fsq_id}`}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
