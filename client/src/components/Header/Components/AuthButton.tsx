import { FaUser } from "react-icons/fa";
const AuthButton = () => {
  return (
    <div
      className="inline-flex cursor-pointer items-center justify-between  py-3 w-auto rounded-lg
                    md:bg-[#137cfd] transition duration-300 ease-in-out text-white
                   group
                   sm:justify-center sm:px-2 
                   md:hover:bg-[#105ab4]"
    >
      <FaUser size={20} className="md:block text-blue-900" />
      <button className="hidden md:block font-medium ">ورود | ثبت نام</button>
    </div>
  );
};

export default AuthButton;
