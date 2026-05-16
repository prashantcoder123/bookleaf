import { Navigate } from "react-router-dom";

const AuthorRoute = ({ children }) => {

    const token = localStorage.getItem("token");

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    if (!token) {
        return <Navigate to="/login" />;
    }

    if (user?.role !== "AUTHOR") {
        return <Navigate to="/admin" />;
    }

    return children;
};

export default AuthorRoute;