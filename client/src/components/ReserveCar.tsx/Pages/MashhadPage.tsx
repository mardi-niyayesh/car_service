//components
import DesCar from "../DesCar";
import ReserveComponent from "../ReserveComponent";
//img mashhad
import Maddhad from "../../../../assets/mashhad-2.png";

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
      <DesCar />
    </div>
  );
};

export default MashhadPage;
