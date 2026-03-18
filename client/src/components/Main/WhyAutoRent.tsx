const WhyAutoRent = () => {
  return (
    <div className="px-4 md:px-8 lg:px-12 xl:px-0">
      <div className="bg-[url('/assets/imagecar.png')] relative h-[250px] md:h-[292px] rounded-2xl mt-6 md:mt-10 bg-center bg-cover w-full max-w-[1200px] mx-auto">
        <div className="absolute inset-0 bg-black/40 rounded-2xl flex flex-col justify-center items-center p-4">
          <h3 className="text-[#FDB713] font-bold text-[20px] md:text-[24px] mb-4 text-center">
            چــــــرا اُتو رِنت؟
          </h3>
          <p className="text-white w-full max-w-[845px] px-4 md:px-12 text-[14px] md:text-[16px] lg:text-[18px] text-center leading-relaxed">
            اجاره خودرو از یک شرکت اجاره خودرو با سابقه به شما کمک می‌کند تا در
            مسافرت‌ها، قرار ملاقات‌های مهم، مجالس و مراسم‌های خانوادگی ماشین
            مناسب خود را در اختیار داشته باشید. اگر شما اصلاً خودرویی در اختیار
            ندارید یا خودروی شما مطمئن نیست، می‌توانید از سوییچ، خودروی مناسب
            خود را کرایه کرده و با آسودگی به سفر بروید.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WhyAutoRent;
