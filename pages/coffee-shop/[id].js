import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import coffeeShops from '../../data/coffee-stores.json';
import styles from '../../styles/CoffeeShopPage.module.css';
import Image from 'next/image';

export default function CoffeeShopPage({ coffeeShop }) {
  const router = useRouter();
  const { query } = router;
  // console.log(coffeeShop);

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const { name, address, neighbourhood, imgUrl } = coffeeShop;

  let votes = 1;

  const handleUpvote = (e) => {
    console.log(e);
  };

  return (
    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.homeLink}>
            <Link href='/'>
              <a>Back to home</a>
            </Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>
          <div className={styles.shopImgWrapper}>
            <Image
              src={imgUrl}
              width={600}
              height={360}
              alt={name}
              className={styles.shopImg}
              objectFit='cover'
            />
          </div>
        </div>

        <div className={`glass ${styles.col2}`}>
          <div className={styles.iconWrapper}>
            <Image src='/static/icons/places.svg' width={24} height={24} alt='' />
            <p className={styles.text}>{address}</p>
          </div>
          <div className={styles.iconWrapper}>
            <Image src='/static/icons/nearMe.svg' width={24} height={24} alt='' />
            <p className={styles.text}>{neighbourhood}</p>
          </div>
          <div className={styles.iconWrapper}>
            <Image src='/static/icons/star.svg' width={24} height={24} alt='' />
            <p className={styles.text}>{votes}</p>
          </div>

          <button className={styles.upvoteButton} onClick={handleUpvote}>
            Upvote
          </button>
        </div>
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  const paths = coffeeShops.map((shop) => ({
    params: { id: shop.id.toString() },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const coffeeShop = coffeeShops.find((shop) => {
    return shop.id.toString() === params.id;
  });

  return {
    props: {
      coffeeShop: coffeeShop,
    },
  };
}
