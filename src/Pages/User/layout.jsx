import Navbar from "../../Components/User/NavBar";

const UserLayout = ({ children }) => (
  <div className="flex flex-col h-screen">
    <Navbar />
    <main className="flex-1 p-4 bg-gray-50">{children}</main>
  </div>
);

export default UserLayout;
