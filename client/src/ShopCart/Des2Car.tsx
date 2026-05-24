const Des2Car = () => {
  return (
    <div>
      <div className="p-5 space-y-6">
        <div>
          <p className="bg-blue-50 text-blue-800 font-semibold inline-block px-4 py-2 rounded-lg shadow-sm">
            شرایط و اجاره‌ی کنسلی :
          </p>
          <div className="mt-3 pr-4 text-gray-600 space-y-1 text-sm leading-relaxed">
            <p>✓ گواهینامه معتبر</p>
            <p>✓ بیمه‌نامه اجاره خودرو سپریس</p>
            <p>✓ چک یا سفته به مبلغ ماشین</p>
            <p>✓ ودیعه نقدی به مبلغ: ۱۰ میلیون تومان</p>
            <p>✓ مدارک سکونتی و شغلی معتبر</p>
          </div>
        </div>

        <div>
          <p className="bg-blue-50 text-blue-800 font-semibold inline-block px-4 py-2 rounded-lg shadow-sm">
            شرایط لغو رزرو :
          </p>
          <div className="mt-3 pr-4 text-gray-600 space-y-1 text-sm">
            <p>• یک روز مانده به روز تحویل: ٪۲۵ مبلغ اجاره</p>
            <p>• از زمان رزرو تا ۲ روز قبل از روز تحویل: ٪۱۵ مبلغ اجاره</p>
            <p>• از زمان رزرو تا ۳ روز قبل از روز تحویل: ٪۵ مبلغ اجاره</p>
            <p>• بیشتر از ۳ روز مانده به روز تحویل: بدون جریمه</p>
          </div>
        </div>

        <div>
          <p className="bg-blue-50 text-blue-800 font-semibold inline-block px-4 py-2 rounded-lg shadow-sm ">
            در تعطیلات :
          </p>
          <div className="mt-3 pr-4 text-gray-600 space-y-1 text-sm">
            <p>• یک روز مانده به روز تحویل: ٪۵۰ مبلغ اجاره</p>
            <p>• از زمان رزرو تا ۲ روز قبل از روز تحویل: ٪۲۵ مبلغ اجاره</p>
            <p>• از زمان رزرو تا ۳ روز قبل از روز تحویل: ٪۱۰ مبلغ اجاره</p>
            <p>• بیشتر از ۳ روز مانده به روز تحویل: ٪۵ مبلغ اجاره</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Des2Car;
