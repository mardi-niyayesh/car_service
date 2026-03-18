//img
import BMW from "../../../assets/BMW.png";
import Honda from "../../../assets/Honda.png";
import Hyundai from "../../../assets/Hyundai.png";
import KIA1 from "../../../assets/KIA (1).png";
import Marcedes from "../../../assets/Marcedes.png";
import Nissan from "../../../assets/Nissan.png";
import Toyota from "../../../assets/Toyota.png";
import lexus from "../../../assets/lexus-logo.png";

const CarParts = () => {
  return (
    <div className=" ">
      <p className=  "text-gray-600 font-bold text-center py-6 text-2xl hover:text-gray-800">
        برند های همکار با ما
      </p>
      <div className="container max-auto  m-auto  grid grid-cols-4 gap-4 md:flex md:items-center md:justify-around  border border-[#EDEDED] rounded-xl mt-8 bg-white shadow-sm">
        <img
          src={BMW}
          alt="BMW"
          className="w-12 h-12 md:w-auto md:h-auto mx-auto"
        />
        <img
          src={Honda}
          alt="Honda"
          className="w-12 h-12 md:w-auto md:h-auto mx-auto"
        />
        <img
          src={Hyundai}
          alt="Hyundai"
          className="w-12 h-12 md:w-auto md:h-auto mx-auto"
        />
        <img
          src={KIA1}
          alt="KIA1"
          className="w-12 h-12 md:w-auto md:h-auto mx-auto"
        />

        <img
          src={Marcedes}
          alt="Marcedes"
          className="w-12 h-12 md:w-auto md:h-auto mx-auto"
        />
        <img
          src={Nissan}
          alt="Nissan"
          className="w-12 h-12 md:w-auto md:h-auto mx-auto"
        />
        <img
          src={Toyota}
          alt="Toyota"
          className="w-12 h-12 md:w-auto md:h-auto mx-auto"
        />
        <img
          src={lexus}
          alt="lexus"
          className="w-12 h-12 md:w-auto md:h-auto mx-auto"
        />
      </div>
    </div>
  );
};

export default CarParts;
