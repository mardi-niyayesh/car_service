import BMW from "../../../assets/imges/BMW.png";
import Honda from "../../../assets/imges/Honda.png";
import Hyundai from "../../../assets/imges/Hyundai.png";
import KIA1 from "../../../assets/imges/KIA (1).png";
import Marcedes from "../../../assets/imges/Marcedes.png";
import Nissan from "../../../assets/imges/Nissan.png";
import Toyota from "../../../assets/imges/Toyota.png";
import lexus from "../../../assets/imges/lexus-logo.png";

const icons = [
  { id: 1, icon: BMW },
  { id: 2, icon: Honda },
  { id: 3, icon: Hyundai },
  { id: 4, icon: KIA1 },
  { id: 5, icon: Marcedes },
  { id: 6, icon: Nissan },
  { id: 7, icon: Toyota },
  { id: 8, icon: lexus },
];

const CarParts = () => {
  return (
    <div>
      <p className="font-bold text-[#FDB713] text-2xl text-center my-8">
        برند های همکار با ما
      </p>
      <div className="container mx-auto grid grid-cols-4 gap-4 md:flex md:items-center md:justify-around shadow-2xl rounded-xl mt-8 bg-white  p-4">
        {icons.map((i) => (
          <div key={i.id} className="flex justify-center">
            <img
              src={i.icon}
              alt={`brand-${i.id}`}
              className="w-12 h-12 md:w-auto md:h-auto object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarParts;
