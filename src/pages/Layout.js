import { useEffect, useState } from "react";
import Alert from "../components/Alert";
import ProfileBar from "../components/ProfileBar";
import { Link, Outlet, useLocation, useNavigate, useOutletContext, useParams } from "react-router-dom";

const Layout = () => {
    const [openSide, setOpenSide] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    const { logOut } = useOutletContext();
    const { jwtToken } = useOutletContext();
    const { alertClassName } = useOutletContext();
    const { alertMessage } = useOutletContext();

    const location = useLocation();
    const navigate = useNavigate();
    let { id } = useParams();

    const handleSidebarClick = () => {
        setOpenSide((prev) => !prev);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    }

    const handleDeleteSurvey = () => {
        let headers = new Headers();
        headers.append("Authorization", "Bearer " + jwtToken)

        const requestOptions = {
            method: "DELETE",
            headers: headers,
        }

        fetch(`http://localhost:8080/forms/${id}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    console.log(data.error);
                } else {
                    navigate("/surveys");
                    setOpenModal(false);
                }
            })
            .catch(err => {console.log(err)});
    }

    useEffect(() => {
        setOpenSide(false);
    }, [location.pathname]);

    return(
        <>
            <div className="md:px-0 lg:px-20 xl:px-40">
                <div className="flex overflow-hidden">

                    {/* Sidebar */}
                    <aside className={"md:flex md:relative w-64 md:w-60 h-screen px-4 py-4 md:py-10 bg-white shadow-xl shadow-gray-300 md:shadow-none border-r " + (openSide ? "absolute z-10" : "hidden")}>
                        <div className="flex flex-col h-full w-full">
                            <div className="md:hidden flex w-full justify-end py-2">
                                <button onClick={handleSidebarClick}>
                                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18 18 6m0 12L6 6"/>
                                    </svg>
                                </button>
                            </div>
                            <ul className="flex flex-col gap-3">
                                <Link to="/">
                                    <li className="hover:bg-gray-200 w-full px-4 py-2 rounded-md text-base font-medium">
                                        Dasbor
                                    </li>
                                </Link>
                                <Link to="/alumni">
                                    <li className="hover:bg-gray-200 w-full px-4 py-2 rounded-md text-base font-medium">
                                        Alumni
                                    </li>
                                </Link>
                                <Link to="/articles">
                                    <li className="hover:bg-gray-200 w-full px-4 py-2 rounded-md text-base font-medium">
                                        Artikel
                                    </li>
                                </Link>
                                <Link to="/surveys">
                                    <li className="hover:bg-gray-200 w-full px-4 py-2 rounded-md text-base font-medium">
                                        Survei
                                    </li>
                                </Link>
                            </ul>
                        </div>
                    </aside>

                    {/* Main */}
                    <div className={"md:blur-none relative flex flex-1 flex-col " + (openSide ? "blur-md" : "")}>

                        {/* Profilebar */}
                        <header className="sticky top-0 flex flex-col w-full py-4 px-4 sm:px-8">
                            <div className="flex flex-grow items-center justify-between">
                                <button onClick={handleSidebarClick} className="md:hidden">
                                    <svg className="w-8 h-8 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M5 7h14M5 12h14M5 17h14"/>
                                    </svg>
                                </button>
                                <form className="hidden md:flex items-center">   
                                    <label htmlFor="simple-search" className="sr-only">Search</label>
                                    <div className="relative w-full">
                                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                            <svg className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"/>
                                            </svg>
                                        </div>
                                        <input type="text" id="simple-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-8 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search..." required></input>
                                    </div>
                                </form>
                                {jwtToken === "" 
                                ? 
                                <ProfileBar className="invisible" logOut={logOut} />
                                :
                                <ProfileBar logOut={logOut} />
                                }
                            </div>
                        </header>

                        {/* Main Content */}
                        <div className="py-5 px-6 sm:px-8">
                            <Alert message={alertMessage} className={alertClassName} />
                            <Outlet context={{ jwtToken, setOpenModal }} />
                        </div>
                        
                    </div>
                </div>
            </div>
            {openModal ? (
                <>
                    <div className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 w-full h-full bg-black opacity-80 z-10"></div>
                    <div className="fixed top-0 right-0 left-0 z-20 flex justify-center items-center w-full h-full">
                        <div className="relative p-4 w-full max-w-2xl max-h-full">
                            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        Header
                                    </h3>
                                    <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" onClick={handleCloseModal}>
                                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                        </svg>
                                        <span className="sr-only">Close modal</span>
                                    </button>
                                </div>
                                <div className="p-4 md:p-5 space-y-4">
                                    <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                                        With less than a month to go before the European Union enacts new consumer privacy laws for its citizens, companies around the world are updating their terms of service agreements to comply.
                                    </p>
                                </div>
                                <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                                    <button onClick={handleDeleteSurvey} type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Ya</button>
                                    <button onClick={handleCloseModal} type="button" className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Batal</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : ("")
            }
        </>
    );
}

export default Layout;