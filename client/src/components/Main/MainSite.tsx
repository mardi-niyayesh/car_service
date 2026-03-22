//components
import CarParts from "./CarParts";
import WhyAutoRent from "./WhyAutoRent";
import ArticleCar from "./Article/ArticleCar";
import DetailCarService from "./DetailCarService";
import Desctiption from "./Desctiption";
import ComponentQuestion from "./Question/ComponentQuestion";
import Comment from "../../ComponentPublic/Comment";

const MainSite = () => {
  return (
    <>
      <DetailCarService />
      <CarParts />
      <WhyAutoRent />
      <Desctiption />
      <ArticleCar />
      <ComponentQuestion />
      <Comment/>
    </>
  );
};

export default MainSite;
