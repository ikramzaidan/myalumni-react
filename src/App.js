import React from "react";
import { Outlet } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";

const App = () => {
    return (
        <AuthProvider>
            <Outlet />
        </AuthProvider>
    );
};

export default App;