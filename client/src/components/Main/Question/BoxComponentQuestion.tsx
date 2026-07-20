import { useState } from "react";

type BoxComponentType = {
  title: string;
  text?: string;
  image?: string;
};

const BoxComponentQuestion = (props: BoxComponentType) => {
  const [showFullText, setShowFullText] = useState(false);
  return (
    <div className="w-full px-2 py-2 sm:px-3 sm:py-3">
      <div className="bg-white rounded-xl border border-yellow-200 shadow-lg overflow-hidden">
        <div className="block sm:hidden">
          {props.image && (
            <div className="w-full aspect-video">
              <img
                src={props.image}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div
            onClick={() => props.text && setShowFullText(!showFullText)}
            className="flex items-center justify-between cursor-pointer group px-3 py-3"
          >
            <div className="text-[#2D2D2D] font-medium text-sm sm:text-base flex-1 leading-6">
              {props.title}
            </div>
            {props.text && (
              <div
                className={`
                  flex-shrink-0 w-8 h-8 
                  flex items-center justify-center 
                  rounded-lg bg-yellow-100 text-gray-600 font-bold text-2xl
                  transition-all duration-300 
                  ${showFullText ? "rotate-180" : "rotate-0"}
                `}
              >
                <span>{showFullText ? "−" : "+"}</span>
              </div>
            )}
          </div>
        </div>

        <div className="hidden sm:flex sm:flex-row sm:items-center sm:gap-5 sm:p-5 lg:gap-6 lg:p-6">
       
          {props.image && (
            <div className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 flex-shrink-0">
              <img
                src={props.image}
                alt=""
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          )}
          <div
            onClick={() => props.text && setShowFullText(!showFullText)}
            className="flex-1 flex items-center justify-between gap-3 cursor-pointer group"
          >
            <div className="text-[#2D2D2D] font-medium text-base sm:text-lg lg:text-xl flex-1">
              {props.title}
            </div>
            {props.text && (
              <div
                className={`
                  flex-shrink-0 w-9 h-9 md:w-10 md:h-10  
                  flex items-center justify-center 
                  rounded-lg bg-yellow-100 group-hover:bg-yellow-200 text-gray-600 
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
            <div className="px-4 pb-4 sm:px-5 sm:pb-5 lg:px-6 lg:pb-6">
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
