import { useCategories } from "../../hooks/useCategories";

const ShowCategoryForm = () => {
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

  return (
    <div className="w-full bg-white py-6 px-4 rounded-xl shadow-sm">
      <h2 className="text-xl font-bold text-right text-gray-800 mb-4 border-r-4 border-blue-500 pr-3">
        دسته‌بندی ماشین‌ها
      </h2>
      <div className="flex flex-wrap gap-3 justify-center md:justify-start">
        {categories.map((cat) => (
          <a
            key={cat.id}
            href={`/category/${cat.slug}`}
            className="inline-block px-5 py-2 bg-gray-100 hover:bg-blue-600 text-gray-700 hover:text-white rounded-full transition-all duration-200 shadow-sm text-sm font-medium cursor-pointer"
          >
            {cat.name}
          </a>
        ))}
      </div>
    </div>
  );
};

export default ShowCategoryForm;
