import { useQuery } from "@apollo/client";
import { GET_BLOG_POSTS } from "../app/queries";
import Link from "next/link";
import he from "he";

const NewsList = () => {
  const { loading, error, data } = useQuery(GET_BLOG_POSTS, {
    variables: {
      filter: { category_id: { eq: 19 } },
      pageSize: 5,
      currentPage: 1,
      sortFiled: "publish_time",
      allPosts: false,
    },
  });

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p>Lỗi: {error.message}</p>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-black ">Tin tức mới nhất</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.blogPosts.items.map((post: any) => (
          <div key={post.post_url} className="border rounded-lg overflow-hidden shadow-lg">
            <img src={post.featured_image} alt={post.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-lg text-black  font-semibold">{post.title}</h3>
              <p className="text-gray-600 text-sm">{he.decode(post.meta_description) || "N/A"}</p>
              <p className="text-gray-500 text-xs mt-2">Đăng bởi: {post.author?.name || "N/A"} - {new Date(post.publish_time).toLocaleDateString()}</p>
              <Link href={post.post_url} className="text-blue-500 mt-2 inline-block">Đọc tiếp</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsList;
