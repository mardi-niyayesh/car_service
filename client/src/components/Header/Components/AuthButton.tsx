import { Link } from "react-router-dom";
import { FaUser } from "react-icons/fa";

const AuthButton = () => {
  return (
    <Link
      to="/login"
      className="inline-flex items-center justify-center gap-2
                 px-3 py-3 sm:px-3 md:px-5
                 rounded-full md:rounded-lg
                 bg-[#FDB713]                 
                 text-white
                 hover:bg-yellow-600             
                 transition-all duration-300 ease-in-out
                 border border-yellow-500/30   
                 md:border-0                   
                 hover:scale-105 md:hover:scale-100
                 active:scale-95
                 group"
    >
      <FaUser
        size={18}
        className="text-white
                   transition-transform duration-300
                   group-hover:scale-110"
      />
      <span className="hidden md:inline font-medium text-sm lg:text-base">
        ورود | ثبت نام
      </span>
    </Link>
  );
};

export default AuthButton;
