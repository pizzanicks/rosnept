import { useRouter } from "next/router";
import { FaUser, FaArrowLeft } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

// Hardcoded blog data
const blogs = [
  {
    id: 1,
    image: "/b1.jpg",
    date: { day: 27, month: "SEPT" },
    author: "Michael J. Emmanuel",
    title: "Streamlining Your Supply Chain for Better Efficiency",
    content:
      "In today’s fast-paced world, optimizing your supply chain is crucial for staying ahead. This blog explores strategies for improving operational efficiency, from better inventory management to adopting automation tools. By streamlining processes, businesses can cut down on lead times, reduce operational costs, and enhance the overall customer experience. Whether you're a small business or a large enterprise, implementing these strategies will ensure that your logistics operations are both cost-effective and responsive to market demands.",
    slug: "streamlining-your-supply-chain",
  },
  {
    id: 2,
    image: "/b2.jpg",
    date: { day: 15, month: "AUG" },
    author: "Mary Anderson",
    title: "The Importance of Freight Forwarding in Global Trade",
    content:
      "Freight forwarding is a pivotal service in global trade, acting as a bridge between suppliers, transporters, and customers. This post delves into how freight forwarding works and why it’s essential for businesses looking to expand internationally. Learn about the complexities of customs regulations, the selection of transportation modes, and the importance of choosing a reliable freight forwarder. With global trade evolving rapidly, understanding the role of freight forwarding can significantly enhance your business's logistics strategy.",
    slug: "freight-forwarding-global-trade",
  },
  {
    id: 3,
    image: "/b3.jpg",
    date: { day: 6, month: "JUL" },
    author: "Michael J. Emmanuel",
    title: "Warehousing Solutions for Growing Businesses",
    content:
      "As businesses scale, having the right warehousing solutions becomes critical to meet demand and improve efficiency. In this blog, we explore different types of warehousing options, including third-party logistics (3PL) and automated warehouses. We'll discuss how businesses can leverage technology, such as inventory management systems and robotics, to streamline operations. Whether you're expanding regionally or internationally, adopting scalable warehousing solutions will ensure that you can maintain control over your inventory and meet customer demands effectively.",
    slug: "warehousing-solutions",
  },
  {
    id: 4,
    image: "/b4.jpg",
    date: { day: 12, month: "OCT" },
    author: "Michael J. Emmanuel",
    title: "Innovations in Last-Mile Delivery",
    content:
      "The last mile of delivery is often the most challenging but also the most crucial for customer satisfaction. This post highlights recent innovations in last-mile delivery, such as drone delivery, autonomous vehicles, and smart lockers. We explore how these technologies are reshaping the way goods are delivered to consumers, providing faster, more efficient, and cost-effective solutions. With customer expectations rising, businesses that embrace these innovations can gain a competitive edge in the fast-evolving logistics industry.",
    slug: "last-mile-delivery",
  },
  {
    id: 5,
    image: "/b5.jpg",
    date: { day: 22, month: "JUN" },
    author: "Mary Anderson",
    title: "Reducing Costs with Smart Transportation Strategies",
    content:
      "Transportation is one of the largest expenses for any business that relies on logistics. In this blog, we explore various smart transportation strategies that can help reduce costs while maintaining service quality. From route optimization and fuel-efficient vehicles to adopting advanced tracking technologies, these strategies allow businesses to minimize waste and improve operational efficiency. Learn how leveraging data analytics and real-time insights can lead to better decision-making and ultimately drive down transportation expenses for your company.",
    slug: "smart-transportation-strategies",
  },
  {
    id: 6,
    image: "/b6.jpg",
    date: { day: 9, month: "MAY" },
    author: "Mary Anderson",
    title: "Sustainability in Logistics: The Road Ahead",
    content:
      "Sustainability is becoming a key focus for businesses, especially in logistics, where environmental impact can be significant. In this post, we examine the importance of adopting sustainable practices within the logistics industry. From eco-friendly packaging and energy-efficient transportation to carbon-neutral warehousing, we discuss the different ways businesses can reduce their environmental footprint. This blog also highlights the long-term benefits of sustainability, not just for the planet, but also in terms of cost savings and brand reputation.",
    slug: "sustainability-logistics",
  },
];

const BlogPost = () => {
  const router = useRouter();
  const { slug } = router.query;

  // Find the blog post by slug
  const blog = blogs.find((post) => post.slug === slug);

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h1 className="text-2xl font-semibold text-gray-800">
          Blog post not found
        </h1>
      </div>
    );
  }

  // Filter out the featured blogs (exclude the previewed one)
  const featuredBlogs = blogs.filter((post) => post.slug !== slug);

  return (
    <div className="min-h-screen bg-gray-100 py-16 px-6">
        <Link href="/" passHref className="absolute left-4 lg:left-16 top-4">
            <button className="flex items-center text-base lg:text-lg text-blue-600 hover:text-blue-800 mb-4">
                <FaArrowLeft className="mr-2" />
                <span>Go to Home</span>
            </button>
        </Link>
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row">
            {/* Main blog post section */}
            <div className="w-full lg:w-3/4 bg-white shadow-md rounded-lg overflow-hidden mb-8 lg:mb-0">
            <Image
                src={blog.image}
                alt={blog.title}
                height={800}
                width={800}
                className="w-full h-64 object-cover"
            />
            <div className="p-6">
                <div className="flex items-center mb-4">
                <div className="bg-gray-200 text-gray-700 w-12 h-12 flex flex-col justify-center items-center text-center mr-4">
                    <span className="text-lg font-bold">{blog.date.day}</span>
                    <span className="text-xs">{blog.date.month}</span>
                </div>
                <div className="text-gray-700 text-sm flex items-center">
                    <FaUser className="mr-2" />
                    <span>{blog.author}</span>
                </div>
                </div>
                <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-4">
                {blog.title}
                </h1>
                <p className="text-gray-600 text-lg leading-relaxed">{blog.content}</p>
            </div>
            </div>

            {/* Featured blogs section */}
            <div className="w-full lg:w-1/4 lg:ml-8">
            <div className="sticky top-12">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Featured Blogs</h2>
                <div className="space-y-4">
                {featuredBlogs.map((featuredBlog) => (
                    <Link key={featuredBlog.id} href={`/blog/${featuredBlog.slug}`} passHref>
                    <div className="bg-white shadow-sm rounded-lg overflow-hidden cursor-pointer mb-2 hover:bg-gray-100">
                        <div className="flex items-center">
                        <img
                            src={featuredBlog.image}
                            alt={featuredBlog.title}
                            className="w-32 h-32 object-cover mr-4"
                        />
                        <div className="p-4">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            {featuredBlog.title}
                            </h3>
                            <p className="text-gray-600 text-sm">{featuredBlog.date.month} {featuredBlog.date.day}</p>
                        </div>
                        </div>
                    </div>
                    </Link>
                ))}
                </div>
            </div>
            </div>
        </div>
    </div>
  );
};

export default BlogPost;