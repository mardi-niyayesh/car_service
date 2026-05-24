const Des1Car = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 p-5">
      <h2 className="text-2xl font-bold text-gray-800 border-r-4 border-blue-600 pr-3 mb-4">
        بیمه اجاره
      </h2>
      <p className="text-gray-600 mb-6 text-sm leading-relaxed">
        کارسرویس با همکاری بیمه اتومبیل و مسئولیت سامان بسته‌های ویژه‌ای مخصوص
        اجاره خودرو ارائه می‌کند:
      </p>

      <div className="space-y-6">
        <div className="bg-gray-50 rounded-xl p-4 transition hover:shadow-md">
          <h3 className="text-lg font-bold text-blue-700 mb-2">طرح اوپال</h3>
          <p className="text-gray-600 text-sm ">
            شامل پوشش‌های: سرقت کلی (با فرانشیز ۲۰ درصد)، تصادف (خسارت اول بدون
            فرانشیز)، سرقت قطعات (با کسر استهلاک لوازم)، شکست شیشه، بلایای
            طبیعی، پاشیده شدن رنگ، اسید و مواد شیمیایی، آتش سوزی
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 transition hover:shadow-md">
          <h3 className="text-lg font-bold text-blue-700 mb-2">طرح یاقوت</h3>
          <p className="text-gray-600 text-sm ">
            سرقت کلی + حذف فرانشیز تا سقف ۷۰ میلیون تومان، تصادف (سه خسارت اول
            بدون فرانشیز)، سرقت قطعات (با کسر استهلاک لوازم)، پرداخت افت خودرو
            (تا سقف ۷۰ میلیون تومان)، شکست شیشه، بلایای طبیعی، پاشیده شدن رنگ،
            اسید و مواد شیمیایی، آتش سوزی
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 transition hover:shadow-md">
          <h3 className="text-lg font-bold text-blue-700 mb-2">
            به بیمه نیاز ندارم
          </h3>
          <p className="text-gray-600 text-sm ">
            در طول مدت اجاره مسئولیت نگهداری از خودرو با شما خواهد بود. با خرید
            بیمه اجاره شما تنها متعهد به جبران مواردی خواهید بود که تحت پوشش
            بیمه خریداری شده نیست.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Des1Car;
