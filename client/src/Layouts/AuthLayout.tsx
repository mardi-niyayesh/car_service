import { Outlet } from "react-router-dom";
const AuthLayout = () => {
  return (
    <>
    <main>
        <Outlet/>
    </main>
    </>
  )
};

export default AuthLayout;
