import { Outlet } from "react-router-dom";
import ComponentsPanelAdmin from "./ComponentsPanelAdmin";
import HeaderDashbord from "../../dashboard/Components/HeaderDashbord";

const PanelAdminLayout = () => {
  return (
    <div className="flex bg-[#F6F6F6] min-h-screen">
      <div className=" md:flex fixed top-0 right-0 h-full w-72 z-40">
        <ComponentsPanelAdmin />
      </div>
      <div className="flex-1 md:mr-72 flex flex-col">
        <HeaderDashbord />
        <main className="flex-1 p-4 pb-20 md:pb-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PanelAdminLayout;
