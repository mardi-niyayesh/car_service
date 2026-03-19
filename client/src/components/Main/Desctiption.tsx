//img car
import caratoo from "../../../assets/ceratoo.webp";
import hunda from "../../../assets/hunda.webp";
import sorena from "../../../assets/sorentoo.webp";
import tigoo from "../../../assets/tigoo.webp";
const Listcar = [
  {
    title: "اجاره اکسنت",
    namecar: "خودرو سدان نیمه لوکس",
    imgcar: caratoo,
  },
  { title: "اجاره سراتو", namecar: "خودرو سدان نیمه لوکس", imgcar: hunda },
  {
    title: "اجاره سورنتو",
    namecar: "خودرو شاسی بلند لوکس",
    imgcar: sorena,
  },
  {
    title: "اجاره تیگو  پرو ",
    namecar: "خودرو شاسی بلند لوکس",
    imgcar: tigoo,
  },
];

const Description1 = [
  {
    title: " اجاره خودرو بدون راننده",
    text: `        اجاره خودرو بدون راننده یکی از پر طرفدارترین خدمات کارسرویس است که با
          شرایط آسان و تخفیف های ویژه برای مشتریانش فراهم نموده است. با اجاره
          ماشین بدون راننده شما دیگر نیازی به پرداخت هزینه های نگهداری، تعمیرات،
          تعویض لاستیک و بیمه خودرو نخواهید داشت.`,
  },
  {
    title: "  اجاره ی خودرو در تهران",
    text: `      اگر اهل تهران هستید یا قصد سفر به تهران را دارید، بنا به دلایل مختلف
          ممکن است نیاز به اجاره ماشین در تهران داشته باشید. شرکت کارسرویس برای
          اجاره انواع ماشین بدون راننده در کنار شما خواهد بود تا تجربه ای کم
          نظیر از اجاره خودرو در تهران را داشته باشید.
    
          علاوه بر خدمات ویژه برای رزرو خودرو بدون راننده در تهران، سرویس های
          کامل و برتر شرکت ناواران، نظیر اجاره خودرو لوکس، اجاره روزانه خودرو در
          تهران و عدم محدودیت در مدت زمان اجاره همراهتان خواهد بود.
          
          در فرودگاه های امام خمینی و مهرآباد، هتل محل اقامت یا هر نقطه دلخواه
          دیگری در تهران، خودرو را تحویل بگیرید و در تهران یا هر شهر دیگر ایران،
          در ساعت و روز دلخواهتان ماشین را عودت دهید. به همین سادگی.`,
  },
];
const Description2 = [
  {
    title: "  پشتیبانی 24 ساعته کار سرویس",
    text: `          درکنار خدمت ویژه ناواران، در زمان اجاره خودرو، تیم پشتیبانی کارسرویس
          با خدمات پشتیبانی شبانه روزی و رصد های ماهواره ای همراه شما خواهد بود
       
          رصورت بروز هرگونه مشکل احتمالی نظیر نقص فنی و تصادفات احتمالی در
  کوتاه ترین زمان ممکن و در هر نقطه از ایران امدادرسانی انجام خواهد شد.
          همچنین در صورت لزوم خودرویی دیگر در اختیار شما قرار خواهیم داد.`,
  },
  {
    title: "قیمت اجاره خودرو",
    text: `
     هنگام اجاره خودرو بدون راننده، قیمت اجاره ماشین مهم ترین نکته می باشد. تمام خودرو های
   شرکت ناواران، تحت مالکیت رسمی این شرکت بوده و تحویل خودرو بدون واسطه صورت می پذیرد، عدم
   وجود واسطه سبب ارائه مناسب ترین لیست قیمت و کیفیت در اجاره خودرو می گردد، همچنین باعث می
    شود تا بدون محدودیت زمانی خودرو مورد نظرتان را از یک تا هر تعداد بازه زمانی که می خواهید
   اجاره کنید.                   
   دیگر ویژگی شرکت کرایه خودرو ناواران، ارائه قرارداد و فاکتور رسمی به شرکت ها و اشخاص در
   کنار امکان اجاره خودرو با تخفیف و امتیاز ویژه باشگاه مسافران می باشد. رویکرد و خدمات
   مشتری محور ناواران، سبب تضمین ارائه مناسب ترین قیمت کرایه ماشین، برای متقاضیان خدمات
     اجاره خودرو در ایران شده است.
                                `,
  },
];
const Desctiption = () => {
  return (
    <div className=" container mx-auto">
      {Description1.map((item) => (
        <div className="p-4 m-auto">
          <h2 className="font-bold text-blue-800 text-3xl my-5">
            {item.title}
          </h2>
          <p className="text-gray-600">{item.text}</p>
        </div>
      ))}

      <div className="py-10">
        <h2 className="font-bold text-blue-800 text-2xl  my-8">
          ماشین های لوکس و اقتصادی
        </h2>
        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-4">
          {Listcar.map((item, index) => (
            <div key={index} className="bg-white   overflow-hidden ">
              <div className="p-5">
                <h2 className="font-bold text-xl text-blue-800 text-center mb-2">
                  {item.title}
                </h2>
                <p className="text-gray-600 text-center mb-4">{item.namecar}</p>
                <p className="text-blue-600 text-sm font-bold text-center cursor-pointer hover:text-blue-700">
                  اطلاعات بیشتر
                </p>
              </div>

              <div className="relative p-4">
                <div className="absolute bottom-4 left-2 right-2 h-12 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 border-b-4 border-gray-900 rounded-b-lg shadow-inner opacity-90"></div>
                <img
                  src={item.imgcar}
                  alt="ماشین "
                  className="relative block w-4/5 h-auto mx-auto z-10"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      {Description2.map((item) => (
        <div className="p-4 m-auto">
          <h2 className="font-bold text-blue-800 text-3xl my-5">
            {item.title}
          </h2>
          <p className="text-gray-600">{item.text}</p>
        </div>
      ))}
    </div>
  );
};

export default Desctiption;
