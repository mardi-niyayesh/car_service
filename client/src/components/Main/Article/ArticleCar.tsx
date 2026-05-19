import ComponentArticleCar from "./ComponentArticleCar";

const ArticleCar = () => {
  return (
    <>
      <div className="mt-8 mb-8 container mx-auto flex items-center justify-between">
        <div className="font-bold text-blue-800 text-2xl  my-5">
          مقالات کار سرویس
        </div>
      </div>
      <ComponentArticleCar />
    </>
  );
};

export default ArticleCar;
