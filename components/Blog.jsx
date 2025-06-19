import { FaUser } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

const blogs = [
    {
      id: 1,
      image: "/blg-6.png",
      date: { day: 22, month: "JUN" },
      author: "Isabella Turner",
      title: "How Blockchain is Revolutionizing Financial Transparency",
      content:
        "Learn how blockchain's inherent transparency can revolutionize the financial world. Understand its role in creating trust and accountability in investments, especially in the crypto space.",
      slug: "/blog/blockchain-financial-transparency",
    },
    {
        id: 2,
        image: "/blg-2.jpg",
        date: { day: 15, month: "AUG" },
        author: "Olivia Matthews",
        title: "Understanding rosnep-Neutral Strategies in Crypto Investments",
        content:
          "Delve into the concept of rosnep-neutral strategies in the crypto market. Learn how this strategy helps mitigate risks and maintain steady returns in volatile markets.",
        slug: "/blog/rosnep-neutral-crypto-strategies",
    },
    {
        id: 3,
        image: "/blg-4.jpg",
        date: { day: 12, month: "OCT" },
        author: "Olivia Matthews",
        title: "Maximizing Returns with Green Cryptocurrency Mining",
        content:
          "Understand the potential of green cryptocurrency mining. Learn how sustainable energy sources are being used to power crypto mining operations while maintaining profitability and reducing carbon footprints.",
        slug: "/blog/green-crypto-mining",
    },
    {
      id: 4,
      image: "/blg-1.jpg",
      date: { day: 27, month: "SEPT" },
      author: "Samuel Brooks",
      title: "The Future of Cryptocurrency in Sustainable Investments",
      content:
        "Explore the intersection of cryptocurrency and sustainability. Learn how blockchain technology is being leveraged to promote eco-friendly investments and drive change in the renewable energy sector.",
      slug: "/blog/cryptocurrency-sustainable-investments",
    },
    {
      id: 5,
      image: "/blg-1.jpg",
      date: { day: 9, month: "MAY" },
      author: "Isabella Turner",
      title: "The Impact of Cryptocurrency on the Global Energy Market",
      content:
        "Dive into the growing impact of cryptocurrency on the global energy market. Learn about its potential to drive sustainability and accelerate the adoption of clean energy solutions worldwide.",
      slug: "/blog/crypto-global-energy-impact",
    },
    {
      id: 6,
      image: "/img-4.png",
      date: { day: 6, month: "JUL" },
      author: "Samuel Brooks",
      title: "Blockchain's Role in the Renewable Energy Sector",
      content:
        "Discover how blockchain technology is transforming the renewable energy sector. Learn about smart grids, decentralized energy exchanges, and how they’re making clean energy more accessible.",
      slug: "/blog/blockchain-renewable-energy",
    },
  ];
  

const BlogSection = ({ sliceCount = 3 }) => {
  return (
    <section className="w-full bg-white py-16 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto text-start">
            <p className="text-sm uppercase text-gray-500 mb-2">Insights & Articles</p>
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-10 font-garamond">
              Insights on Crypto, Energy & Smart Investments
            </h2>
        </div>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {blogs.slice(0, sliceCount).map((blog) => (
            <div key={blog.id} className="bg-white shadow-md p-4 flex flex-col">
                <Image
                src={blog.image}
                alt={blog.title}
                height={800}
                width={800}
                className="w-full h-40 object-cover"
                />
                <div className="flex items-center mt-4">
                <div className="bg-gray-200 text-gray-700 w-12 h-12 flex flex-col justify-center items-center text-center mr-4">
                    <span className="text-lg font-bold">{blog.date.day}</span>
                    <span className="text-xs">{blog.date.month}</span>
                </div>
                <div className="text-gray-700 text-sm flex items-center">
                    <FaUser className="mr-2" />
                    <span>{blog.author}</span>
                </div>
                </div>
                <h3 className="mt-4 font-semibold text-lg text-gray-800">
                {blog.title}
                </h3>
                <p className="text-gray-600 mt-2 text-sm">
                <Link href={blog.slug} className="hover:text-custom-two font-barlow">
                    {blog.content.split(" ").slice(0, 20).join(" ")}...
                </Link>
                </p>
            </div>
            ))}
        </div>
    </section>
  );
};

export default BlogSection;