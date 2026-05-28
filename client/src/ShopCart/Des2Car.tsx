import ComponentDes from "./ComponentDes";

const Des2Car = () => {
  const termsSections = [
    {
      title: "شرایط و اجاره‌ی کنسلی :",
      type: "check",
      items: [
        "گواهینامه معتبر",
        "بیمه‌نامه اجاره خودرو سپریس",
        "چک یا سفته به مبلغ ماشین",
        "ودیعه نقدی به مبلغ: ۱۰ میلیون تومان",
        "مدارک سکونتی و شغلی معتبر",
      ],
    },
    {
      title: "شرایط لغو رزرو :",
      bulletType: "bullet",
      type: "check",
      items: [
        "یک روز مانده به روز تحویل: ٪۲۵ مبلغ اجاره",
        "از زمان رزرو تا ۲ روز قبل از روز تحویل: ٪۱۵ مبلغ اجاره",
        "از زمان رزرو تا ۳ روز قبل از روز تحویل: ٪۱۰ مبلغ اجاره",
        "بیشتر از ۳ روز مانده به روز تحویل: بدون جریمه",
      ],
    },
    {
      title: "در تعطیلات :",
      bulletType: "bullet",
      type: "check",
      items: [
        "یک روز مانده به روز تحویل: ٪۵۰ مبلغ اجاره",
        "از زمان رزرو تا ۲ روز قبل از روز تحویل: ٪۲۵ مبلغ اجاره",
        "از زمان رزرو تا ۳ روز قبل از روز تحویل: ٪۱۰ مبلغ اجاره",
        "بیشتر از ۳ روز مانده به روز تحویل: ٪۵ مبلغ اجاره",
      ],
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 p-5">
      <ComponentDes
        state="terms"
        title="قوانین و شرایط"
        destitle="برای اجاره خودرو با کارسرویس، این موارد را مطالعه کنید:"
        sections={termsSections}
      />
    </div>
  );
};

export default Des2Car;
