import React from 'react';

type CardType = {
  title: string;
  descriptions?: string[];
  description?: string;
  type: string;
};

const DescriptionComponent: React.FC<CardType> = ({
  title,
  descriptions,
  description,
  type,
}) => {
  return (
    <div className="bg-[#EDEDED] rounded-lg p-4 md:p-6 lg:p-8 mb-6 md:mb-8 lg:mb-10 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
      <p className="text-blue-800 font-bold text-lg sm:text-xl md:text-2xl lg:text-[24px] border-b-3 border-gray-300 pb-2 mb-4">
        {title}
      </p>
      <div className="text-[#353535] text-sm sm:text-base md:text-[14px] lg:text-base leading-relaxed text-justify">
        {type === "multiple_paragraphs" ? (
          <ol>
            {(descriptions || []).map((text: string, index: number) => (
              <li key={index}>{text}</li>
            ))}
          </ol>
        ) : type === "single_paragraph" ? (
          <p>{description}</p>
        ) : null}
      </div>
    </div>
  );
};

export default DescriptionComponent;
