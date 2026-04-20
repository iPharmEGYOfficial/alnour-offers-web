import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="center-screen">
      <div className="auth-card">
        <Outlet />
      </div>
    </div>
  );
}
