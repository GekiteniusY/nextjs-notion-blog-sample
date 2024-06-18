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
    // console.log('Page object: ', page);
    // const slug = page.properties.Slug?.formula?.string;
    const slug = page.properties?.Slug?.rich_text[0].text.content;
    // console.log('Slug object: ', slug);
    return ({ id: page.id, slug });
  });
}

// getDatabase()で取得したあとの個別の要素(page)の構造
// {
//   object: 'page',
//   id: '12345678901234567890',
//   created_time: '2024-06-13T10:02:00.000Z',
//   last_edited_time: '2024-06-13T11:38:00.000Z',
//   created_by: { object: 'user', id: 'YYYYYYYYYYYYYYY' },
//   last_edited_by: { object: 'user', id: 'YYYYYYYYYYYYYYY' },
//   cover: null,
//   icon: null,
//   parent: {
//     type: 'database_id',
//     database_id: 'XXXXXXXXXXXXXXXXXXXXXXXXXXX'
//   },
//   archived: false,
//   in_trash: false,
//   properties: {
//     CreatedDate: {
//       id: '%3AXM%40',
//       type: 'created_time',
//       created_time: '2024-06-13T10:02:00.000Z'
//     },
//     'タグ': { id: 'Ex%3BH', type: 'multi_select', multi_select: [] },
//     Slug: { id: 'a%3COL', type: 'rich_text', rich_text: [Array] },
//     Title: { id: 'dR%3BD', type: 'rich_text', rich_text: [Array] },
//     AutoCreatedTitle: { id: 'title', type: 'title', title: [Array] }
//   },
//   url: 'https://www.notion.so/2024-6-13-ZZZZZZZZZZZZZZZZZZ',
//   public_url: null
// }

// TODO: ビルド時のエラーをわかりやすくするためにプロップスの読み込み処理を切り出す

export default async function Page({ params }) {
  const page = await getPageFromSlug(params?.slug);
  // console.log('Page() page object: ', page);
  const blocks = await getBlocks(page?.id);
  // console.log('Page() blocks object: ', blocks);

  if (!page || !blocks) {
    return <div />;
  }

  return (
    <div>
      <Head>
        <title>
          {() => {
            const title = page.properties.Title?.rich_text[0].plain_text;
            console.log('title is created: ', title);
            return title;
          }}
        </title>
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
