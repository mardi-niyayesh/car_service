import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
          className="font-bold text-yellow-600 text-2xl text-center"
        >
          مقاله های شرکت کارسرویس
        </motion.h2>

        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-6 p-4">
          {mainBlog.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{
                opacity: 0,
                y: 40,
                scale: 0.97,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              transition={{
                duration: 0.6,
                delay: index * 0.12,
                ease: "easeOut",
              }}
              whileHover={{
                y: -5,
              }}
              whileTap={{
                scale: 0.98,
              }}
              className="relative group overflow-hidden rounded-lg shadow-lg cursor-pointer"
              onClick={() => handleClick(item.id)}
            >
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
              />

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.25 + index * 0.12,
                }}
                className="
    absolute
    bottom-3
    left-1/2
    -translate-x-1/2

    w-[calc(100%-1.5rem)]
    max-w-[90%]

    rounded-xl
    bg-white/20
    p-2.5
    backdrop-blur-md
    shadow-lg
    ring-1
    ring-white/60

    sm:bottom-4
    sm:w-4/5
    sm:p-3
  "
              >
                <p
                  className="
      break-words
      text-center
      text-sm
      font-bold
      leading-6
      text-white

      sm:text-base
      sm:leading-7

      md:text-lg
      lg:text-xl
    "
                >
                  {item.title}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      <div>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
          className="font-bold text-yellow-600 text-2xl my-8 text-center"
        >
          جدیدترین مطالب
        </motion.h1>

        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-4">
          {newBlog.map((blog, index) => (
            <motion.div
              key={blog.id}
              initial={{
                opacity: 0,
                y: 35,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              whileHover={{
                y: -7,
              }}
              whileTap={{
                scale: 0.97,
              }}
              className="bg-gray-500 rounded-xl cursor-pointer overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
              onClick={() => handleClick(blog.id)}
            >
              <div className="overflow-hidden h-48">
                <motion.img
                  src={blog.img}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                  whileHover={{
                    scale: 1.1,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: "easeOut",
                  }}
                />
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.5,
                  delay: 0.2 + index * 0.1,
                }}
                className="text-gray-300 p-4 text-xl font-medium leading-6 group-hover:text-white transition-colors duration-300"
              >
                {blog.title}
              </motion.p>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
};

export default BlogPage;
