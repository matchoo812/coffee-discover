import React from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "../../styles/CoffeeShopPage.module.css";
import { fetchCoffeeShops } from "../../lib/coffeeShops";

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

export default function CoffeeShopPage({ coffeeShop }) {
  const router = useRouter();
  const { query } = router;

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  console.log(coffeeShop);
  const { name, address, neighborhood, imgUrl } = coffeeShop;
  let votes = 1;

  const handleUpvote = e => {
    console.log(e);
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
  return (
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
            <p className={text}>{votes}</p>
          </div>

          <button className={upvoteButton} onClick={handleUpvote}>
            Upvote
          </button>
        </div>
      </div>
    </div>
  );
}
