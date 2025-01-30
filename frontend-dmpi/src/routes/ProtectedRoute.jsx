import { useNavigate } from "react-router-dom";
import { useAuth } from '../modules/context/AuthContext';
import { useEffect } from "react";

const ProtectedRoute = ({ children, pageName }) => {
    const navigate = useNavigate();
    const { accessToken } = useAuth();

    useEffect(() => {
        if (accessToken.UserLevel != 'Schema Admin' && accessToken.UserLevel != 'Admin' && pageName == 'My Portal') {
            return navigate('/access-denied');
        }

        if (accessToken.UserLevel == 'COA User' && pageName != 'Inquiry') { 
            console.log(pageName);
            return navigate('/access-denied');
        }

        if (accessToken.UserLevel != 'Schema Admin' && ['User List', 'Scanner List', 'Doc Type List', 'Department List', 'Logs'].includes(pageName)) { 
            console.log(pageName);
            return navigate('/access-denied');
        }
    }, [])
    
    return children
};

export default ProtectedRoute;