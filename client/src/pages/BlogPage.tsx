import { useNavigate } from "react-router-dom";
import { allBlogs } from "../components/Main/Blog/DataBlog";

const BlogPage = () => {
  const navigate = useNavigate();

  const handleClick = (id: number) => {
    navigate(`/blog/${id}`);
  };

  const mainBlog = allBlogs.filter((blog) => blog.category === "main");
  const newBlog = allBlogs.filter((blog) => blog.category === "new");

  return (
    <>
      <div className="py-10">
        <h2 className="font-bold text-yellow-600 text-2xl text-center">
          مقاله های شرکت کارسرویس
        </h2>
        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-6 p-4">
          {mainBlog.map((item) => (
            <div
              key={item.id}
              className="relative group overflow-hidden rounded-lg shadow-lg cursor-pointer"
              onClick={() => handleClick(item.id)}
            >
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 -translate-y-1/2 transform w-4/5 p-2 rounded-xl shadow-lg backdrop-blur-sm ring-1 ring-white/60 bg-white/20">
                <p className="font-bold text-white text-center text-lg sm:text-xl lg:text-xl">
                  {item.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h1 className="font-bold text-yellow-600 text-2xl my-8 text-center">
          جدیدترین مطالب
        </h1>
        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-4">
          {newBlog.map((blog) => (
            <div
              key={blog.id}
              className="bg-gray-500 rounded-xl cursor-pointer overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
              onClick={() => handleClick(blog.id)}
            >
              <div className="overflow-hidden h-48">
                <img
                  src={blog.img}
                  alt={blog.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <p className="text-gray-300 p-4 text-xl font-medium leading-6 group-hover:text-white transition-colors duration-300">
                {blog.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default BlogPage;
