import { useParams, useNavigate } from "react-router-dom";
import { allBlogs } from "./DataBlog";
import ComponentDetail from "./ComponentDetail";

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const blog = allBlogs.find((blog) => blog.id === parseInt(id));

  if (!blog) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-red-600">
          بلاگ مورد نظر یافت نشد!
        </h2>
        <button
          onClick={() => navigate("/blog")}
          className="mt-4 bg-yellow-600 text-white px-4 py-2 rounded"
        >
          بازگشت به صفحه بلاگ
        </button>
      </div>
    );
  }

  return <ComponentDetail img={blog.img} title={blog.title} des={blog.des} />;
};

export default BlogDetail;
