//icons
import editoutlin from "../../../assets/edit-outline.png";
import profilUser from "../../../assets/Ellipse 114.png";
import wallet from "../../../assets/empty-wallet.png";
import ArrowLeft from "../../../assets/Arrowleft.png";
import location from "../../../assets/loc.png";
import card from "../../../assets/card-pos.png";
import reserv from "../../../assets/reserve.png";
import comment from "../../../assets/comment.png";
import logout from "../../../assets/logout.png";

//
import { Link } from "react-router-dom";
import { useUser } from "../../hooks/useUser";

const DashboardSidebar = () => {
  const { user } = useUser();
  return (
    <div className="flex flex-col items-start w-full">
      {/* profile User*/}
      <div className="flex justify-between  gap-4 items-center w-full max-w-[400px] p-3 rounded-2xl bg-[#EDEDED]">
        <img
          src={profilUser}
          alt="profilUser"
          className="w-12 h-12 md:w-14 md:h-14"
        />
        <div>
          <p className="font-bold text-[14px] md:text-[16px] text-[#353535]">
            {user?.display_name}
          </p>
          <p className="text-[#727272] font-medium text-[11px] md:text-[13px]">
            {user?.email}
          </p>
        </div>
        <img
          src={editoutlin}
          alt="editoutlin"
          className="w-5 h-5 md:w-6 md:h-6 cursor-pointer"
        />
      </div>

      {/*Menue*/}
      <div className="mt-5 w-full max-w-[400px] bg-[#EDEDED] rounded-2xl p-2 md:p-3">
        {/* items wallet*/}
        <Link to="/dashboard/wallet">
          <div className="flex justify-between items-center p-2 md:p-3 border-b-2 border-[#F3F3F3] hover:bg-blue-600 transition-all duration-300 rounded-lg cursor-pointer group">
            <div className="flex items-center gap-2 md:gap-3">
              <img
                src={wallet}
                alt="wallet"
                className="w-5 h-5 md:w-6 md:h-6 group-hover:brightness-0 group-hover:invert transition-all duration-300"
              />
              <p className="text-[12px] md:text-[13px] font-medium text-[#494949] group-hover:text-white transition-all duration-300">
                کیف پول
              </p>
            </div>
            <img
              src={ArrowLeft}
              alt="ArrowLeft"
              className="w-4 h-4 md:w-5 md:h-5 opacity-60 group-hover:brightness-0 group-hover:invert group-hover:opacity-100 transition-all duration-300"
            />
          </div>
        </Link>

        {/* items reserve*/}
        <Link to="reserve">
          <div className="flex justify-between items-center p-2 md:p-3 border-b-2 border-[#F3F3F3] hover:bg-blue-600 transition-all duration-300 rounded-lg cursor-pointer group">
            <div className="flex items-center gap-2 md:gap-3">
              <img
                src={reserv}
                alt="reserv"
                className="w-5 h-5 md:w-6 md:h-6 group-hover:brightness-0 group-hover:invert transition-all duration-300"
              />
              <p className="text-[12px] md:text-[13px] font-medium text-[#494949] group-hover:text-white transition-all duration-300">
                رزروهای من
              </p>
            </div>
            <img
              src={ArrowLeft}
              alt="ArrowLeft"
              className="w-4 h-4 md:w-5 md:h-5 opacity-60 group-hover:brightness-0 group-hover:invert group-hover:opacity-100 transition-all duration-300"
            />
          </div>
        </Link>

        {/* item address*/}
        <Link to="address">
          <div className="flex justify-between items-center p-2 md:p-3 border-b-2 border-[#F3F3F3] hover:bg-blue-600 transition-all duration-300 rounded-lg cursor-pointer group">
            <div className="flex items-center gap-2 md:gap-3">
              <img
                src={location}
                alt="location"
                className="w-5 h-5 md:w-6 md:h-6 group-hover:brightness-0 group-hover:invert transition-all duration-300"
              />
              <p className="text-[12px] md:text-[13px] font-medium text-[#494949] group-hover:text-white transition-all duration-300">
                آدرس‌های من
              </p>
            </div>
            <img
              src={ArrowLeft}
              alt="ArrowLeft"
              className="w-4 h-4 md:w-5 md:h-5 opacity-60 group-hover:brightness-0 group-hover:invert group-hover:opacity-100 transition-all duration-300"
            />
          </div>
        </Link>

        {/* items card*/}
        <Link to="card">
          <div className="flex justify-between items-center p-2 md:p-3 border-b-2 border-[#F3F3F3] hover:bg-blue-600 transition-all duration-300 rounded-lg cursor-pointer group">
            <div className="flex items-center gap-2 md:gap-3">
              <img
                src={card}
                alt="card"
                className="w-5 h-5 md:w-6 md:h-6 group-hover:brightness-0 group-hover:invert transition-all duration-300"
              />
              <p className="text-[12px] md:text-[13px] font-medium text-[#494949] group-hover:text-white transition-all duration-300">
                پرداخت‌های من
              </p>
            </div>
            <img
              src={ArrowLeft}
              alt="ArrowLeft"
              className="w-4 h-4 md:w-5 md:h-5 opacity-60 group-hover:brightness-0 group-hover:invert group-hover:opacity-100 transition-all duration-300"
            />
          </div>
        </Link>

        {/* item comment*/}
        <Link to="comment">
          <div className="flex justify-between items-center p-2 md:p-3 border-b-2 border-[#F3F3F3] hover:bg-blue-600 transition-all duration-300 rounded-lg cursor-pointer group">
            <div className="flex items-center gap-2 md:gap-3">
              <img
                src={comment}
                alt="comment"
                className="w-5 h-5 md:w-6 md:h-6 group-hover:brightness-0 group-hover:invert transition-all duration-300"
              />
              <p className="text-[12px] md:text-[13px] font-medium text-[#494949] group-hover:text-white transition-all duration-300">
                نظرات من
              </p>
            </div>
            <img
              src={ArrowLeft}
              alt="ArrowLeft"
              className="w-4 h-4 md:w-5 md:h-5 opacity-60 group-hover:brightness-0 group-hover:invert group-hover:opacity-100 transition-all duration-300"
            />
          </div>
        </Link>

        {/* item logout*/}
        <Link to="logout">
          <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 hover:bg-red-500 transition-all duration-300 rounded-lg cursor-pointer group">
            <img
              src={logout}
              alt="logout"
              className="w-5 h-5 md:w-6 md:h-6 group-hover:brightness-0 group-hover:invert transition-all duration-300"
            />
            <p className="text-[12px] md:text-[13px] font-medium text-[#494949] group-hover:text-white transition-all duration-300">
              خروج
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default DashboardSidebar;
