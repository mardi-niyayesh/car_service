//components
import CarParts from "./CarParts";
import WhyAutoRent from "./WhyAutoRent/WhyAutoRent";
import Slider from "./Slider";
import ReserveAutorent from "./ReserveAutorent";
import FeacherBoxcommentUser from "../comment/FeacherBoxcommentUser";
import ArticleCar from "./Article/ArticleCar";
import DetailCarService from "./DetailCarService";
import Desctiption from "./Desctiption";
import ComponentQuestion from "./Question/ComponentQuestion";

const MainSite = () => {
  return (
    <>
      <DetailCarService />
      <CarParts />
      <WhyAutoRent />
      <Desctiption />
      <ArticleCar />
      <ComponentQuestion />
      <Slider />
      <ReserveAutorent />
      <FeacherBoxcommentUser />
    </>
  );
};

export default MainSite;
