import { useCategories } from "../../../hooks/useCategories";
import CategorySection from "./CategorySection";

const CategorySections = () => {
  const { loading, categories } = useCategories();

  if (loading) {
    return (
      <div className="py-10 text-center text-gray-500">
        در حال بارگذاری دسته‌بندی‌ها...
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto px-4 py-10">
      <div className="space-y-12">
        {categories.map((category) => (
          <CategorySection key={category.id} category={category} />
        ))}
      </div>
    </section>
  );
};

export default CategorySections;
