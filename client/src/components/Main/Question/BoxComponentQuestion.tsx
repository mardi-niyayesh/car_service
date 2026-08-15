import { useState } from "react";

type BoxComponentType = {
  title: string;
  text?: string;
  image?: string;
};

const BoxComponentQuestion = ({ title, text, image }: BoxComponentType) => {
  const [showFullText, setShowFullText] = useState(false);

  const toggleAnswer = () => {
    if (text) {
      setShowFullText((prev) => !prev);
    }
  };

  return (
    <div className="w-full px-2 py-2 sm:px-3">
      <div
        className={`
          overflow-hidden
          rounded-2xl
          border
          bg-white
          shadow-sm
          transition-all
          duration-300
          ease-out

          ${
            showFullText
              ? "border-[#FDB713] shadow-md"
              : "border-gray-200 hover:border-gray-300 hover:shadow-md"
          }
        `}
      >
        {image && (
          <div className="relative w-full overflow-hidden">
            <img
              src={image}
              alt={title}
              loading="lazy"
              decoding="async"
              className="
                block
                aspect-video
                w-full
                object-cover
              "
            />
          </div>
        )}

        <button
          type="button"
          onClick={toggleAnswer}
          disabled={!text}
          className={`
            group
            flex
            w-full
            items-center
            justify-between
            gap-4
            px-4
            py-4
            text-right
            sm:px-5
            sm:py-5
            lg:px-6
            transition-all
            duration-300

            ${showFullText ? "bg-[#FDB713]" : "bg-white hover:bg-gray-50"}

            ${!text ? "cursor-default" : "cursor-pointer"}
          `}
        >
          <span
            className={`
              flex-1
              text-sm
              font-semibold
              leading-7
              sm:text-base
              md:text-lg
              transition-colors
              duration-300

              ${showFullText ? "text-gray-900" : "text-[#2D2D2D]"}
            `}
          >
            {title}
          </span>

          {text && (
            <span
              className={`
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-full
                border
                text-lg
                font-medium
                transition-all
                duration-300
                sm:h-10
                sm:w-10
                sm:text-xl

                ${
                  showFullText
                    ? "rotate-180 border-black/10 bg-white/90 text-gray-800"
                    : "border-gray-200 bg-gray-50 text-gray-600 group-hover:border-[#FDB713] group-hover:bg-[#fff8df]"
                }
              `}
            >
              <span className="leading-none">{showFullText ? "−" : "+"}</span>
            </span>
          )}
        </button>

        <div
          className={`
            grid
            transition-all
            duration-500
            ease-[cubic-bezier(0.4,0,0.2,1)]

            ${
              showFullText
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0"
            }
          `}
        >
          <div className="min-h-0 overflow-hidden">
            {text && (
              <div
                className="
                  border-t
                  border-gray-100
                  px-4
                  py-4
                  sm:px-5
                  sm:py-5
                  lg:px-6
                  lg:py-6
                "
              >
                <p
                  className="
                    text-justify
                    text-xs
                    font-medium
                    leading-7
                    text-gray-600
                    sm:text-sm
                    sm:leading-8
                    md:text-base
                    md:leading-8
                  "
                >
                  {text}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoxComponentQuestion;
