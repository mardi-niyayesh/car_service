//hook
import { useState } from "react";

const GaleryCarComponent = ({ carImages }) => {
  const [mainImage, setMainImage] = useState(carImages[0]);
  return (
    <div className="lg:col-span-2">
      <div className="relative">
        <img
          src={mainImage}
          alt="ماشین اصلی"
          className="w-full rounded-lg h-auto mb-4 "
        />
        <ol className="flex overflow-x-auto rounded-2xl space-x-4 pb-2">
          {carImages.slice(1).map((img, i) => (
            <li key={i}>
              <img
                src={img}
                alt={`عکس ماشین`}
                
                className="w-20 h-20 object-cover rounded-md cursor-pointer 
                           hover:border-2 hover:border-blue-500 
                           transition-transform duration-300 ease-in-out transform hover:scale-110" 
                onClick={() => setMainImage(img)}
              />
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default GaleryCarComponent;
