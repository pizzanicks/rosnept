export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6">
      <h1 className="text-5xl font-extrabold mb-4">
        Tailwind CSS is <span className="text-yellow-300">working!</span>
      </h1>
      <p className="text-lg max-w-xl text-center">
        Congratulations! Your Next.js app is successfully styled using Tailwind CSS.
      </p>
      <button className="mt-8 px-6 py-3 bg-yellow-400 text-indigo-900 font-semibold rounded-lg shadow-lg hover:bg-yellow-300 transition">
        Awesome Button
      </button>
    </main>
  );
}
