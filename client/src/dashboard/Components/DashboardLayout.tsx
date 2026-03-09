import DashboardSidebar from "./DashboardSidebar";
import { Outlet } from "react-router-dom";
const DashboardLayout = () => {
  return (
    <>
      <div className="flex flex-col md:flex-row gap-3 md:gap-4 p-3 md:p-4 min-h-screen bg-white">
        <div >
          <DashboardSidebar />
          <div>
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;
