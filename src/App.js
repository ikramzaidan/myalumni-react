import { jwtDecode } from "jwt-decode";
import React, { useCallback, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Loading from "./pages/Loading";

const App = () => {
    const [jwtToken, setJwtToken] = useState("");
    const [isAdmin, setIsAdmin] = useState();
    const [loading, setLoading] = useState(true);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertClassName, setAlertClassName] = useState("hidden");
    const [tickInterval, setTickInterval ] = useState();

    const navigate = useNavigate();

    const logOut = () => {
        const requestOptions = {
            method: "GET",
            credentials: "include",
        }

        fetch('http://localhost:8080/logout', requestOptions)
        .catch(error => {
            console.log("error logging out", error)
        })
        .finally(() => {
            setJwtToken("");
            toggleRefresh(false);
        })

        navigate("/login");
    }

    const toggleRefresh = useCallback((status) => {
        if (status) {
            console.log("turning on ticking");
            let i  = setInterval(() => {

                const requestOptions = {
                    method: "GET",
                    credentials: "include",
                }

                fetch(`http://localhost:8080/refresh`, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    if (data.access_token) {
                        setJwtToken(data.access_token);
                        const decodedJwt = jwtDecode(data.access_token);
                        setIsAdmin(decodedJwt.adm);  
                    }
                })
                .catch(error => {
                    console.log("user is not logged in", error);
                    navigate('/login');
                })

            }, 600000);
            setTickInterval(i);
            console.log("setting tick interval to", i);
        } else {
            console.log("turning off ticking");
            console.log("turning off tickInterval", tickInterval);
            setTickInterval(null);
            clearInterval(tickInterval);
        }
    }, [tickInterval]);

    useEffect(() => {
        if (jwtToken === "") {
            const requestOptions = {
                method: "GET",
                credentials: "include",
            }

            fetch(`http://localhost:8080/refresh`, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    if (data.access_token) {
                        setJwtToken(data.access_token);
                        const decodedJwt = jwtDecode(data.access_token);
                        setIsAdmin(decodedJwt.adm); 
                        toggleRefresh(true);
                    }
                    setLoading(false);
                })
                .catch(error => {
                    navigate('/login');
                    setLoading(false);
                })

        } else {
            setLoading(false);
        }
    }, [jwtToken, toggleRefresh, navigate]);

    if (loading) {
        return (
            <Loading />
        );
    } else {
        return(
            <>
                <Outlet context={{ 
                    jwtToken, setJwtToken, isAdmin, setIsAdmin, toggleRefresh, logOut, alertClassName, alertMessage, setAlertClassName, setAlertMessage
                }} />
            </>
        );
    }
}

export default App;