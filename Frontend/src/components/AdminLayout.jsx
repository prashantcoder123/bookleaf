import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const AdminLayout = ({ children }) => {

    return (

        <div className="flex">

            <Sidebar role="ADMIN" />

            <div className="flex-1">

                <Navbar />

                <div>
                    {children}
                </div>

            </div>

        </div>

    );
};

export default AdminLayout;