//components
import DescriptionWhyAutoRent from "./descriptionWhyAutoRent";
//Types
import {type feacherWhyAutoRent } from "../../types/auth.types";

const feacherWhyAutoRent: feacherWhyAutoRent[] = [
  {
    name: "تحویل در محل",
    logo: "   ../../../assets/box.png",
    description: "تحویل خودرو در زمان و مکان تعیین شده توسط شما خواهد بود.",
    id: 1,
  },
  {
    name: "پشتیبانی 24 ساعته",
    logo: "../../../assets/24-support.png",
    description:
      "کارشناسان ما در هر زمان و مکان، پاسخگوی سوالات شما خواهند بود.",
    id: 2,
  },
  {
    name: "قیمت مناسب",
    logo: "../../../assets/wallet-minus.png",
    description: "هدف ما، ارائه بهترین خدمات با مناسب ترین قیمت ممکن است.",
    id: 3,
  },
];

const ComponentWhyAutoRent = () => {
  return (
    <div className="flex">
      {feacherWhyAutoRent.map((feacher) => {
        return (
          <DescriptionWhyAutoRent
            name={feacher.name}
            logo={feacher.logo}
            description={feacher.description}
            key={feacher.id}
            id={feacher.id}
          />
        );
      })}
    </div>
  );
};

export default ComponentWhyAutoRent;
