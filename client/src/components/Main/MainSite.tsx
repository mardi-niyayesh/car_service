import CarParts from "./CarParts";
import WhyAutoRent from "./WhyAutoRent";
import ArticleCar from "./Article/ArticleCar";
import DetailCarService from "./DetailCarService";
import Desctiption from "./Desctiption";
import ComponentQuestion from "./Question/ComponentQuestion";
import ProductMain from "./Product/AllProductMain";

const MainSite = () => {
  return (
    <>
      <DetailCarService />
      <WhyAutoRent />
      <CarParts />
      <ArticleCar />
      <Desctiption />
      <ProductMain />
      <ComponentQuestion />
    </>
  );
};

export default MainSite;
