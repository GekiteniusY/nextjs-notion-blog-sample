import { Fragment } from 'react';
import Head from 'next/head';
import Link from 'next/link';

import {
  getDatabase, getBlocks, getPageFromSlug,
} from '../../../lib/notion';
import Text from '../../../components/text';
import { renderBlock } from '../../../components/notion/renderer';
import styles from '../../../styles/post.module.css';

// export const dynamic = 'error';
// export const dynamicParams = true;

// Return a list of `params` to populate the [slug] dynamic segment
export async function generateStaticParams() {
  const database = await getDatabase();
  return database?.map((page) => {
    console.log(page);
    const slug = page.properties?.Slug?.rich_text[0].text.content;
    console.log(slug);
    return ({ id: page.id, slug });
  });
}

// TODO: ビルド時のエラーをわかりやすくするためにプロップスの読み込み処理を切り出す

export default async function Page({ params }) {
  const page = await getPageFromSlug(params?.slug);
  const blocks = await getBlocks(page?.id);

  if (!page || !blocks) {
    return <div />;
  }

  return (
    <div>
      <Head>
        <title>{page.properties.Title?.rich_text[0].plain_text}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <article className={styles.container}>
        <h1 className={styles.name}>
          {/*  */}
          <Text title={page.properties.Title?.rich_text} />
        </h1>
        <section>
          {blocks.map((block) => (
            <Fragment key={block.id}>{renderBlock(block)}</Fragment>
          ))}
          <Link href="/" className={styles.back}>
            ← Go home
          </Link>
        </section>
      </article>
    </div>
  );
}
