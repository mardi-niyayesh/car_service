// icons
import { GiTowTruck, GiDart } from "react-icons/gi";
import { AiFillCar } from "react-icons/ai";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";
//component Modal
import Modal from "./Modal";
//hooks
import { useState } from "react";

const detail = [
  {
    icon: <GiTowTruck size={100} className="text-gray-600" />,
    title: "امداد رسانی در کمتر از 30 دقیقه در هر جای ایران ",
    text: `
                شبکه تحت پوشش کارسرویس که با همکاری شرکای تجاری در خدمت مشتریان قرار گرفته است، شامل 2000 نقطه در سراسر
                کشور ایران و مناطق آزاد تجاری می‌باشد که باعث شده سرعت امداد رسانی در هر نقطه ایران به کمتر از 30 دقیقه
                کاهش یابد ، امدادگران و خودروهای امدادی همگی مجهز به تجهیزات جهت رفع معایب و تعمیرات ساده بوده و بسیاری
                از مشکلات در همین مرحله به سادگی رفع می گردند.
            `,
  },
  {
    icon: <AiFillCar size={100} className="text-gray-600" />,
    title: "ارائه ماشین های همیشه تمیز و نو",
    text: `
                یکی از دلایل موفقیت و محبوبیت خودروهای کارسرویس نو و تمیز بودن خودروهاست، هر خودرو بعد از هر اجاره سرویس
                و شستشو شده و تمامی موارد فنی آن توسط مسئول مرتبط کنترل میگردد. همچنین طبق قرارداد جداگانه با شرکتهای
                خدمات پس از فروش خودرو، بعد از هر چندبار اجاره، خودروها مورد بازدید کلی قرار میگیرند. تمامی سرویسهای
                دوره ای و بازدیدهای فنی خودروها با دقت خاص و بیش از تعاریف استاندارد انجام میگردد و به همین دلیل همواره
                خودروها سالم و نو نگاه داشته میشوند، خودروهایی که تا حدودی فرسودگی پیدا کرده و یا کیلومتر آنها از حدی
                بالاتر رود، توسط واحد تأمین خودرو از شبکه خارج و با خودروی صفر کیلومتر جایگزین میگردند. خودروهای ناواران
                همانند خودروهای شخصی از ابتدا دارای لوازم اضافی مانند روکش صندلی، روکش فرمان، دستگاه مکان یاب، نمدهای
                صداگیر و سایر ادوات لازم میباشند و کشیدن سیگار در این خودرو ها ممنوع است. این دقت و سلیقه در نگهداری
                خودروها بدلیل اصل اهمیت به شخصیت مشتری بوده و دلیل جذابیت این خودروها درک این موارد توسط مشتریان میباشد.
            `,
  },
  {
    icon: <GiDart size={100} className="text-gray-600" />,
    title: "رزرو رایگان با امتیاز",
    text: `
                مشترکین کارسرویس می‌توانند با انجام رزرو برای دوستان و همکاران خود، امتیاز رزروهای ایشان را در کاربر خود
                ذخیره نموده و با رسیدن به حداقل مبلغ جهت رزرو ، هزینه یک اجاره را به صورت کامل از طریق این امتیازها
                پرداخت نمایند. پس چنانچه شما برای آشنایان زحمت رزرو خودرو را انجام می‌دهید ، زحمت شما با اجاره های
                رایگان برای خودتان جبران خواهد شد.
            `,
  },
  {
    icon: <FaFileInvoiceDollar size={100} className="text-gray-600" />,
    title: "ارائه فاکتور رسمی",
    text: `
                پرداخت مالیات ، ارائه فاکتور رسمی و عملکرد صحیح طبق قوانین جاری کشور وظیفه‌ای دو‌طرفه می‌باشد و مشتریان
                همواره می بایست از افراد بی‌اعتباری که فعالیت غیر شفاف و زیرزمینی دارند پرهیز کنند زیرا با هزینه‌های
                ظاهری کمتر، جریمه ها ، هزینه‌ها و مشکلات بسیاری را برای مشتری به همراه خواهند داشت
            `,
  },
];

const DetailCarService = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  //for get title in Modal
  const [savetitle, setSavetitle] = useState("");
  //for get text in Modal
  const [savetext, setSavetext] = useState("");

  const openModal = (item) => {
    setIsModalOpen(true);
    setSavetitle(item.title);
    setSavetext(item.text);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSavetitle("");
  };

  return (
    <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 ">
      {detail.map((item, index) => (
        <div
          key={index}
          className="flex flex-col justify-between bg-white rounded-lg shadow-md p-4"
        >
          <div className="flex items-center mb-2">
            {item.icon}
            <div className="ml-2 text-gray-500">{item.title}</div>
          </div>

          <div className="border-b-2 border-gray-200 my-3"></div>
          <div
            onClick={() => openModal(item)}
            className="flex font-medium items-center justify-between text-sm font-medium text-gray-500 hover:text-blue-800 cursor-pointer"
          >
            <div>جزئیات بیشتر</div>
            <FaArrowLeft size={24} opacity={0.8} />
          </div>
        </div>
      ))}
      <Modal isOpen={isModalOpen} onClose={closeModal} title={savetitle}>
        <p className="text-gray-700">{savetext}</p>
      </Modal>
    </div>
  );
};

export default DetailCarService;
