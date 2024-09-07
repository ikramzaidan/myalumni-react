import { jwtDecode } from "jwt-decode";
import React, { useCallback, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Loading from "./pages/Loading";

const App = () => {
    const [jwtToken, setJwtToken] = useState("");
    const [myUsername, setMyUsername] = useState();
    const [isAdmin, setIsAdmin] = useState();
    const [loading, setLoading] = useState(true);
    const [tickInterval, setTickInterval ] = useState();

    const navigate = useNavigate();

    const logOut = () => {
        const requestOptions = {
            method: "GET",
            credentials: "include",
        }

        fetch(`https://alumnihub.site/logout`, requestOptions)
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

                fetch(`https://alumnihub.site/refresh`, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    if (data.access_token) {
                        setJwtToken(data.access_token);
                        const decodedJwt = jwtDecode(data.access_token);
                        setIsAdmin(decodedJwt.adm);
                        setMyUsername(decodedJwt.name);  
                    }
                })
                .catch(error => {
                    console.log("user is not logged in", error);
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

            fetch(`https://alumnihub.site/refresh`, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    if (data.access_token) {
                        setJwtToken(data.access_token);
                        const decodedJwt = jwtDecode(data.access_token);
                        setIsAdmin(decodedJwt.adm);
                        setMyUsername(decodedJwt.name);
                        toggleRefresh(true);
                    }
                    setLoading(false);
                })
                .catch(error => {
                    setLoading(false);
                })

        } else {
            setLoading(false);
        }
    }, [jwtToken, toggleRefresh]);

    if (loading) {
        return (
            <Loading />
        );
    } else {
        return(
            <>
                <Outlet context={{ 
                    jwtToken, setJwtToken, isAdmin, myUsername, setIsAdmin, setMyUsername, toggleRefresh, logOut
                }} />
            </>
        );
    }
}

export default App;