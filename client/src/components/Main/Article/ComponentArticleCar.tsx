import { Article } from "./DataArticle";
import { Link } from "react-router-dom";

const ComponentArticleCar = () => {
  return (
    <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
      {Article.map((item) => (
        <div
          className="w-full bg-white border border-[#D7D7D7] p-4 md:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 mx-auto"
          key={item.id}
        >
          <img
            src={item.img}
            alt="اجاره خودرو"
            className="w-100%  h-auto rounded-lg mb-4"
          />
          <p className="text-[#414141] font-medium text-base md:text-lg mb-2 line-clamp-2">
            {item.title}
          </p>
          <p className="text-[#757575] text-sm md:text-base leading-relaxed line-clamp-3 md:line-clamp-4">
            {item.text}
          </p>

          <Link to={`/articles/${item.id}`}>
            <button className="cursor-pointer w-full text-center bg-blue-600 text-white p-3 rounded-lg mt-4 hover:bg-blue-800">
              اطلاعات بیشتر
            </button>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ComponentArticleCar;
