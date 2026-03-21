//components
import DesCar from "../DesCar";
import ReserveComponent from "../ReserveComponent";
//img Yazd
import yazd from "../../../../assets/yazd-2.png";

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
      <DesCar />
    </div>
  );
};

export default YazdPage;
