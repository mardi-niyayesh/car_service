import { Outlet } from "react-router-dom";
import ComponentsPanelAdmin from "./ComponentsPanelAdmin";

const PanelAdminLayout = () => {
  return (
    <>
      <div className=" md:block md:w-64 lg:w-72 xl:w-80">
        <ComponentsPanelAdmin />
        <div>
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default PanelAdminLayout;
