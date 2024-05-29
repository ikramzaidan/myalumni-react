import { useState } from 'react';
import Input from './../components/Input';
import { useNavigate, useOutletContext } from 'react-router-dom';

const Signin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { setJwtToken } = useOutletContext();
    const { setAlertMessage } = useOutletContext();
    const { setAlertClassName } = useOutletContext();
    const { toggleRefresh } = useOutletContext();

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
            credentials: "include",
            body: JSON.stringify(payload),
        }

        fetch('/authenticate', requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if(data.error) {
                    setAlertClassName("");
                    setAlertMessage(data.message)
                } else {
                    setJwtToken(data.access_token);
                    setAlertClassName("hidden");
                    setAlertMessage("");
                    toggleRefresh(true);
                    navigate("/");
                }
            })
            .catch(error => {
                setAlertClassName("");
                setAlertMessage(error.message)
            })
    }

    return (
        <>
            <div className="flex justify-between items-center w-full mb-3">
                <h2 className="font-bold">Data Artikel</h2>
            </div>
            <div className="flex flex-col w-2/6 shadow-lg py-6 px-12 rounded-md">
                <h2 className="text-2xl font-bold text-center mb-5">MyAlumni</h2>
                <form onSubmit={handleSubmit}>
                    <Input
                        type="text"
                        name="email"
                        placeholder="Email"
                        onChange={(event) => setEmail(event.target.value)}
                    ></Input>
                    <Input
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={(event) => setPassword(event.target.value)}
                    ></Input>
                    <input 
                        type="submit" 
                        className="w-full text-white text-sm text-center my-4 py-3 bg-blue-700 font-medium rounded-lg 
                            hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300" 
                        value="Login"    
                    />
                </form>
            </div>
        </>
    );
}

export default Signin;