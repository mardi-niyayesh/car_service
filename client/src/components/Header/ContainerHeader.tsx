import Logo from "./Components/Logo";
import SearchButton from "./Components/SearchButton";
import AuthButton from "./Components/AuthButton";
import Basket from "./Components/Basket";
import MenuHeader from "./Components/MenuHeader";
import { useUser } from "../../hooks/useUser";
import { Link } from "react-router-dom";
import { IoChevronDown } from "react-icons/io5";

const ContainerHeader = () => {
  const { user } = useUser();
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <nav className="container mx-auto pt-4 px-3">
        <div className="flex justify-between items-center md:hidden">
          <Logo />
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="text-[20px] text-blue-700 font-bold">
                  {user.display_name}
                  <IoChevronDown
                    size={18}
                    className="text-blue-700 inline-block ml-1"
                  />
                </span>
              </>
            ) : (
              <AuthButton />
            )}
            <Basket />
          </div>
        </div>

        <div className="md:hidden mt-3">
          <SearchButton />
          <div className="mt-3">
            <MenuHeader />
          </div>
        </div>

        <div className="hidden md:flex items-center justify-between w-full">
          <div className="flex items-center gap-6">
            <Logo />
            <SearchButton />
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <Link to="/dashboard">
                <span className="text-lg font-semibold text-blue-600 border-2 p-3 rounded-lg bg-blue-600 text-white">
                  {user.display_name}
                  <IoChevronDown
                    size={18}
                    className="text-white inline-block ml-1"
                  />
                </span>
              </Link>
            ) : (
              <AuthButton />
            )}
            <Basket />
          </div>
        </div>
      </nav>
      <div className="container mx-auto py-2 md:py-4">
        <MenuHeader />
      </div>
    </header>
  );
};

export default ContainerHeader;
