import { useParams } from "react-router-dom";
import GetAllProduct from "./GetAllProduct";
import { useProduct } from "../../hooks/useProduct";
import { useCategories } from "../../hooks/useCategories";

const ProductComponent = () => {
  const { allProduct, loading: productloding } = useProduct();
  const { categories, loading: categoryloding } = useCategories();
  const { slug } = useParams();
  console.log("slug for product component : ", slug);

  if (productloding || categoryloding) {
    return (
      <div className="text-center text-gray-500 py-8">
        در حال بارگذاری محصولات...
      </div>
    );
  }

  const findCat = categories.find((cat) => cat.slug === slug);
  console.log("caninf :", findCat);
  if (!findCat) {
    return (
      <div className="text-center text-gray-500 py-8 ">
        دسته بندی مورد نظر یافت نشد
      </div>
    );
  }

  const categoryName = findCat?.name;

  const categoryId = findCat?.id;
  console.log("categoryId :", categoryId);

  const filteredProducts = allProduct.filter(
    (pro) => pro.category_id === categoryId,
  );
  console.log("filteredProducts :", filteredProducts);

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8 ">
        هیج محصولی در این دسته بندی وجود ندارد
      </div>
    );
  }
  return (
    <>
      <div className="text-[#FDB713] text-3xl items-center font-bold justify-center flex">
        <span>{categoryName}</span>
      </div>

      <div
        className="w-full px-4 mx-auto 
                grid grid-cols-1 
                min-[700px]:grid-cols-2 
                lg:grid-cols-3 
                gap-6"
      >
        {filteredProducts.map((pro) => (
          <GetAllProduct key={pro.id} product={pro} />
        ))}
      </div>
    </>
  );
};

export default ProductComponent;
