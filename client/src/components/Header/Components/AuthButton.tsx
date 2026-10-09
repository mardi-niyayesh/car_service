import { Link } from "react-router-dom";
import { FaUser } from "react-icons/fa";

type AuthButtonProps = {
  isLoggedIn?: boolean;
  userName?: string;
};

const AuthButton = ({
  isLoggedIn = false,
  userName = "",
}: AuthButtonProps) => {
  return (
    <Link
      to={isLoggedIn ? "/profile" : "/login"}
      className="
        group
        inline-flex
        min-w-0
        max-w-full
        items-center
        justify-center
        gap-2

        rounded-full
        border
        border-[#FDB713]/40
        bg-[#FDB713]

        px-3
        py-2.5
        sm:px-4
        md:rounded-xl
        md:px-5
        md:py-3

        text-white

        shadow-sm
        transition-all
        duration-300
        ease-out

        hover:-translate-y-0.5
        hover:bg-[#E5A500]
        hover:shadow-md

        active:translate-y-0
        active:scale-[0.98]
      "
    >
      <FaUser
        size={17}
        className="
          shrink-0
          text-white
          transition-transform
          duration-300
          ease-out
          group-hover:scale-110
        "
      />

      {isLoggedIn ? (
        <span
          className="
            min-w-0
            max-w-[90px]
            truncate

            text-xs
            font-semibold

            sm:max-w-[130px]
            sm:text-sm

            md:max-w-[180px]
            md:text-base
          "
          title={userName}
        >
          {userName}
        </span>
      ) : (
        <span
          className="
            hidden
            font-semibold
            md:inline
            text-sm
            lg:text-base
            whitespace-nowrap
          "
        >
          ورود | ثبت نام
        </span>
      )}
    </Link>
  );
};

export default AuthButton;