import { useState } from "react";

type BoxComponentType = {
  title: string;
  text?: string;
  image?: string;
};

const BoxComponentQuestion = (props: BoxComponentType) => {
  const [showFullText, setShowFullText] = useState(false);
  return (
    <div className="w-full px-2 py-2">
     <div className="bg-white rounded-xl border p-4 border-blue-100 shadow-lg overflow-hidden">

        <div className="block sm:hidden">
          {props.image && (
            <div className="w-full h-48">
              <img
                src={props.image}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div
            onClick={() => props.text && setShowFullText(!showFullText)}
            className="flex items-center justify-between cursor-pointer group"
          >
            <div className="text-[#2D2D2D] font-medium text-sm flex-1 leading-6">
              {props.title}
            </div>
            {props.text && (
              <div
                className={`
                flex-shrink-0 w-7 h-7 flex items-center justify-center 
                rounded-lg bg-gray-100 text-gray-600 font-bold text-xl
                transition-all duration-300 
                ${showFullText ? "rotate-180" : "rotate-0"}
              `}
              >
                <span >{showFullText ? "−" : "+"}</span>
              </div>
            )}
          </div>
        </div>

        <div className="hidden sm:flex sm:flex-row sm:items-center sm:gap-4 sm:p-5">
          {props.image && (
            <div className="w-20 md:w-24 lg:w-28 flex-shrink-0">
              <img
                src={props.image}
                alt=""
                className="w-full h-20 md:h-24 lg:h-28 object-cover rounded-lg"
              />
            </div>
          )}

          <div
            onClick={() => props.text && setShowFullText(!showFullText)}
            className="flex-1 flex items-center justify-between gap-3 cursor-pointer group"
          >
            <div className="text-[#2D2D2D] font-medium text-base md:text-lg lg:text-xl flex-1">
              {props.title}
            </div>
            {props.text && (
              <div
                className={`
                flex-shrink-0 w-8 h-8 md:w-9 md:h-9 flex items-center justify-center 
                rounded-lg bg-gray-100 group-hover:bg-gray-200 text-gray-600 
                font-bold text-xl md:text-2xl transition-all duration-300
                ${showFullText ? "rotate-180" : "rotate-0"}
              `}
              >
                <span>{showFullText ? "−" : "+"}</span>
              </div>
            )}
          </div>
        </div>

        <div
          className={`
            overflow-hidden transition-all duration-500 ease-in-out
            ${showFullText ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
          `}
        >
          {props.text && (
            <div className="px-4 sm:px-5 pb-4 sm:pb-5">
              <div className="border-t border-gray-100 pt-3 sm:pt-4">
                <p className="text-gray-600 text-xs sm:text-sm md:text-base leading-6 text-justify">
                  {props.text}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BoxComponentQuestion;
