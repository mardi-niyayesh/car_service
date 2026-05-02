//components
import DesCar from "../DesCar";
import ReserveComponent from "../ReserveComponent";
import CarComponent from "../CarComponent";
import Comment from "../../../ComponentPublic/Comment";
//img shiraz
import shirazimg from "../../../../assets/shiraz-2.png";
//img car
import car1 from "../../../../assets/carqeshm.png";
import car2 from "../../../../assets/tara.png";
import car3 from "../../../../assets/caarr2qeshm.png";
import car4 from "../../../../assets/pngegg-1.png";

const ItemCar = [
  {
    id:10,
    img: car1,
    ttile: "ﺗﺎرا اﺗﻮﻣﺎت",
    price: "۳٫۷۰۰٫۰۰۰",
    duration: "3 تا 6 روز",
  },
  {
    id:2,
    img: car2,
    ttile: "هیوندای ون H1",
    price: "۷٫۶۰۰٫۰۰۰",
    duration: "2 تا 5 روز",
  },
  {
    id:12,
    img: car3,
    ttile: "هیوﻧﺪای ﺳﺎﻧﺘﺎﻓﻪ",
    price: "۶٫۳۰۰٫۰۰۰",
    duration: "3 تا 6 روز",
  },
  {
    id:11,
    img: car4,
    ttile: "کیا اسپورتیج ۲۰۱۸",
    price: "۶٫۳۰۰٫۰۰۰",
    duration: "3 تا 6 روز",
  },
];
const ShirazPage = () => {
  return (
    <div>
      <ReserveComponent
        title="اجاره خودرو در شیراز"
        img={shirazimg}
        heder="اجاره و کرایه خودرو در شیراز"
        text="یکی از مهم‌ترین شهرهای توریستی ایران، شهر شیراز است که به عنوان مرکز استان فارس شناخته می‌شود. 
        این شهر یکی از مهم‌ترین قطب‌های گردشگری در ایران بوده و مهم‌ترین آثار تاریخی از دوران هخامنشیان،
         زندیان و سایر دوره‌های تاریخی را در خود جای داده است. همین موضوع باعث می‌شود که هر ساله توریستان بسیاری برای بازدید از آثار تاریخی و اماکن دیدنی این شهر به شیراز سفر کنند. این شهر که قدمت تاریخی بسیار زیادی دارد به عنوان یکی از کلان شهرهای ایران شناخته می‌شود و قدمت آن به گفته مورخان به 6500 سال قبل بازمی‌گردد. شیراز در زمان هخامنشیان پایتخت ایران بزرگ بوده و باغ ارم، باغ چهل تن، باغ تخت، نارنجستان، باغ دلگشا، باغ عفیف‌آباد، باغ پرندگان، دروازه قرآن، ارگ کریم خان، روستای غلات، مسجد وکیل، بازار وکیل، مسجد نصیرالملک، برم دلک، دریاچه مهارلو و غیره از مهم‌ترین و دیدنی‌ترین اماکن شهر شیراز هستند."
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

export default ShirazPage;
