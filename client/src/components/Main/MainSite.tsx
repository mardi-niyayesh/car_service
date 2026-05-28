import CarParts from "./CarParts";
import WhyAutoRent from "./WhyAutoRent";
import ArticleCar from "./Article/ArticleCar";
import DetailCarService from "./DetailCarService";
import Desctiption from "./Desctiption";
import ComponentQuestion from "./Question/ComponentQuestion";
import AllProductMain from "./Product/AllProductMain";

const MainSite = () => {
  return (
    <>
      <DetailCarService />
      <WhyAutoRent />
      <CarParts />
      <ArticleCar />
      <Desctiption />
      <AllProductMain />
      <ComponentQuestion />
    </>
  );
};

export default MainSite;
