import DescriptionComponent from "../Main/DesctiptionComponent";
import station1 from "../../../assets/st1.jpg";
import station2 from "../../../assets/st2.jpg";
import station3 from "../../../assets/st3.jpg";
import station4 from "../../../assets/st4.jpg";

const ItemDes = [
  {
    id: 1,
    title: " قیمت اجاره خودرو  ",
    type: "multiple_paragraphs",
    descriptions: [
      `مسافت مورد نظر: هرچه مسافتی که قصد طی کردن آن را دارید بیشتر باشد، هزینه احتمالی افزایش می‌یابد.
`,
      `-  د نفرات و حجم بار: برای سفرهای خانوادگی یا گروهی، خودروهای جادارتر نیاز است که هزینه بیشتری دارند.`,
      `تعداد روزهای اجاره: در روزهای تعطیل و پایان هفته، قیمت اجاره معمولاً بیشتر می‌شود.`,
      `نوع و مدل خودرو: خودروهای لوکس و شاسی‌بلند هزینه بالاتری نسبت به خودروهای اقتصادی دارند.`,
      `بیمه: نوع بیمه انتخابی (بیمه پایه یا کامل) می‌تواند هزینه نهایی را تحت تأثیر قرار دهد.`,
      `با راننده یا بدون راننده بودن خودرو: اجاره خودرو با راننده معمولاً هزینه بیشتری به همراه دارد.`,
    ],
  },
  {
    id: 2,
    title: `راهنمای انتخاب خودروی مناسب  `,
    type: "multiple_paragraphs",
    descriptions: [
      `خودروهای اقتصادی برای سفرهای کم‌هزینه`,
      `خودروهای لوکس برای مسافرت‌های تجملی یا تشریفات`,
      `خودروهای شاسی‌بلند برای بازدید از مناطق کوهستانی یا طبیعت`,
      `خودروهای ون برای گروه‌های بزرگ یا خانواده‌های پرجمعیت`,
    ],
  },
  {
    id: 3,
    title: `شرایط اجاره خودرو  `,
    type: "multiple_paragraphs",
    descriptions: [
      `سن متقاضی: حداقل 20 سال.`,
      `مدارک شناسایی: کارت ملی یا شناسنامه.`,
      `ضمانت‌نامه: ارائه چک یا سفته به مبلغ مشخص.`,
      `گواهینامه رانندگی: با حداقل 6 ماه اعتبار.`,
      `مدرک شغلی: ارائه گواهی اشتغال به کار یا مدارک محل سکونت.`,
    ],
  },
];

const DesCar = () => {
  return (
    <>
      <div className="container mx-auto">
        {ItemDes.map((item) => (
          <DescriptionComponent
            key={item.id}
            title={item.title}
            descriptions={item.descriptions}
            type={item.type}
          />
        ))}
        <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4">
          <img src={station1} alt="" />
          <img src={station2} alt="" />
          <img src={station3} alt="" />
          <img src={station4} alt="" />
        </div>
      </div>
    </>
  );
};

export default DesCar;
