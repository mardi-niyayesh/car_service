//components
import ReserveComponent from "../ReserveComponent";
import CarComponent from "../CarComponent";
import DesCar from "../DesCar";
//img mashhad
import Maddhad from "../../../../assets/mashhad-2.png";
import car1 from "../../../../assets/206.png";
import sari4 from "../../../../assets/sari4.png";
import car3 from "../../../../assets/rana.png";
import car4 from "../../../../assets/PERSIA.png";

const ItemCar = [
  {
    id: 2,
    img: car1,
    title: "پژو ۲۰۶ ",
    price: "۲٫۴۰۰٫۰۰۰",
    duration: "3 تا 6 روز",
  },
   {
    id:4,
    img: sari4,
    ttile: "هیوﻧﺪا اﻟﻨﺘﺮا ۲۰۱۷",
    price: "۶٫۳۰۰٫۰۰۰",
    duration: "3 تا 6 روز",
  },
  {
    id: 6,
    img: car4,
    title: " پژو پرﺷﯿﺎ TU5",
    price: "۲٫۸۰۰٫۰۰۰",
    duration: "3 تا 6 روز",
  },
  {
    id: 5,
    img: car3,
    title: "  راﻧﺎ پلاس",
    price: "۲٫۴۰۰٫۰۰۰",
    duration: "3 تا 6 روز",
  },
];
const MashhadPage = () => {
  return (
    <div>
      <ReserveComponent
        title="اجاره خودرو مشهد"
        img={Maddhad}
        heder="اجاره و کرایه خودرو در مشهد "
        text="سفر به مشهد یکی از تجربه‌های به‌یادماندنی است که با اجاره ماشین می‌تواند راحت‌تر و لذت‌بخش‌تر شود. چه برای سفرهای زیارتی، کاری یا تفریحی، اجاره خودرو در مشهد به شما آزادی و انعطاف‌پذیری می‌دهد تا بدون محدودیت در شهر جابجا شوید.
         در سوییچ رنت انواع خودروهای اقتصادی، لوکس و 
         SUV با بهترین قیمت و شرایط آسان در اختیار شما قرار دارد."
      />
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {ItemCar.map((car) => (
            <CarComponent
              key={car.id}
               id={car.id}
              img={car.img}
              title={car.title}
              price={car.price}
              duration={car.duration}
            />
          ))}
        </div>
      </div>
      <DesCar />
    </div>
  );
};

export default MashhadPage;
