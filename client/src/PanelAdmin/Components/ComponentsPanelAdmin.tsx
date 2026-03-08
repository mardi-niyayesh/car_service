//
import { Link } from "react-router-dom";
//img or icon
import profilUser from "../../../assets/Ellipse 114.png";
import editoutlin from "../../../assets/edit-outline.png";
import ArrowLeft from "../../../assets/Arrowleft.png";

const ComponentsPanelAdmin = () => {
  return (
    <div>
      {/* profile User*/}
      <div className="flex justify-around items-center w-full max-w-[400px] p-3 rounded-2xl bg-[#EDEDED]">
        <img
          src={profilUser}
          alt="profilUser"
          className="w-12 h-12 md:w-14 md:h-14"
        />
        <div>
          <p className="font-bold text-[14px] md:text-[16px] text-[#353535]">
            name
          </p>
          <p className="text-[#727272] font-medium text-[11px] md:text-[13px]">
            email
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
       
        {/* items users*/}
        <Link to="/panel/users">
          <div className="flex justify-between items-center p-2 md:p-3 border-b-2 border-[#F3F3F3] hover:bg-blue-500 transition-all duration-300 rounded-lg cursor-pointer group">
            <div className="flex items-center gap-2 md:gap-3">
              {/* <img
                src={}
                alt=""
                className="w-5 h-5 md:w-6 md:h-6 group-hover:brightness-0 group-hover:invert transition-all duration-300"
              /> */}
              <p className="text-[12px] md:text-[13px] font-medium text-[#494949] group-hover:text-white transition-all duration-300">
                کاربران
              </p>
            </div>
            <img
              src={ArrowLeft}
              alt="ArrowLeft"
              className="w-4 h-4 md:w-5 md:h-5 opacity-60 group-hover:brightness-0 group-hover:invert group-hover:opacity-100 transition-all duration-300"
            />
          </div>
        </Link>

        {/* item products*/}
        <Link to="/panel/product">
          <div className="flex justify-between items-center p-2 md:p-3 border-b-2 border-[#F3F3F3] hover:bg-blue-500 transition-all duration-300 rounded-lg cursor-pointer group">
            <div className="flex items-center gap-2 md:gap-3">
              {/* <img
                src={}
                alt="comment"
                className="w-5 h-5 md:w-6 md:h-6 group-hover:brightness-0 group-hover:invert transition-all duration-300"
              /> */}
              <p className="text-[12px] md:text-[13px] font-medium text-[#494949] group-hover:text-white transition-all duration-300">
                محصولات
              </p>
            </div>
            <img
              src={ArrowLeft}
              alt=""
              className="w-4 h-4 md:w-5 md:h-5 opacity-60 group-hover:brightness-0 group-hover:invert group-hover:opacity-100 transition-all duration-300"
            />
          </div>
        </Link>

        {/* item categori*/}
        <Link to="/panel/category">
          <div className="flex justify-between items-center p-2 md:p-3  hover:bg-blue-500 transition-all duration-300 rounded-lg cursor-pointer group">
            <div className="flex items-center gap-2 md:gap-3">
              {/* <img
                src={}
                alt=""
                className="w-5 h-5 md:w-6 md:h-6 group-hover:brightness-0 group-hover:invert transition-all duration-300"
              /> */}
              <p className="text-[12px] md:text-[13px] font-medium text-[#494949] group-hover:text-white transition-all duration-300">
                دسته بندی
              </p>
            </div>
            <img
              src={ArrowLeft}
              alt=""
              className="w-4 h-4 md:w-5 md:h-5 opacity-60 group-hover:brightness-0 group-hover:invert group-hover:opacity-100 transition-all duration-300"
            />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ComponentsPanelAdmin;
