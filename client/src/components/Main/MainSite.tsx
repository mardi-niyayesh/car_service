//components
import CarParts from "./CarParts";
import WhyAutoRent from "./WhyAutoRent";
import ArticleCar from "./Article/ArticleCar";
import DetailCarService from "./DetailCarService";
import Desctiption from "./Desctiption";
import ComponentQuestion from "./Question/ComponentQuestion";
import Comment from "../../ComponentPublic/Comment";
import Product from "../Product";

const MainSite = () => {
  return (
    <>
      <DetailCarService />
      <CarParts />
      <WhyAutoRent />

      <ArticleCar />
      <Desctiption />
      <ComponentQuestion />
      {/* for a test and later refactor */}
      <div className="container max-auto  m-auto  grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 rounded-xl ">
        <Product />
        <Product />
        <Product />
      </div>
      <Comment />
    </>
  );
};

export default MainSite;
