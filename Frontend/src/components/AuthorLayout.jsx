import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const AuthorLayout = ({ children }) => {

    return (

        <div className="flex">

            <Sidebar role="AUTHOR" />

            <div className="flex-1">

                <Navbar />

                <div>
                    {children}
                </div>

            </div>

        </div>

    );
};

export default AuthorLayout;