//components
import BoxComponentQuestion from "./BoxComponentQuestion";

const ItemComponentQuestion = [
  {
    id: 1,
    title: "در صورت بروز نقص فنی برای خودرو چه اتفاقی می افتد؟",
    text: "در صورت بروز نقص فنی برای خودرو، **گارانتی ۵ ساله یا ۱۰۰٬۰۰۰ کیلومتری شرکت** تعویض یا تعمیر رایگان قطعه معیوب را پوشش میدهد و خودروی جایگزین تا زمان رفع مشکل در اختیار شما قرار میگیرد.",
  },
  {
    id: 2,
    title: "هزینه بنزین و کارواش در خودروهای اجاره ای به عهده کیست؟",
    text: "هزینه بنزین و کارواش در خودروهای اجاره ای به عهده کیست؟  ی متن فیک بده به جوابم",
  },
  {
    id: 3,
    title: "آیا ماشین های اتورنت دارای بیمه هستند؟",
    text: "بله، تمام خودروهای اتورنت **دارای بیمه شخص ثالث و بدنه** هستند. در صورت تصادف، **هزینه تا سقف ۵۰ میلیون تومان** بر عهده مستاجر نیست و بیمه پرداخت می‌کند. مازاد بر آن با **۲۰٪ تخفیف** از مستاجر دریافت می‌شود.",
  },
  {
    id: 4,
    title: "محدودیت کیلومتر در اجاره خودرو چقدر می باشد؟",
    text: "خودروهای اجاره‌ای اتورنت **بدون محدودیت کیلومتر** هستند و شما می‌توانید هر میزان که تمایل دارید با خودرو رانندگی کنید. فقط کافیه با باک پر برگردونید! ",
  },
];
const ComponentQuestion = () => {
  return (
    <>
      <div className="container mx-auto flex items-center m-8 justify-center">
        <span className="text-[1.5rem] font-bold">سوالات </span>
        <span className="text-[1.5rem] font-bold text-[#D79C10]">متداول</span>
      </div>

      <div className="container mx-auto flex items-center m-8 justify-center">
        <div>
          {ItemComponentQuestion.map((item) => {
            return (
              <BoxComponentQuestion
                title={item.title}
                text={item.text}
                key={item.id}
              />
            );
          })}
        </div>
   
      </div>
    </>
  );
};

export default ComponentQuestion;
