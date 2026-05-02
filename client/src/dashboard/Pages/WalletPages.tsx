//components
import WalletComponents from "../Components/WalletComponents";
const WalletPages = () => {
  return (
    <>
      <div>
        <p className="text-[#212121] text-[14px] sm:text-[16px] md:text-[18px] font-bold">
          کیف پول
        </p>
        <WalletComponents
          nameCart="کشاورزی "
          countCart="2221 - 0057 - 4680 - 2089"
        />
      </div>
    </>
  );
};

export default WalletPages;
