import Link from 'next/link'
import { motion } from 'framer-motion'
import Head from 'next/head'

export default function Custom404() {
  return (
    <>
      <Head>
        <title>Page Not Found | Rosnept</title>
      </Head>

      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-6xl lg:text-8xl font-bold tracking-tight"
        >
          404
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-4 text-lg text-gray-400"
        >
          The page you're looking for doesn't exist.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-8"
        >
          <Link href="/" passHref>
            <motion.div
              className="inline-block border border-white text-white px-6 py-3 uppercase text-sm font-barlow hover:bg-white hover:text-black transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Back to Home
            </motion.div>
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6 text-sm text-gray-600"
        >
          &copy; {new Date().getFullYear()} Rosnept
        </motion.p>
      </div>
    </>
  )
}
