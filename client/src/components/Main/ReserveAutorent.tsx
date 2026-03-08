//img or icon
import reservCar from "../../../assets/reservCar.png";
//components
import ComponentReservAutorent from "./ComponentReservAutorent";

const feacherData = [
  {
    logo: "../../../assets/1 (2).png",
    firstname: "خودروی",
    secondname: "خود را انتخاب کنید.",
    descripton: "خودروی مورد نظر خود را، متناسب با درخواست خود انتخاب کنید.",
    position: "right",
    id :1
  },
  {
    logo: " ../../../assets/2.png",
    firstname: "تاریخ",
    secondname: "تحویل را تعیین کنید.",
    descripton: "تاریخ موردنظر خود را از تقویم، انتخاب و رزرو کنید",
    position: "left",
    id :2
  },

  {
    logo: "../../../assets/4.png",
    firstname: "هزینه",
    secondname: "اجاره را پرداخت کنید.",
    descripton:
      "می توانید از طریق کیف پول آنلاین یا کارت های عضو شبکه شتاب هزینه اجاره را پرداخت کنید.",
    position: "left",
    id :3
  },
  {
    logo: "../../../assets/3.png",
    firstname: "خودروی",
    secondname: "خود را انتخاب کنید.",
    descripton: "خودروی مورد نظر خود را، متناسب با درخواست خود انتخاب کنید.",
    position: "right",
    id :4
  },
];

const ReserveAutorent = () => {
  const RightItems = feacherData.filter((item) => item.position === "right");
  const LeftItems = feacherData.filter((item) => item.position === "left");
  return (
    <div className="mt-8 px-4 md:px-8 lg:px-12 xl:px-0 max-w-[1200px] mx-auto">
      <div className="mt-8 text-center">
        <p className="text-[#5E5E5E] text-lg md:text-xl lg:text-[24px] font-medium">
          چگونه در وبسایت
        </p>
        <div className="font-bold text-2xl md:text-3xl lg:text-4xl">
          <span className="text-[#D79C10]">اُتـــورِنت</span>
          <span> خودرو رزرو کنیم؟</span>
        </div>
      </div>

      <div className="mt-10 flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8 lg:gap-4">
        <div className="flex flex-col gap-16 lg:gap-[350px] w-full lg:w-auto">
          {RightItems.map((feacher) => {
            return (
              <ComponentReservAutorent
                logo={feacher.logo}
                firstname={feacher.firstname}
                secondname={feacher.secondname}
                descripton={feacher.descripton}
                key={feacher.id}
              />
            );
          })}
        </div>

        <div className="order-first lg:order-none">
          <img
            src={reservCar}
            alt="reserve car"
            className="w-full max-w-[300px] md:max-w-[400px] lg:max-w-[500px] mx-auto lg:mx-0"
          />
        </div>

        <div className="flex flex-col gap-16 lg:gap-[350px] w-full lg:w-auto">
          {LeftItems.map((feacher) => {
            return (
              <ComponentReservAutorent
                logo={feacher.logo}
                firstname={feacher.firstname}
                secondname={feacher.secondname}
                descripton={feacher.descripton}
                key={feacher.id}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ReserveAutorent;
