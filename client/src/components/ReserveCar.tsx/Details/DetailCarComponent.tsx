//components
import IconDetailCar from "../IconDetailCar";
import HeroBaner from "../../Main/HeroBaner";
import GaleryCarComponent from "./GaleryCarComponent";
import PriceComponent from "./PriceComponent";

type DetailCarComponentProps = {
  carTitle: string;
  carImages: string[];
  id:number
};

const DetailCarComponent = ({
  carTitle,
  carImages,
}: DetailCarComponentProps) => {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <GaleryCarComponent carImages={carImages} />
        <div className="lg:col-span-1">
          <h1 className="text-3xl font-bold text-blue-600 mb-4">{carTitle}</h1>
          <PriceComponent />
          <IconDetailCar />
        </div>
      </div>
      <HeroBaner />
    </div>
  );
};
export default DetailCarComponent;
