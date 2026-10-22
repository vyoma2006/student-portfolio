import { Navigate } from "react-router-dom";
import { isLoggedIn } from "../api";

// Wrap any page that needs a logged-in user.
function ProtectedRoute({ children }) {
    return isLoggedIn() ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;