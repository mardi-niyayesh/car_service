import { Link } from "react-router-dom";
import { FaUser } from "react-icons/fa";

const AuthButton = () => {
  return (
    <div
      className="inline-flex shrink-0 cursor-pointer items-center justify-between w-auto rounded-lg
                 bg-transparent
                 md:bg-[#FDB713] transition duration-300 ease-in-out text-white
                 group
                 sm:justify-center sm:px-1
                 md:hover:bg-yellow-600"
    >
      <Link to="/login" className="flex items-center">
        <FaUser size={20} className="md:block text-white mr-2 pl-1" />
        <button className="hidden md:block font-medium">ورود | ثبت نام</button>
      </Link>
    </div>
  );
};

export default AuthButton;