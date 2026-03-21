import DesctiptionComponent from "../components/Main/DesctiptionComponent";
const ItemRoles = [
  {
    id: 1,
    title: "مدارک لازم",
    type: "multiple_paragraphs",
    descriptions: [
      "ارائه گواهینامه رانندگی با اعتبار حداقل 6 ماه",
      "ارائه کارت ملی",
      "مدارک شغلی هرگونه مدرکی که نشان دهنده شغل یا محل کار شما باشد",
      "ارائه سفته (به ارزش خودرو برای ماشین‌های ایرانی و ارائه چک به ارزش خودرو برای ماشین‌های خارجی)",
      "پرداخت ضمانت نقدی که بسته به مدل خودرو متفاوت است.",
    ],
  },
  {
    id: 2,
    title: "مدارک اجاره خودرو برای شرکت‌ها",
    type: "multiple_paragraphs",
    descriptions: [
      "مدرک شناسایی مدیر شرکت",
      "ارائه اساسنامه شرکت",
      "دریافت چک شرکت",
      "پرداخت ضمانت نقدی که بسته به مدل خودرو متفاوت است.",
    ],
  },
  {
    id: 3,
    title: "مدارک لازم برای اجاره خودرو افراد خارجی",
    type: "multiple_paragraphs",
    descriptions: [
      "کپی از گواهینامه رانندگی کشور محل سکونت و یا گواهینامه بین‌المللی فرد",
      "کپی از پاسپورت برای خودروهای اقتصادی و اصل پاسپورت برای خودروهای لوکس",
      "ارائه بلیط برای تحویل خودرو در فرودگاه امام",
      "پرداخت ضمانت نقدی که بسته به مدل خودرو متفاوت است.",
    ],
  },
  {
    id: 4,
    title: "انواع بیمه برای انواع خودرو",
    type: "single_paragraph",
    description:
      "شرکت اتورنت برای منطبق شدن با نیازهای مختلف مشتریان دو نوع بیمه پایه و بیمه کامل را برای اجاره خودرو ارائه می‌دهد. هر کدام از این بیمه‌ها باتوجه‌به بوجه و نیاز مشتری، هزینه خسارات را پوشش می‌دهند. بیمه پایه اجاره خودرو در این نوع بیمه که بصورت پیش فرض بر روی تمامی خودروهای اجاره شده دراتورنت وجود دارد، در این نوع بیمه مسئولیت تمامی خسارات و زیان‌ها بر عهده اجاره کننده است.",
  },
  {
    id: 5,
    title: "بیمه پایه",
    type: "multiple_paragraphs",
    descriptions: [
      "امداد جاده‌ای بصورت گسترده (ERA)",
      "ایمنی خودرو (SSP)",
      "پوشش کامل در برابر سرقت",
      "بیمه شخص ثالث (ALI) مبلغ بیمه پایه بصورت رایگان و روزانه است.",
    ],
  },
  {
    id: 6,
    title: "بیمه کامل",
    type: "multiple_paragraphs",
    descriptions: [
      "امداد جاده‌ای گسترده (ERA)",
      "بیمه شخص ثالث (ALI)",
      "تعهد ایمنی خودرو (SSP)",
      "پوشش کامل ناشی از سرقت",
      "پرداخت خسارات جزئی (شیشه، لاستیک، بدنه)",
      "حداقل معافیت جهت افت قیمت مبلغ بیمه کامل بصورت روزانه حدود 35% کرایه خودرو است.",
    ],
  },
];

const RolsPage = () => {
  return (
    <>
      <div className="bg-[url('../../assets/pagerole.png')] bg-cover bg-center bg-no-repeat w-full min-h-[250px] md:min-h-[400px] lg:min-h-[550px] xl:h-[683px] relative"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 lg:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {ItemRoles.map((item) => (
            <DesctiptionComponent
              key={item.id}
              title={item.title}
              descriptions={item.descriptions}
              description={item.description}
              type={item.type}
            />
          ))}
        </div>
      </div>
    </>
  );
};
export default RolsPage;
