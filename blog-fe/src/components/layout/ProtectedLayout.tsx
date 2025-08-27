import { Outlet } from "react-router-dom";
import PrivateRoute from "../../routes/PrivateRoute";
import MainLayout from "./index";

const ProtectedLayout = () => {
  return (
    <PrivateRoute>
      <MainLayout>
        <Outlet />
      </MainLayout>
    </PrivateRoute>
  );
};

export default ProtectedLayout;
