import CarParts from "./CarParts";
import WhyAutoRent from "./WhyAutoRent";
import ArticleCar from "./Article/ArticleCar";
import DetailCarService from "./DetailCarService";
import Desctiption from "./Desctiption";
import ComponentQuestion from "./Question/ComponentQuestion";
import ShowProductMain from "./Product/ShowProductMain";

const MainSite = () => {
  return (
    <>
      <DetailCarService />
      <WhyAutoRent />
      <CarParts />
      <ArticleCar />
      <Desctiption />
      <ShowProductMain />
      <ComponentQuestion />
    </>
  );
};

export default MainSite;
