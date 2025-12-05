import { Navigate } from 'react-router-dom';
import type { ReactElement } from 'react'; 

interface ProtectedRouteProps {
    children: ReactElement;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
        return <Navigate to="/" replace />;
    }
    
    return children;
};

export default ProtectedRoute;