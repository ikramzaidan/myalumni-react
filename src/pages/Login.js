import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from 'react';
import Input from './../components/Input';
import Background from './../images/bg.jpg';
import TSLogo from './../images/ts-logo.png';
import Image from './../images/bg-2.png';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';

const Login = () => {
    const { jwtToken } = useOutletContext();
    const { setJwtToken } = useOutletContext();
    const { setIsAdmin } = useOutletContext();
    const { setMyUsername } = useOutletContext();
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

        fetch(`https://alumnihub.site/authenticate`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if(data.error) {
                    setError(true);
                } else {
                    setJwtToken(data.access_token);
                    const decodedJwt = jwtDecode(data.access_token);
                    setIsAdmin(decodedJwt.adm);
                    setMyUsername(decodedJwt.name); 
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
            <div className="relative flex justify-center items-center h-screen">
                <img src={Background} alt="Background" className="absolute inset-0 object-cover w-full h-full -z-20"/>
                <div className="absolute inset-0 bg-red-600 opacity-60 -z-10"></div>
                <div className="flex lg:grid lg:grid-cols-2 gap-10 xl:gap-24 items-start">
                    {/* <img src={Logo} className="absolute top-0 left-0 w-48 h-auto m-5 p-2 hover:shadow-lg" alt="Student" /> */}
                    <div className="hidden lg:flex items-center justify-center">
                        <h1 className="flex flex-col font-extrabold text-white">
                            <div className="flex gap-3 items-center justify-center">
                                <img src={TSLogo} className="w-32 h-auto" alt="Student" />
                                <div className="flex flex-col">
                                    <span className="text-xl [text-shadow:_-3px_5px_0_#000]">Portal Alumni</span>
                                    <span className="text-5xl [text-shadow:_-3px_5px_0_#000]">SMA Telkom</span>
                                    <span className="text-5xl mb-3 [text-shadow:_-3px_5px_0_#000]">Bandung</span>
                                </div>
                            </div>
                            <div className="text-xl xl:text-2xl [text-shadow:_-3px_5px_0_#000] mt-4">"Maju Bersama Hebat Semua. GEN BIRU Juara!"</div>
                        </h1>
                        <img src={Image} className="absolute bottom-0 w-[360px] h-auto" alt="Student" />
                    </div>
                    <div className="flex justify-center xl:px-12">
                        <div className="flex flex-col w-full bg-white shadow-lg shadow-black py-8 px-10 border-2 border-black">
                            <h2 className="text-2xl font-extrabold mb-4">Login</h2>
                            <form onSubmit={handleSubmit} className="mb-5">
                                <Input
                                    title="Email"
                                    type="text"
                                    name="email"
                                    placeHolder="Email"
                                    onChange={(event) => setEmail(event.target.value)}
                                    className="w-64 lg:w-full px-3 py-2 border-2 border-black focus:border-blue-300 focus:ring-blue-300"
                                    autoComplete="email"
                                ></Input>
                                <Input
                                    title="Password"
                                    type="password"
                                    name="password"
                                    placeHolder="Password"
                                    marginBottom="mb-1"
                                    onChange={(event) => setPassword(event.target.value)}
                                    className="w-64 lg:w-full px-3 py-2 border-2 border-black focus:border-blue-300 focus:ring-blue-300 mb-0"
                                ></Input>
                                <div className={`mb-3 text-sm font-medium text-red-500 dark:text-red-400 ${!error ? "invisible" : ""}`} role="alert">
                                    Email atau password salah.
                                </div>
                                <button 
                                    type="submit" 
                                    className="text-white text-sm text-center py-3 px-7 bg-black font-bold
                                        hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-blue-300"   
                                >Login</button>
                            </form>
                            <div className="text-sm">Belum punya akun? <Link to="/register" className="font-semibold text-red-500 hover:underline">Daftar</Link></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
    
}

export default Login;