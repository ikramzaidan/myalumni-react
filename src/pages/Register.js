// import { useEffect } from 'react';
import { useState } from 'react';
import Input from './../components/Input';
import Image from './../images/bg-2.jpg';
import Logo from './../images/sma-logo.png';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    // const { jwtToken } = useOutletContext();
    const [alumni, setAlumni] = useState({});
    const [nisn, setNisn] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [step, setStep] = useState(1);
    const [errors, setErrors] = useState([]);
    const [passwordMatched, setPasswordMatched] = useState(false);

    const navigate = useNavigate();

    const addError = (errorType, errorMsg) => {
        setErrors((prevErrors) => {
          // Cek apakah errorType sudah ada dalam prevErrors
          const errorIndex = prevErrors.findIndex((error) => error.errorType === errorType);
      
          if (errorIndex === -1) {
            // Jika errorType belum ada, tambahkan pesan error baru
            return [...prevErrors, { errorType, errorMsg }];
          } else {
            // Jika errorType sudah ada, perbarui pesan error yang ada
            return prevErrors.map((error, index) =>
              index === errorIndex ? { ...error, errorMsg } : error
            );
          }
        });
    };

    const deleteError = (errorType) => {
        // Filter errors untuk menyimpan semua error kecuali yang memiliki tipe yang sesuai dengan errorType yang diberikan
        const updatedErrors = errors.filter((error) => error.errorType !== errorType);
      
        // Perbarui state errors dengan updatedErrors
        setErrors(updatedErrors);
    };

    const handleErrorMsg = (errorType) => {
        // Cari error dengan tipe yang sesuai dalam state errors
        const error = errors.find((error) => error.errorType === errorType);
        
        // Jika error ditemukan, kembalikan pesan kesalahan, jika tidak, kembalikan string kosong
        return error ? error.errorMsg : "";
    };

    const handleFirstSubmit = (event) => {
        event.preventDefault();

        let payload = {
            nisn: nisn,
        }

        if (payload.nisn === "") {
            addError("nisn", "Please enter a field");
        } else {
            const requestOptions = {
                method: "POST",
                headers: {
                    'Content-Type': "application/json"
                },
                credentials: 'include',
                body: JSON.stringify(payload),
            }
    
            fetch(`https://alumnihub.site/register_check`, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    if(data.error) {
                        addError("nisn", data.message);
                    } else {
                        deleteError("nisn");
                        setAlumni(data);
                        setStep(2);     
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }

    const handleSecondSubmit = (event) => {
        event.preventDefault();
        setStep(3);  
    }

    const handleThirdSubmit = (event) => {
        event.preventDefault();

        let payload = {
            username: username,
            email: email,
            password: password,
            alumni_id: alumni.id
        }

        const requestOptions = {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            credentials: 'include',
            body: JSON.stringify(payload),
        }

        if (passwordMatched) {
            fetch(`https://alumnihub.site/register`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if(data.error) {
                    if (data.message === "all fields are required") {
                        addError("email", "Please enter a field"); 
                        addError("username", "Please enter a field"); 
                        addError("password", "Please enter a field");
                    }
                } else {
                    navigate("/login");          
                }
            })
            .catch(err => {
                console.log(err);
            })
        } else {
            addError("confirm_password", "Password harus sesuai.");
        }
    }

    const handleBackStep = () => {
        setStep((prevStep) => Math.max(prevStep - 1, 1)); // Pastikan tidak bisa mundur lebih dari langkah pertama
        if (step === 2) {
            setAlumni({});
            setNisn("");
            setEmail("");
            setUsername("");
        }
        
        setErrors([]);
    }

    const handleConfirmPasswordChange = (event) => {
        const confirmPasswordValue = event.target.value;

        if (confirmPasswordValue !== password) {
            addError("confirm_password", "Password harus sesuai.");
        } else {
            deleteError("confirm_password");
            setPasswordMatched(true);
        }
    }

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <FirstStep 
                        handleSubmit={handleFirstSubmit} 
                        setNisn={setNisn}
                        errorMsg={handleErrorMsg}
                    />
                );
            case 2:
                return (
                    <SecondStep
                        handleSubmit={handleSecondSubmit}
                        handleBack={handleBackStep}
                        alumni={alumni}
                    />
                );
            case 3:
                return (
                    <ThirdStep
                        handleSubmit={handleThirdSubmit}
                        handleBack={handleBackStep}
                        setEmail={setEmail}
                        setUsername={setUsername}
                        setPassword={setPassword}
                        setConfirmPassword={handleConfirmPasswordChange}
                        valueUsername={username}
                        valueEmail={email}
                        errorMsg={handleErrorMsg}
                    />
                );
            default:
                return null;
        }
    }
    
    return (
        <>
            <div className="flex w-full lg:grid lg:grid-cols-5 min-h-screen">
                <div className="hidden lg:flex lg:justify-center lg:col-span-2 relative w-full h-full py-32">
                    <img src={Image} alt="Background" className="absolute inset-0 object-cover w-full h-full z-0"/>
                    <div className="absolute inset-0 bg-red-600 opacity-60 z-10"></div>
                    <h1 className="flex flex-col font-extrabold text-white z-20">
                        <div className="text-5xl mb-3 [text-shadow:_-3px_5px_0_#000]">Pendaftaran</div>
                        <div className="text-5xl mb-3 [text-shadow:_-3px_5px_0_#000]">Portal Alumni</div>
                        {/* <div className="flex flex-col">
                            <span className="text-4xl mb-3 [text-shadow:_-3px_5px_0_#000]">SMA Telkom</span>
                            <span className="text-4xl mb-4 [text-shadow:_-3px_5px_0_#000]">Bandung</span>
                        </div> */}
                    </h1>
                </div>
                <img src={Logo} className="absolute top-0 left-0 w-36 h-auto z-10 m-5" alt="Logo" />
                <div className="w-full lg:col-span-3 bg-white">
                    <div className="flex w-full h-full justify-center items-center">
                        <div className="flex flex-col justify-between min-h-[70vh] lg:min-w-[50%]">
                            <div className="flex flex-col">                              
                                {renderStep()}
                            </div>
                            <div className="flex gap-2 py-4 justify-center">
                                <div className={`rounded-full w-3 h-3 ${step === 1 ? "bg-red-500" : "bg-gray-500"}`}></div>
                                <div className={`rounded-full w-3 h-3 ${step === 2 ? "bg-red-500" : "bg-gray-500"}`}></div>
                                <div className={`rounded-full w-3 h-3 ${step === 3 ? "bg-red-500" : "bg-gray-500"}`}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
    
}

