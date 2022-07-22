import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { fetchCoffeeShops } from "../../lib/coffeeShops";
import { isEmpty } from "../../utils";
import { StoreContext } from "../../store/storeContext";

import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import styles from "../../styles/CoffeeShopPage.module.css";

export async function getStaticProps({ params }) {
  // console.log("Params: ", params)
  const coffeeShops = await fetchCoffeeShops();
  const findCoffeeShopById = coffeeShops.find(shop => {
    return shop.id.toString() === params.id;
  });

  return {
    props: {
      coffeeShop: findCoffeeShopById ? findCoffeeShopById : {},
    },
  };
}

export async function getStaticPaths() {
  const coffeeShops = await fetchCoffeeShops();
  const paths = coffeeShops.map(shop => ({
    params: { id: shop.id.toString() },
  }));

  return { paths, fallback: true };
}

export default function CoffeeShopPage(initialProps) {
  const router = useRouter();
  const { id } = router.query;
  const [coffeeShop, setCoffeeShop] = useState(initialProps.coffeeShop);
  // console.log(coffeeShop);

  const {
    state: { coffeeShops },
  } = useContext(StoreContext);

  const handleCreateCoffeeShop = async coffeeShop => {
    try {
      const { name, id, votes, imgUrl, neighborhood, address } = coffeeShop;
      const response = await fetch("/api/createCoffeeShop", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          id,
          votes: 0,
          imgUrl,
          neighborhood: neighborhood || "",
          address: address || "",
        }),
      });

      const dbCoffeeShop = response.json();
      console.log(dbCoffeeShop);
    } catch (error) {
      console.error("There was a problem creating coffee shop: ", error);
    }
  };

  useEffect(() => {
    // check if original coffee shops array is empty
    if (isEmpty(initialProps.coffeeShop)) {
      // check coffee shops from context and find the one that matches the id from query params
      if (coffeeShops.length > 0) {
        const coffeeShopFromContext = coffeeShops.find(coffeeShop => {
          return coffeeShop.id.toString() === id;
        });

        if (coffeeShopFromContext) {
          setCoffeeShop(coffeeShopFromContext);
          handleCreateCoffeeShop(coffeeShopFromContext);
        }
      }
    } else {
      // add static coffee shop to airtable to persist votes
      handleCreateCoffeeShop(initialProps.coffeeShop);
    }
  }, [coffeeShops, id, initialProps, initialProps.coffeeShop]);

  const { name, address, neighborhood, imgUrl } = coffeeShop;
  const [voteCount, setVoteCount] = useState(0);

  const handleUpvote = () => {
    let count = voteCount + 1;
    setVoteCount(count);
  };

  const {
    col1,
    col2,
    container,
    homeLink,
    iconWrapper,
    layout,
    nameWrapper,
    shopImg,
    shopImgWrapper,
    text,
    upvoteButton,
  } = styles;
  return router.isFallback ? (
    <div>Loading...</div>
  ) : (
    <div className={layout}>
      <Head>
        <title>{name}</title>
      </Head>
      <div className={container}>
        <div className={col1}>
          <div className={homeLink}>
            <Link href='/'>
              <a>←Back to home</a>
            </Link>
          </div>
          <div className={nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>
          <div className={shopImgWrapper}>
            <Image
              src={
                imgUrl ||
                "https://images.unsplash.com/photo-1498804103079-a6351b050096?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2468&q=80"
              }
              width={600}
              height={360}
              alt={name}
              className={shopImg}
              objectFit='cover'
            />
          </div>
        </div>

        <div className={`glass ${col2}`}>
          {address && (
            <div className={iconWrapper}>
              <Image src='/static/icons/places.svg' width={24} height={24} alt='' />
              <p className={text}>{address}</p>
            </div>
          )}
          {neighborhood && (
            <div className={iconWrapper}>
              <Image src='/static/icons/nearMe.svg' width={24} height={24} alt='' />
              <p className={text}>{neighborhood}</p>
            </div>
          )}
          <div className={iconWrapper}>
            <Image src='/static/icons/star.svg' width={24} height={24} alt='' />
            <p className={text}>{voteCount}</p>
          </div>

          <button className={upvoteButton} onClick={handleUpvote}>
            Upvote
          </button>
        </div>
      </div>
    </div>
  );
}
