//icon
import icon1 from "../../../assets/gearbox.png";
import icon2 from "../../../assets/carrey.png";
import icon3 from "../../../assets/seat-belt.png";
import icon4 from "../../../assets/fan-heater.png";

const IconDetailCar = () => {
  return (
    <div className="grid grid-cols-2 gap-4 w-full mb-4">
      <div className="flex items-center text-left">
        <img src={icon4} alt="کولر" className="w-6 h-6 mr-2" />
        <p className="text-gray-700 text-sm">کولر دارد</p>
      </div>
      <div className="flex items-center text-left">
        <img src={icon2} alt="4 درب" className="w-6 h-6 mr-2" />
        <p className="text-gray-700 text-sm">4 درب</p>
      </div>
      <div className="flex items-center text-left">
        <img src={icon1} alt="دنده اتومات" className="w-6 h-6 mr-2" />
        <p className="text-gray-700 text-sm">دنده اتومات</p>
      </div>
      <div className="flex items-center text-left">
        <img src={icon3} alt="ظرفیت" className="w-6 h-6 mr-2" />
        <p className="text-gray-700 text-sm">5 ظرفیت</p>
      </div>
    </div>
  );
};

export default IconDetailCar;
