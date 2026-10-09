import Logo from "./Components/Logo";
import AuthButton from "./Components/AuthButton";
import Basket from "./Components/Basket";
import MenuHeader from "./Components/MenuHeader";

import { useUser } from "../../hooks/useUser";
import { Link } from "react-router-dom";
import { IoChevronDown } from "react-icons/io5";

const ContainerHeader = () => {
  const { user } = useUser();

  const userLink =
    user?.roles.length === 1 && user.roles[0] === "self"
      ? "/dashboard"
      : "/panel";

  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow-sm">
      <nav className="container mx-auto px-3 sm:px-5 lg:px-6">

        <div
          className="
            flex
            min-h-18
            items-center
            justify-between
            gap-3
            sm:min-h-20
            md:min-h-[84px]
          "
        >
          {/* Logo */}
          <div className="shrink-0">
            <Logo />
          </div>


          <div
            className="
              flex
              min-w-0
              items-center
              justify-end
              gap-2
              sm:gap-3
              md:gap-4
            "
          >
            {user ? (
              <Link
                to={userLink}
                className="
                  group
                  flex
                  min-w-0
                  max-w-38
                  items-center
                  justify-center
                  gap-1.5

                  rounded-xl
                  border
                  border-[#FDB713]/30
                  bg-[#FDB713]

                  px-3
                  py-2.5

                  text-white
                  shadow-sm

                  transition-all
                  duration-300
                  ease-out

                  hover:-translate-y-0.5
                  hover:bg-[#E5A500]
                  hover:shadow-md

                  active:scale-[0.98]

                  sm:max-w-48
                  sm:px-4

                  md:max-w-58
                  md:px-5
                  md:py-3
                "
              >
                <span
                  className="
                    min-w-0
                    truncate
                    text-xs
                    font-semibold

                    sm:text-sm
                    md:text-base
                  "
                  title={user.display_name}
                >
                  {user.display_name}
                </span>

                <IoChevronDown
                  size={17}
                  className="
                    shrink-0
                    text-white
                    transition-transform
                    duration-300
                    group-hover:translate-y-0.5
                  "
                />
              </Link>
            ) : (
              <AuthButton />
            )}

            <div className="shrink-0">
              <Basket />
            </div>
          </div>
        </div>

   
        <div className="pb-2 md:pb-3">
          <MenuHeader />
        </div>
      </nav>
    </header>
  );
};

export default ContainerHeader;