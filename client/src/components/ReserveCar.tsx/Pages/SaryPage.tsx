//components
import ReserveComponent from "../ReserveComponent";
import DesCar from "../DesCar";
import CarComponent from "../CarComponent";
import Comment from "../../../ComponentPublic/Comment";
//img
import saryimg from "../../../../assets/sari.png";
import sari1 from "../../../../assets/sari1.png";
import sari2 from "../../../../assets/sari2.png";
import sari3 from "../../../../assets/sari3.png";
import sari4 from "../../../../assets/sari4.png";

const ItemCar = [
  {
    id:1,
    img: sari1,
    ttile: " پژو ۲۰۷ دنده‌ای",
    price: "۳٫۷۰۰٫۰۰۰",
    duration: "3 تا 6 روز",
  },
  {
    id:2,
    img: sari2,
    ttile: " پژو ۲۰۶",
    price: "۲٫۴۰۰٫۰۰۰",
    duration: "2 تا 5 روز",
  },
  {
    id:3,
    img: sari3,
    ttile: " ﻫﺎﯾﻤﺎ S8 TURBO",
    price: "۷٫۱۰۰٫۰۰۰",
    duration: "3 تا 6 روز",
  },
  {
    id:4,
    img: sari4,
    ttile: "هیوﻧﺪا اﻟﻨﺘﺮا ۲۰۱۷",
    price: "۶٫۳۰۰٫۰۰۰",
    duration: "3 تا 6 روز",
  },
];

const SaryPage = () => {
  return (
    <>
      <div>
        <ReserveComponent
          title="اجاره خودرو در ساری"
          img={saryimg}
          heder="اجاره و کرایه خودرو در ساری"
          text="ساری مرکز استان مازندران است که در شمال کشورمان قرار گرفته، این شهر به دلیل موقعیت جغرافیایی خاصی که دارد دارای آب و هوای بسیار معتدلی است. طبیعت زیبا و دیدنی ساری در کنار آب و هوای خوبی که دارد مسافران و گردشگران بسیاری را به سمت خود می‌کشاند. این شهر شلوغ و بزرگ در زمره شهرهای پرجمعیت کشور قرار گرفته است به همین دلیل برای تردد در سطح شهر باید از وسیله نقلیه شخصی استفاده کنید، چرا که جابه‌جایی در این شهر وسیع با وسیله نقلیه عمومی کار آسان و راحتی نخواهد بود. پیشنهاد ما به شما اجاره خودرو در ساری است، به راحتی می‌توانید با اجاره خودرو در این شهر زیبا از سفر تفریحی یا کاری خود لذت ببرید. شرکت سوییچ در استان مازندران خدمات مربوط به رنت ماشین را ارائه می‌کند و شما می‌توانید با توجه به بودجه‌ای که دارید خودروی مورد نظر خود را از سوییچ رنت اجاره کنید. این مجموعه انواع خودروهای داخلی و وارداتی را در ناوگان خود قرار داده و در زمان اجاره خودرو با هیچ محدودیتی روبه‌رو 
        نخواهید شد. در ادامه این بلاگ با ما همراه شوید تا علاوه بر آشنایی با اجاره خودرو
         در مازندران با قیمت خودروهای اجاره‌ای این مجموعه و شرایط و مدارک لازم آن آشنا شوید."
        />
      </div>
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
    </>
  );
};

export default SaryPage;
