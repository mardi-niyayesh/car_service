const WhyAutoRent = () => {
  return (
    <section className="w-full px-4 sm:px-6 md:px-8 lg:px-10">
      <div
        className="
          group
          relative
          mx-auto
          mt-8
          md:mt-12
          w-full
          max-w-300
          overflow-hidden
          rounded-3xl
          bg-[url('/assets/imges/imagecar.png')]
          bg-cover
          bg-center
          bg-no-repeat
          min-h-75
          sm:min-h-80
          md:min-h-85
          shadow-lg
        "
      >
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-r
            from-black/75
            via-black/55
            to-black/35
            transition-all
            duration-700
            group-hover:from-black/80
            group-hover:via-black/60
          "
        />
        <div
          className="
            absolute
            -top-20
            -right-20
            h-52
            w-52
            rounded-full
            bg-[#FDB713]/10
            blur-3xl
          "
        />

        <div
          className="
            relative
            z-10
            flex
            min-h-75
            sm:min-h-80
            md:min-h-85
            flex-col
            items-center
            justify-center
            px-5
            py-10
            sm:px-10
            md:px-16
            text-center
          "
        >
          <div
            className="
              mb-4
              flex
              items-center
              gap-3
              text-[#FDB713]
            "
          ></div>

          <h3
            className="
              text-[#FDB713]
              text-2xl
              sm:text-3xl
              md:text-4xl
              lg:text-[42px]
              font-extrabold
              leading-tight
              tracking-tight
              drop-shadow-lg
            "
          >
            چرا کارسرویس؟
          </h3>

          <div
            className="
              mt-4
              mb-5
              h-1
              w-12
              rounded-full
            
            "
          />
          <p
            className="
              w-full
              max-w-212.5
              px-2
              text-sm
              sm:text-base
              md:text-lg
              lg:text-xl
              font-normal
              leading-8
              sm:leading-9
              text-white/90
              drop-shadow-md
            "
          >
            اجاره خودرو از یک شرکت اجاره خودرو با سابقه به شما کمک می‌کند تا در
            مسافرت‌ها، قرار ملاقات‌های مهم، مجالس و مراسم‌های خانوادگی ماشین
            مناسب خود را در اختیار داشته باشید.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhyAutoRent;
