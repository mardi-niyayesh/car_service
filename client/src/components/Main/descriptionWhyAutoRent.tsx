//Types
import { type descriptionWhyAutoRenttype } from "../../types/auth.types";
const DescriptionWhyAutoRent = (props: descriptionWhyAutoRenttype) => {
  return (
    <div>
      <div className="bg-white border border-[#D7D7D7] p-4 md:p-6 w-full max-w-[320px] md:w-[320px] rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="flex flex-col items-center">
          <div className="rounded-2xl border-2 border-[#414141] p-2 mb-4">
            <img
              src={props.logo}
              alt="box"
              className="w-12 h-12 md:w-14 md:h-14 object-contain"
            />
          </div>
          <h3 className="font-bold text-[14px] md:text-[16px] text-[#414141] text-center mb-2">
            {props.name}
          </h3>
          <p className="text-[#757575] text-[12px] md:text-[13px] text-center leading-relaxed">
            {props.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DescriptionWhyAutoRent;
