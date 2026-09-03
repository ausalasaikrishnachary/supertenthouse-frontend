import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* future admin navbar */}
      <Outlet />
    </div>
  );
}