const FirstStep = ({ handleSubmit, setNisn, errorMsg }) => {
        return(
            <>
                <div className="text-3xl font-extrabold mb-5 lg:mb-10">Masukkan NISN/NIS</div>
                <form onSubmit={handleSubmit}>
                    <Input
                        title="NISN"
                        labelClassName="font-bold"
                        type="text"
                        name="nisn"
                        placeHolder="Enter your NISN"
                        onChange={(event) => setNisn(event.target.value)}
                        className="w-full px-3 py-2 border border-black focus:border-blue-500 focus:ring-blue-500"
                        errorMsg={errorMsg("nisn")}
                    ></Input>
                    <div className="flex justify-between gap-4 mb-3">
                        <button 
                            type="submit" 
                            className="text-white text-sm text-center mt-3 py-3 px-7 bg-black font-bold
                                hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-blue-300 w-full"   
                        >Lanjut</button>
                        <button 
                            type="submit" 
                            className="text-white text-sm text-center mt-3 py-3 px-7 bg-gray-400 font-bold
                                hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-blue-300 w-full invisible"   
                        >Kembali</button>
                    </div>
                    <div className="text-sm">Sudah punya akun? <Link to="/login" className="font-semibold text-red-500 hover:underline">Masuk</Link></div>
                </form>
            </>
    );
}

const SecondStep = ({ handleSubmit, handleBack, alumni }) => {
    return(
        <>
            <div className="text-3xl font-extrabold mb-5 lg:mb-10">Verifikasi Identitas</div>
            <form onSubmit={handleSubmit}>
                <Input
                    title="Nama"
                    labelClassName="font-bold"
                    type="text"
                    name="name"
                    value={alumni.name}
                    readOnly="true"
                    className="w-full px-3 py-2 border border-black focus:border-blue-500 focus:ring-blue-500"
                ></Input>
                <Input
                    title="Tahun Lulus"
                    labelClassName="font-bold"
                    type="text"
                    name="name"
                    value={alumni.graduation_year}
                    readOnly="true"
                    className="w-full px-3 py-2 border border-black focus:border-blue-500 focus:ring-blue-500"
                ></Input>
                <div className="flex justify-between gap-4">
                    <button 
                        type="button"
                        onClick={handleBack}
                        className="text-white text-sm text-center mt-3 py-3 px-7 bg-gray-400 font-bold
                            hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-blue-300 w-full"   
                    >Kembali</button>
                    <button 
                        type="submit" 
                        className="text-white text-sm text-center mt-3 py-3 px-7 bg-black font-bold
                            hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-blue-300 w-full"   
                    >Lanjut</button>
                </div>
            </form>
        </>
    );
}

const ThirdStep = ({ handleSubmit, handleBack, setEmail, setUsername, setPassword, setConfirmPassword, valueUsername, valueEmail, errorMsg}) => {
    return(
        <>
            <div className="text-3xl font-extrabold mb-5 lg:mb-10">Isi Data Akun</div>
            <form onSubmit={handleSubmit}>
                <Input
                    title="Email"
                    labelClassName="font-bold"
                    type="email"
                    name="email"
                    value={valueEmail}
                    placeHolder="Enter your Email"
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full px-3 py-2 border border-black focus:border-blue-500 focus:ring-blue-500"
                    errorMsg={errorMsg("email")}
                ></Input>
                <Input
                    title="Username"
                    labelClassName="font-bold"
                    type="username"
                    name="username"
                    value={valueUsername}
                    placeHolder="Enter your Username"
                    onChange={(event) => setUsername(event.target.value)}
                    className="w-full px-3 py-2 border border-black focus:border-blue-500 focus:ring-blue-500"
                    errorMsg={errorMsg("username")}
                ></Input>
                <Input
                    title="Password"
                    labelClassName="font-bold"
                    type="password"
                    name="password"
                    placeHolder="Enter your Password"
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full px-3 py-2 border border-black focus:border-blue-500 focus:ring-blue-500"
                    errorMsg={errorMsg("password")}
                ></Input>
                <Input
                    title="Konfirmasi Password"
                    labelClassName="font-bold"
                    type="password"
                    name="confirm_password"
                    placeHolder="Enter your Password"
                    onChange={setConfirmPassword}
                    className="w-full px-3 py-2 border border-black focus:border-blue-500 focus:ring-blue-500"
                    errorMsg={errorMsg("confirm_password")}
                ></Input>
                <div className="flex justify-between gap-4">
                    <button 
                        type="button"
                        onClick={handleBack}
                        className="text-white text-sm text-center mt-3 py-3 px-7 bg-gray-400 font-bold
                            hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-blue-300 w-full"   
                    >Kembali</button>
                    <button 
                        type="submit" 
                        className="text-white text-sm text-center mt-3 py-3 px-7 bg-black font-bold
                            hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-blue-300 w-full"   
                    >Daftar</button>
                </div>
            </form>
        </>
    );
}

export default Register;