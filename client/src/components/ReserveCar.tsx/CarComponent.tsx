//img car
import car1 from "../../../assets/carqeshm.webp";
import car2 from "../../../assets/tara.webp";
import car3 from "../../../assets/caarr2qeshm.webp";
import car4 from "../../../assets/pngegg-1.webp";
//icon
import icon1 from "../../../assets/gearbox.webp";
import icon2 from "../../../assets/carrey.webp";
import icon3 from "../../../assets/seat-belt.webp";
import icon4 from "../../../assets/fan-heater.webp";

const ItemCar = [
  {
    img: car1,
    ttile: "ﺗﺎرا اﺗﻮﻣﺎت",
    price: "۳٫۷۰۰٫۰۰۰",
    duration: "3 تا 6 روز",
  },
  {
    img: car2,
    ttile: "هیوندای ون H1",
    price: "۷٫۶۰۰٫۰۰۰",
    duration: "2 تا 5 روز",
  },
  {
    img: car3,
    ttile: "هیوﻧﺪای ﺳﺎﻧﺘﺎﻓﻪ",
    price: "۶٫۳۰۰٫۰۰۰",
    duration: "3 تا 6 روز",
  },
  {
    img: car4,
    ttile: "کیا اسپورتیج ۲۰۱۸",
    price: "۶٫۳۰۰٫۰۰۰",
    duration: "3 تا 6 روز",
  },
];

const CarComponents = () => {
  return (
    <div className="container mx-auto px-4 py-8 mt-15 mb-15">
     
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {ItemCar.map((car, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center border border-gray-200 rounded-lg shadow-sm p-4"
          >
            <img
              src={car.img}
              alt="car"
              className="w-full h-48 object-cover rounded-t-lg mb-4" 
            />

            <div className="flex flex-col items-center w-full mb-4">
              <p className="font-bold text-lg text-gray-800 mb-2">{car.ttile}</p>
              <p className="text-blue-600 font-semibold text-xl mb-2">{car.price}</p>
              <span className="text-sm text-gray-500">{car.duration}</span>
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
        ))}
      </div>
    </div>
  );
};

export default CarComponents;
