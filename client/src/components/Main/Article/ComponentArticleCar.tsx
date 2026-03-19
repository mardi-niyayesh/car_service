//img
import car1 from "../../../../assets/car1.jpg";
import car2 from "../../../../assets/car2.jpg";
import car3 from "../../../../assets/car3.jpg";
import car4 from "../../../../assets/car4.jpg";
//
import { Link } from "react-router-dom";

const Article = [
  {
    id: 1,
    img: car1,
    title: `معرفی 10 ماشین کلاسیک که محبوب ماشین‌بازها هستند`,
    text: `ماشین بازها به&zwnj;خوبی می&zwnj;دانند که یک ماشین کلاسیک را باید جواهری روی چرخ دانست که ...`,
  },
  {
    id: 2,
    img: car2,
    title: `با 10 شاسی‌بلند 7 نفره محبوب بازار ایران آشنا شوید`,
    text: `همه می&zwnj;دانیم که خودروهای شاسی بلند یا SUV، سلاطین حال حاضر بازار خودرو ایران و  شاسی‌بلند 7 نفره محبوب بازار ایران......`,
  },
  {
    id: 3,
    img: car3,
    title: `10 ماشین لامبورگینی محبوب تاریخ خودرو را بشناسید`,
    text: `شرکت ایتالیایی لامبورگینی یکی از سازندگان مشهور خودروهای سوپراسپرت در جهان است که فعالیت خود ...`,
  },
  {
    id: 4,
    img: car4,
    title: `راهنمای سفر از تهران به تبریز با خودرو شخصی`,
    text: `تبریز به عنوان مرکز استان آذربایجان شرقی شناخته می&zwnj;شود و می&zwnj;توان آن را مهم&zwnj;ترین شهر ...`,
  },
];

const ComponentArticleCar = () => {
  return (
    <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
      {Article.map((item) => (
        <div
          className="w-full bg-white border border-[#D7D7D7] p-4 md:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 mx-auto"
          key={item.id}
        >
          <img
            src={item.img}
            alt="اجاره خودرو"
            className="w-100%  h-auto rounded-lg mb-4"
          />
          <p className="text-[#414141] font-medium text-base md:text-lg mb-2 line-clamp-2">
            {item.title}
          </p>
          <p className="text-[#757575] text-sm md:text-base leading-relaxed line-clamp-3 md:line-clamp-4">
            {item.text}
          </p>
         <Link to={`/articles/${item.id}`}> 
              <button className="cursor-pointer w-full text-center bg-blue-600 text-white p-3 rounded-lg mt-4 hover:bg-blue-800">
            اطلاعات بیشتر
          </button>
          </Link>
      
        </div>
      ))}
    </div>
  );
};

export default ComponentArticleCar;
