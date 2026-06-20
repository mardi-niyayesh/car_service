import logo from "../../../../assets/imges/logo21.png";
const Logo = () => {
  return (
    <div className="  flex items-center ">
      <img src={logo} alt="" className="w-[100px]" />
      <span className="text-[18px] md:text-[22px] lg:text-[24px] font-bold text-[#FDB713]">
        کار سرویس
      </span>
    </div>
  );
};
export default Logo;
