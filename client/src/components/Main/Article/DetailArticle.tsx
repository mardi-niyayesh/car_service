import { useParams } from "react-router-dom";
import { Article } from "./DataArticle";
import ComponentDetail from "../Blog/ComponentDetail";
import { useNavigate } from "react-router-dom";
const DetailArticle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // console.log(id);

  const AllArt = Article.find((article) => article.id === parseInt(id));
  
  if (!AllArt) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-red-600">
          مقاله مورد نظر یافت نشد!
        </h2>
        <button
          onClick={() => navigate("/")}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          بازگشت به صفحه اصلی
        </button>
      </div>
    );
  }

  return (
    <>
      <ComponentDetail
        id={AllArt.id}
        img={AllArt.img}
        title={AllArt.title}
        des={AllArt.des}
      />
    </>
  );
};

export default DetailArticle;
