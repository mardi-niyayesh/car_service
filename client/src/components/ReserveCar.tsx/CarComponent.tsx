//components
import IconDetailCar from "./IconDetailCar";
//hooks
import { useNavigate } from "react-router-dom";
type carcomponent = {
  id: number|string;
  img: string;
  title: string;
  price: string;
  duration: string;
};
const CarComponent = ({ img, title, price, duration,id }: carcomponent) => {
  const navigate = useNavigate();
  //component for view detail car
  const handleViewDetails = () => {
    navigate(`/car-details/${id}`);
  };
  if (!img || !title || !price || !duration) return null;
  return (
    <div className="flex flex-col items-center text-center border border-gray-200 rounded-lg shadow-sm p-4">
      <img
        src={img}
        alt={title}
        className="w-full h-48 object-cover rounded-t-lg mb-4"
      />
      <div className="flex flex-col items-center w-full mb-4">
        <p className="font-bold text-lg text-gray-800 mb-2">{title}</p>
        <p className="text-blue-600 font-semibold text-xl mb-2">{price}</p>
        <span className="text-sm text-gray-500">{duration}</span>
      </div>
      <IconDetailCar />
      <button
        onClick={handleViewDetails}
        className="w-full text-center text-white p-2 font-bold hover:bg-blue-800 bg-blue-600 rounded-lg mt-auto"
      >
        مشاهده ی مشخصات و رزرو
      </button>
    </div>
  );
};
export default CarComponent;
