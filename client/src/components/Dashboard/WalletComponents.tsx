import logowallet from "../../../assets/logowallet.png";
import { type walletType } from "../../dashboard/Types/Dashboard.type";

const WalletComponents = (props: walletType) => {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50/50 p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-50 p-2.5 rounded-xl group-hover:bg-blue-100 transition-colors duration-300">
            <img
              src={logowallet}
              alt="logowallet"
              className="w-6 h-6 sm:w-7 sm:h-7 object-contain"
            />
          </div>
          <p className="text-gray-700 text-sm sm:text-base font-medium">
            {props.nameCart}
          </p>
        </div>

        <div className="bg-blue-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl font-bold text-sm sm:text-base shadow-sm group-hover:shadow-md group-hover:bg-blue-600 transition-all duration-300">
          {props.countCart}
        </div>
      </div>
    </div>
  );
};

export default WalletComponents;
