import aboutbaner from "../../assets/imges/about-banner.jpg";
import desAbout from "./DataAboutPage";
const AboutPage = () => {
  return (
    <div className="container mx-auto px-4">
      <div className="relative mb-16 md:mb-24">
        <img src={aboutbaner} alt="baner" className="w-full h-64 " />
        <div className="absolute inset-0 flex items-center justify-center text-center ">
          <p className="text-white text-2xl sm:text-2xl md:text-3xl font-bold leading-tight px-4">
            کارسرویس: اولین اجاره خودرو ایرانی به سبک جهانی
          </p>
        </div>
      </div>

      {desAbout.map((item) => (
        <div key={item.id} className="mb-12 md:mb-16 lg:mb-20">
          <p className="text-yellow-600 font-bold text-xl sm:text-2xl md:text-3xl lg:text-[32px] pb-3 mb-6  inline-block">
            {item.title}
          </p>
          <div className="text-gray-500 text-base md:text-lg lg:text-xl leading-relaxed text-justify">
            {item.type === "nullimg" ? (
              <p>{item.text}</p>
            ) : (
              <div
                className={`flex flex-col md:flex-row ${
                  item.position === "left"
                    ? "md:flex-row-reverse"
                    : "md:flex-row"
                } items-center justify-between gap-8 md:gap-12 lg:gap-24`}
              >
                <p className="md:w-1/2 lg:w-2/3 order-2 md:order-1">
                  {item.text}
                </p>

                <img
                  src={item.img}
                  alt={item.title || "About Image"}
                  className="w-full md:w-1/2 lg:w-1/3 h-48 md:h-64 lg:h-90 object-cover  order-1 md:order-2"
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AboutPage;
