//components
import HeroBaner from "../Main/HeroBaner";
import CarComponents from "./CarComponent";

const ReserveComponent = ({title,img,text,heder}) => {
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-blue-800 font-bold text-lg sm:text-xl md:text-2xl lg:text-[24px] pb-2 mb-6 text-center sm:text-left">
        {title}
      </h1>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
        <img
          src={img}
          alt="خودروم"
          className="w-full sm:w-1/3 object-cover "
        />
        <div className="flex-1">
          <h2 className="text-blue-800  text-xl sm:text-2xl md:text-2xl lg:text-[22px] pb-3 mb-4 border-b border-blue-200 inline-block">
            {heder}
          </h2>
          <p className="text-gray-700 leading-relaxed text-justify">
            {text}
          </p>
        </div>
      </div>
      <HeroBaner />
      <CarComponents />
    </div>
  );
};

export default ReserveComponent;
