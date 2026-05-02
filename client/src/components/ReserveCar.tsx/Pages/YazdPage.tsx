//components
import DesCar from "../DesCar";
import ReserveComponent from "../ReserveComponent";
import CarComponent from "../CarComponent";
import Comment from "../../../ComponentPublic/Comment";
//img Yazd
import yazd from "../../../../assets/yazd-2.png";

import sari1 from "../../../../assets/sari1.png";
import sari2 from "../../../../assets/sari2.png";
import sari3 from "../../../../assets/sari3.png";
import sari4 from "../../../../assets/sari4.png";

const ItemCar = [
  {
    id: 1,
    img: sari1,
    ttile: " پژو ۲۰۷ دنده‌ای",
    price: "۳٫۷۰۰٫۰۰۰",
    duration: "3 تا 6 روز",
  },
  {
    id: 2,
    img: sari2,
    ttile: " پژو ۲۰۶",
    price: "۲٫۴۰۰٫۰۰۰",
    duration: "2 تا 5 روز",
  },
  {
    id: 3,
    img: sari3,
    ttile: " ﻫﺎﯾﻤﺎ S8 TURBO",
    price: "۷٫۱۰۰٫۰۰۰",
    duration: "3 تا 6 روز",
  },
  {
    id: 4,
    img: sari4,
    ttile: "هیوﻧﺪا اﻟﻨﺘﺮا ۲۰۱۷",
    price: "۶٫۳۰۰٫۰۰۰",
    duration: "3 تا 6 روز",
  },
];

const YazdPage = () => {
  return (
    <div>
      <ReserveComponent
        title="اجاره خودرو یزد"
        img={yazd}
        heder="اجاره و کرایه خودرو در یزد "
        text="یکی از شهرهای تاریخی و دیدنی ایران شهر یزد است که به عنوان اولین شهر تاریخی
         خشتی ایران و دومین شهر خشتی در جهان شناخته می‌شود. معماری خانه‌های یزد و بافت شهری آن شهرت جهانی پیدا کرده با توجه به جاذبه‌ها و بناهای خشتی که دارد به عنوان یک شهر بین‌المللی در یونسکو به ثبت رسیده است. این شهر با آثار تاریخی بسیارش، قنات‌ها، بادگیرها و غیره هر ساله عده بسیاری از مردم را از سراسر جهان به سمت خود می‌کشاند."
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

export default YazdPage;
