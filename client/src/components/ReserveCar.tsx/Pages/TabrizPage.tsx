//components
import DesCar from "../DesCar";
import ReserveComponent from "../ReserveComponent";
import CarComponent from "../CarComponent";
import Comment from "../../../ComponentPublic/Comment";
//img tabriz
import Tabrizimg from "../../../../assets/TABRIZ-2.png";

import car1 from "../../../../assets/206.png";
import sari3 from "../../../../assets/sari3.png"
import car3 from "../../../../assets/rana.png";
import car4 from "../../../../assets/PERSIA.png";

const ItemCar = [
  {
    id:2,
    img: car1,
    ttile: "پژو ۲۰۶ ",
    price: "۲٫۴۰۰٫۰۰۰",
    duration: "3 تا 6 روز",
  },
 {
    id:3,
    img: sari3,
    ttile: " ﻫﺎﯾﻤﺎ S8 TURBO",
    price: "۷٫۱۰۰٫۰۰۰",
    duration: "3 تا 6 روز",
  },
  {
    id:6,
    img: car4,
    ttile: " پژو پرﺷﯿﺎ TU5",
    price: "۲٫۸۰۰٫۰۰۰",
    duration: "3 تا 6 روز",
  },
  {
    id:5,
    img: car3,
    ttile: "  راﻧﺎ پلاس",
    price: "۲٫۴۰۰٫۰۰۰",
    duration: "3 تا 6 روز",
  },
];

const TabrizPage = () => {
  return (
    <div>
      <ReserveComponent
        title="اجاره خودرو درتبریز"
        img={Tabrizimg}
        heder="اجاره و کرایه خودرو در تبریز"
        text="کی از باستانی‌ترین و زیباترین شهرهای کشورمان، تبریز است. این شهر پایتخت استان آذربایجان شرقی بوده و در طول تاریخ نقش پررنگ و تاثیرگذاری را در اقتصاد منطقه داشته است. تبریز در فصل تابستان مقصد بسیاری از گردشگران است و یکی از شهرهایی است که بیشتر مردم برای تفریح و گردش به آنجا سفر می‌کنند. جاذبه‌های دیدنی، اماکن تفریحی این شهر توجه افراد بسیاری را جلب کرده است.
شما می‌توانید به راحتی با خودروی شخصی خود به این شهر سفر کنید.
 امروزه به دلیل شرایط اقتصادی حاکم بر کشور بیشتر مردم قدرت خرید خودرو ندارند و برای تفریح و مسافرت به دنبال خودروهای اجاره‌ای هستند. اجاره خودرو در تبریز یک امر رایج و مرسوم است، وسعت زیاد این شهر باعث شده تا نتوانید با وسایل نقلیه عمومی به راحتی تردد کنید. داشتن یک خودروی شخصی به شما کمک می‌کند
  تا در کوتاه‌ترین زمان ممکن و بدون خستگی به مقصد خود برسید."
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

export default TabrizPage;
