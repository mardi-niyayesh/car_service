//components
import ReserveComponent from "../ReserveComponent";
import DesCar from "../DesCar";
import CarComponent from "../CarComponent";
import Comment from "../../../ComponentPublic/Comment";
//img neyshaboor
import Nayshabbor from "../../../../assets/neydhaboor.png";
import car1 from "../../../../assets/206.png";
import car2 from "../../../../assets/sari3.png";
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
    img:car2,
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

const Nayshaboor = () => {
  return (
    <div>
      <ReserveComponent
        title="اجاره خودرو در نیشابور"
        img={Nayshabbor}
        heder="اجاره و کرایه خودرو در نیشابور"
        text="نیشابور با عنوان شهر فیروزه شناخته می‌شود و یکی از قدیمی‌ترین شهرهای ایران و زادگاه بزرگان بسیاری (دکتر شفیعی کدکنی، عطار نیشابوری و غیره) است. نیشابور دومین شهر بزرگ استان خراسان رضوی بوده که در دامنه کوه‌های بینالود و در شمال شرقی کشور قرار گرفته است. این شهر یکی از مهم‌ترین مراکز تاریخی، گردشگری و صنعتی کشور به شمار می‌رود و از زمان‌های قدیم (عصر صفوی) بسیار مورد توجه قرار گرفت.
اگر با خودروی شخصی به مشهد سفر کنید قطعا تابلو شهر نیشابور را خواهید دید. جاذبه‌های گردشگری زیبای شهر نیشابور باعث شده تا هر ساله افراد بسیاری
 به قصد تفریح و کار به این شهر سفر کنند. دهکده چوبی، دره هفت غار، مقبره کمال‌الملک، کاروانسرای شاه‌عباسی، آبشارها، بازار سرپوشیده، قلعه لک لک و غیره از جذاب‌ترین
  و دیدنی‌ترین جاذبه‌های این شهر هستند.
علاوه بر سفر با قطار، می‌توانید با اجاره یک خودرو و به منظور کار یا تفریح به نیشابور سفر کنید. سوییچ رنت یکی از شرکت‌هایی است که خودروهای لوکس و داخلی را با بهترین قیمت در اختیارتان قرار می‌دهد، اگر می‌خواهید با شرایط و نحوه اجاره خودرو در نیشابور بیشتر آشنا شوید
 تا انتهای مقاله با ما همراه باشید. "
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

export default Nayshaboor;
