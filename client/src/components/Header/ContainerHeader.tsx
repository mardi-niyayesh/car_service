import SearchButton from "./Components/SearchButton";
import Logo from "./Components/Logo";
import Basket from "./Components/Basket";
import AuthButton from "./Components/AuthButton";

const ContainerHeader = () => {
  return (
    <div className="container mx-auto flex items-center justify-between p-6">
      <Logo />
      <SearchButton />
      <div className="flex items-center gap-2">
        <AuthButton />
        <Basket />
      </div>
    </div>
  );
};

export default ContainerHeader;
