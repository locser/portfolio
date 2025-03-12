import { cn } from "@/src/lib/utils";

interface BlogPost {
  id: number;
  title: string;
  description: string;
  date: string;
  readTime: string;
  image?: string;
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Building Modern Web Applications",
    description: "Explore the latest techniques and best practices for creating responsive, performant web applications using React and Next.js.",
    date: "2024-01-15",
    readTime: "5 min read",
    image: "/blog1.jpg"
  },
  {
    id: 2,
    title: "The Future of Web Development",
    description: "Discover emerging trends and technologies that are shaping the future of web development.",
    date: "2024-01-10",
    readTime: "3 min read",
    image: "/blog2.jpg"
  },
  {
    id: 3,
    title: "Mastering TypeScript",
    description: "A comprehensive guide to using TypeScript effectively in your projects.",
    date: "2024-01-05",
    readTime: "7 min read",
    image: "/blog3.jpg"
  }
];

const getRandomSpan = () => {
  const spans = [2, 3, 4, 5];
  return spans[Math.floor(Math.random() * spans.length)];
};

const getRandomHeight = () => {
  const heights = ['15rem', '20rem', '25rem'];
  return heights[Math.floor(Math.random() * heights.length)];
};

const BlogPost = ({ post }: { post: BlogPost }) => {
  const randomSpan = getRandomSpan();
  const randomHeight = getRandomHeight();

  return (
    <div
      className={cn(
        "relative rounded-3xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2] bg-white border border-transparent flex flex-col space-y-4 overflow-hidden",
        `md:col-span-${randomSpan}`
      )}
      style={{
        background: 'rgb(4,7,29)',
        backgroundColor: 'linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(4,7,29,1) 35%, rgba(11,12,33,1) 100%)',
        minHeight: randomHeight
      }}
    >
      {post.image && (
        <div className="relative w-full h-40 overflow-hidden rounded-2xl">
          <img src={post.image} alt={post.title} className="object-cover w-full h-full" />
        </div>
      )}
      <div className="group-hover/bento:translate-x-2 transition duration-200 flex-1 flex flex-col min-h-0">
        <div className="flex items-center space-x-2 text-sm text-neutral-400">
          <span className="truncate">{post.date}</span>
          <span>•</span>
          <span className="truncate">{post.readTime}</span>
        </div>
        <h3 className="font-sans font-bold text-neutral-200 text-xl mt-2 ">
          {post.title}
        </h3>
        <p className="font-sans font-normal text-neutral-400 text-sm mt-2 flex-1">
          {post.description.length > 100 ? `${post.description.slice(0, 100)}...` : post.description}
        </p>
        <button className="text-neutral-200 text-sm hover:text-neutral-50 transition-colors mt-4 w-fit">
          Read more →
        </button>
      </div>
    </div>
  );
};

const Blog = () => {
  return (
    <section id="blog" className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-neutral-200 mb-8">Latest Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {blogPosts.map((post) => (
            <BlogPost key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;