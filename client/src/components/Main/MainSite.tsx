//components
import CarParts from "./CarParts";
import WhyAutoRent from "./WhyAutoRent";
import Slider from "./Slider";
import ReserveAutorent from "./ReserveAutorent";
import FeacherBoxcommentUser from "../comment/FeacherBoxcommentUser";
import ComponentQuestion from "./ComponentQuestion/ComponentQuestion";
import ArticleCar from "./Article/ArticleCar";

const MainSite = () => {
  return (
    <>
      <CarParts />
      <WhyAutoRent />
      <Slider />
      <ReserveAutorent />
      <ComponentQuestion />
      <FeacherBoxcommentUser />
      <ArticleCar />
    </>
  );
};

export default MainSite;
