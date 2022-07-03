import Image from 'next/image';
import Link from 'next/link';
import cls from 'classnames';
import styles from './Card.module.css';

export default function Card({ name, imgUrl, storeId, url }) {
  return (
    <div>
      <Link href={url}>
        <a className={styles.cardLink}>
          <div className={cls('glass', styles.container)}>
            <div className={styles.cardHeaderWrapper}>
              <h2 className={styles.cardHeader}>{name}</h2>
            </div>
            <div className={styles.cardImageWrapper}>
              <Image
                src={imgUrl}
                width={260}
                height={180}
                alt={name}
                className={styles.cardImage}
                objectFit='cover'
              />
            </div>
          </div>
        </a>
      </Link>
    </div>
  );
}
