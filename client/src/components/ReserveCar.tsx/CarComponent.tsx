//icon
import icon1 from "../../../assets/gearbox.png";
import icon2 from "../../../assets/carrey.png";
import icon3 from "../../../assets/seat-belt.png";
import icon4 from "../../../assets/fan-heater.png";

type carcomponent = {
  img: string;
  title: string;
  price: string;
  duration: string;
};

const CarComponent = ({ img, title, price, duration }: carcomponent) => {
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

      <button className="w-full text-center text-white p-2 font-bold hover:bg-blue-800 bg-blue-600 rounded-lg mt-auto">
        مشاهده ی مشخصات و رزرو
      </button>
    </div>
  );
};

export default CarComponent;
