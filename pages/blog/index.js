import BlogSection from '@/components/Blog'
import Footer from '@/components/Footer'
import Head from 'next/head'

function Index() {

  return (
    <>
      <Head>
        <title>Blog | Rosnept</title>
        <meta
          name="description"
          content="Stay updated with the latest insights, news, and expert analysis on cryptocurrency, sustainable energy investments, and more at Rosnept."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <BlogSection sliceCount={6} />
      <Footer />
    </>
  )
}

export default Index