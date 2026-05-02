//Types
import { type ReservAutorentType } from "../../types/auth.types";
const ComponentReservAutorent = (props: ReservAutorentType) => {
  return (
    <>
      <div className="text-center lg:text-right">
        <div className="flex justify-center lg:justify-end mb-4">
          <img
            src={props.logo}
            alt="one number"
            className="w-12 h-12 md:w-16 md:h-16"
          />
        </div>
        <div className="font-bold text-xl md:text-4xl lg:text-3xl mb-2">
          <span className="text-[#D79C10]">{props.firstname} </span>
          <span className="text-[#5E5E5E] text-lg md:text-xl lg:text-3xl font-medium">
            {props.secondname}
          </span>
        </div>
        <div className="text-[#5E5E5E] max-w-[250px] md:max-w-[300px] mx-auto lg:mx-0 text-sm md:text-base lg:text-[16px]">
          {props.descripton}
        </div>
      </div>
    </>
  );
};

export default ComponentReservAutorent;
