import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from 'react';
import Input from './../components/Input';
import { useNavigate, useOutletContext } from 'react-router-dom';

const Login = () => {
    const { jwtToken } = useOutletContext();
    const { setJwtToken } = useOutletContext();
    const { setIsAdmin } = useOutletContext();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();

        let payload = {
            email: email,
            password: password,
        }

        const requestOptions = {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            credentials: 'include',
            body: JSON.stringify(payload),
        }

        fetch('http://localhost:8080/authenticate', requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if(data.error) {
                    setError(true);
                } else {
                    setJwtToken(data.access_token);
                    const decodedJwt = jwtDecode(data.access_token);
                    setIsAdmin(decodedJwt.adm);                  
                }
            })
            .catch(error => {
                console.log(error);
            })
    }

    useEffect(() => {
        if (jwtToken !== "") {
            navigate("/");
        }
    }, [jwtToken, navigate]);
    
    return (
        <>
            <div className="flex justify-center items-center h-screen bg-blue-600 px-6 md:px-0">
                <div className="flex flex-col w-full md:w-96 bg-white shadow-lg shadow-black py-8 px-12 border-2 border-black">
                    <h2 className="text-2xl font-extrabold mb-3">MyAlumni.</h2>
                    <div className={`mb-3 text-sm font-medium text-red-500 dark:text-red-400 ${!error ? "invisible" : ""}`} role="alert">
                        Email atau password salah.
                    </div>
                    <form onSubmit={handleSubmit}>
                        <Input
                            title="Email"
                            type="text"
                            name="email"
                            placeHolder="Email"
                            onChange={(event) => setEmail(event.target.value)}
                            className="w-full px-3 py-2 border-2 border-black focus:border-blue-300 focus:ring-blue-300"
                        ></Input>
                        <Input
                            title="Password"
                            type="password"
                            name="password"
                            placeHolder="Password"
                            onChange={(event) => setPassword(event.target.value)}
                            className="w-full px-3 py-2 border-2 border-black focus:border-blue-300 focus:ring-blue-300"
                        ></Input>
                        <button 
                            type="submit" 
                            className="text-white text-sm text-center mt-3 py-3 px-7 bg-black font-bold
                                hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-blue-300"   
                        >Login</button>
                    </form>
                </div>
            </div>
        </>
    );
    
}

export default Login;