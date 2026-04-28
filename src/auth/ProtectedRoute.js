import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Loading from '../pages/Loading';

const ProtectedRoute = () => {
    const { jwtToken, loading } = useAuth();

    if (loading) {
        return <Loading />;
    }

    if (!jwtToken) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
