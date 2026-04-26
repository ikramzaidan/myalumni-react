import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Loading from "./pages/Loading";
import { AuthProvider, useAuth } from "./auth/AuthContext";

/**
 * App content that uses AuthContext
 * Separated to allow AuthProvider to wrap the component
 */
const AppContent = () => {
    const { loading, logOut, ...authState } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logOut();
        navigate("/login");
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <Outlet context={{ 
            ...authState,
            logOut: handleLogout
        }} />
    );
};

const App = () => {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
};

export default App;