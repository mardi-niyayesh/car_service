import { useCategories } from "../../hooks/useCategories";
import { useNavigate } from "react-router-dom";
const ShowCategoryForm = () => {
  const navigate = useNavigate();
  const { loading, categories } = useCategories();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <span className="mr-2 text-gray-600">بارگذاری دسته بندی ها...</span>
      </div>
    );
  }

  if (!categories.length) {
    return (
      <div className="text-center text-gray-500 py-8">
        هیچ دسته‌بندی یافت نشد
      </div>
    );
  }
  const hadleCategory = (slug: string) => {
    navigate(`/category/${slug}`);
  };
  return (
    <div className="w-full bg-white py-6 px-4 rounded-xl ">
 
      <div className="flex flex-wrap gap-3 justify-center md:justify-center">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className="inline-block px-5 py-2 bg-yellow-500 hover:bg-yellow-600 text-white hover:text-white rounded transition-all duration-200 shadow-sm  cursor-pointer"
            onClick={() => hadleCategory(cat.slug)}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ShowCategoryForm;
