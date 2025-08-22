import Sidebar from "../../Components/Admin/layout/SideBar";

const AdminLayout = ({ children }) => (
  <div className="flex h-screen">
    <Sidebar />
    <main className="flex-1 p-6 bg-gray-50">{children}</main>
  </div>
);

export default AdminLayout;
