import ReserveComponent from "../ReserveComponent";
import CarComponent from "../CarComponent";
import DesCar from "../DesCar";
import Comment from "../../../ComponentPublic/Comment";

//img qeshm
import qeshm from "../../../../assets/qeshm-3.png";

//img car
import car1 from "../../../../assets/tara.png";
import car2 from "../../../../assets/tara.png";
import car3 from "../../../../assets/caarr2qeshm.png";
import car4 from "../../../../assets/pngegg-1.png";

const ItemCar = [
  {
    id: 10,
    img: car1,
    ttile: "ﺗﺎرا اﺗﻮﻣﺎت",
    price: "۳٫۷۰۰٫۰۰۰",
    duration: "3 تا 6 روز",
  },
  {
    id: 2,
    img: car2,
    ttile: "هیوندای ون H1",
    price: "۷٫۶۰۰٫۰۰۰",
    duration: "2 تا 5 روز",
  },
  {
    id: 4,
    img: car3,
    ttile: " هیوﻧﺪا اﻟﻨﺘﺮا ۲۰۱۷",
    price: "۶٫۳۰۰٫۰۰۰",
    duration: "3 تا 6 روز",
  },
  {
    id: 11,
    img: car4,
    ttile: "کیا اسپورتیج ۲۰۱۸",
    price: "۶٫۳۰۰٫۰۰۰",
    duration: "3 تا 6 روز",
  },
];

const QeshmPage = () => {
  return (
    <div>
      <ReserveComponent
        title="اجاره خودرو در قشم"
        img={qeshm}
        heder="اجاره و کرایه خودرو در قشم"
        text="جزیره قشم یکی از بزرگ‌ترین جزایر ایران است که در قلب خلیج فارس قرار گرفته، این جزیره جاذبه‌های تفریحی و اماکن دیدنی بسیاری دارد. جاذبه‌های توریستی و تفریحی باعث شده تا این جزیره به یکی از مقاصد مسافرتی در کشورمان تبدیل شود و سال‌هاست که توریستان بسیاری را به سمت خود جذب کرده است. از مکان‌های دیدنی آن می‌توان به
         ژئو پارک، تنگه چاهکوه، دره ستاره، جزیره ناز، بام
         قشم، غار خربس، جنگل حرا و غیره اشاره کرد. جزیره
         قشم وسعت زیادی دارد و هر یک از این اماکن دیدنی 
        در نقاط مختلف جزیره قرار گرفته‌اند به همین دلیل
         بدون داشتن وسیله نقلیه غیرممکن است که بتوانید
         از جاذبه‌های زیبای جزیره قشم دیدن کنید."
      />

      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {ItemCar.map((car) => (
            <CarComponent
              key={car.id}
              id={car.id}
              img={car.img}
              title={car.ttile}
              price={car.price}
              duration={car.duration}
            />
          ))}
        </div>
      </div>
      <DesCar />
      <Comment/>
    </div>
  );
};

export default QeshmPage;
