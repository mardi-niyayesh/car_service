import { Link } from "react-router-dom";
import { FaUser } from "react-icons/fa"; 

const AuthButton = () => {
  return (
    <div
      className="inline-flex cursor-pointer items-center justify-between py-3 w-auto rounded-lg
                    md:bg-[#FDB713] transition duration-300 ease-in-out text-white
                   group
                   sm:justify-center sm:px-2
                   md:hover:bg-yellow-600"
    >
      <Link to="/login" className="flex items-center px-3">
        <FaUser size={20} className="md:block text-white mr-2 pl-1" />
        <button className="hidden md:block font-medium ">ورود | ثبت نام</button>
      </Link>
    </div>
  );
};

export default AuthButton;
