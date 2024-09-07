import { useEffect, useState } from "react";
import ProfileBar from "../components/ProfileBar";
import { Link, Outlet, useLocation, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { IoBriefcase, IoChatbubbles, IoChevronBackOutline, IoDocumentText, IoHome, IoNewspaper, IoPeople, IoClose } from "react-icons/io5";

const Layout = () => {
    const [openSide, setOpenSide] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [ alertMessage, setAlertMessage ] = useState("");

    const { logOut } = useOutletContext();
    const { jwtToken } = useOutletContext();
    const { isAdmin } = useOutletContext();
    const { myUsername } = useOutletContext();

    const [profile, setProfile] = useState({});

    const location = useLocation();
    const navigate = useNavigate();
    let { id } = useParams();

    const pathParts = location.pathname.split('/');
    const basePath = `${pathParts[1]}`;
    // Menghilangkan elemen kosong yang dihasilkan oleh split pertama
    const filteredPathParts = pathParts.filter(part => part !== '');
    
    // Memeriksa apakah path memiliki satu segmen atau lebih
    const isSingleSegmentPath = filteredPathParts.length === 1 || filteredPathParts.length === 0;

    const handleSidebarClick = () => {
        setOpenSide((prev) => !prev);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    }

    const handleCloseAlert = () => {
        setAlertMessage("");
    }

    const handleDeleteSurvey = () => {
        let headers = new Headers();
        headers.append("Authorization", "Bearer " + jwtToken)

        const requestOptions = {
            method: "DELETE",
            headers: headers,
        }

        fetch(`https://alumnihub.site/forms/${id}`, requestOptions)
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

        if (jwtToken === "") {
            navigate("/login");
        } else {
            const headers = new Headers();
            headers.append("Authorization", "Bearer " + jwtToken)

            const requestOptions = {
                method: "GET",
                headers: headers,
            }

            fetch(`https://alumnihub.site/profile`, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    if (data.error) {
                        console.log(data.error);
                    } else {
                        setProfile(data);
                    }
                })
                .catch(err => {console.log(err)});
        }

    }, [jwtToken, isAdmin, navigate]);

    return(
        <>
            <div className="md:px-0 lg:px-20 xl:px-40">
                <div className="flex overflow-hidden">

                    {/* Sidebar */}
                    <aside className={"md:flex w-64 md:w-60 min-h-screen px-4 py-4 md:py-10 bg-white shadow-xl shadow-gray-300 md:shadow-none border-r " + (openSide ? "absolute z-10" : "hidden")}>
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
                                    <li className={`flex gap-2 items-center hover:bg-gray-200 w-full px-4 py-2 rounded-md text-base font-medium ${basePath === "" ? "bg-gray-200" : ""}`}>
                                        <IoHome />
                                        Dasbor
                                    </li>
                                </Link>
                                <Link to="/alumni">
                                    <li className={`flex gap-2 items-center hover:bg-gray-200 w-full px-4 py-2 rounded-md text-base font-medium ${basePath === "alumni" || basePath === "profile" ? "bg-gray-200" : ""}`}>
                                        <IoPeople />
                                        Alumni
                                    </li>
                                </Link>
                                <Link to="/forums">
                                    <li className={`flex gap-2 items-center hover:bg-gray-200 w-full px-4 py-2 rounded-md text-base font-medium ${basePath === "forums" ? "bg-gray-200" : ""}`}>
                                        <IoChatbubbles />
                                        Forum
                                    </li>
                                </Link>
                                <Link to="/articles">
                                    <li className={`flex gap-2 items-center hover:bg-gray-200 w-full px-4 py-2 rounded-md text-base font-medium ${basePath === "articles" ? "bg-gray-200" : ""}`}>
                                        <IoNewspaper />
                                        Artikel
                                    </li>
                                </Link>
                                <Link to="/surveys">
                                    <li className={`flex gap-2 items-center hover:bg-gray-200 w-full px-4 py-2 rounded-md text-base font-medium ${basePath === "surveys" ? "bg-gray-200" : ""}`}>
                                        <IoDocumentText />
                                        Survei
                                    </li>
                                </Link>
                                <Link to="/jobs">
                                    <li className={`flex gap-2 items-center hover:bg-gray-200 w-full px-4 py-2 rounded-md text-base font-medium ${basePath === "jobs" ? "bg-gray-200" : ""}`}>
                                        <IoBriefcase />
                                        Loker
                                    </li>
                                </Link>
                            </ul>
                        </div>
                    </aside>

                    {/* Main */}
                    <div className={"md:blur-none relative flex flex-1 flex-col " + (openSide ? "blur-md" : "")}>

                        {/* Profilebar */}
                        <header className="sticky top-0 flex flex-col w-full py-3 px-4 sm:px-8 shadow-md">
                            <div className="flex flex-grow items-center justify-between">
                                <button onClick={handleSidebarClick} className="md:hidden">
                                    <svg className="w-8 h-8 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M5 7h14M5 12h14M5 17h14"/>
                                    </svg>
                                </button>
                                <button onClick={() => navigate(-1)} className={`text-xl rounded-full hover:bg-gray-200 p-1 ${isSingleSegmentPath ? "invisible" : "visible"}`} title="Kembali"><IoChevronBackOutline className="stroke-w-4" /></button>
                                {jwtToken === "" 
                                ? 
                                <ProfileBar className="invisible" logOut={logOut} />
                                :
                                <ProfileBar userName={myUsername ? myUsername : ""} userPhoto={profile.photo ? profile.photo : ""} logOut={logOut} />
                                }
                            </div>
                        </header>

                        {/* Main Content */}
                        <div className="py-5 px-6 sm:px-8">
                            <Outlet context={{ jwtToken, isAdmin, setOpenModal, profile, setAlertMessage }} />
                        </div>
                        
                    </div>
                    <div className={`
                        flex items-center gap-4 px-4 py-3 border bg-gray-50 shadow-md rounded-md z-20 fixed 
                        top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                        lg:top-auto lg:left-auto lg:bottom-8 lg:right-8 lg:transform-none
                        transition-opacity duration-500 ease-out
                        ${alertMessage ? "visible opacity-100" : "invisible opacity-0"}
                    `}>
                        <div className="text-sm min-w-44">{alertMessage}</div>
                        <button className="text-xl" onClick={handleCloseAlert}><IoClose /></button>
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
                                        Hapus Survei
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
                                        Apakah kamu yakin ingin menghapus survei ini? Tindakan ini bersifat permanen dan tidak dapat dikembalikan.
                                    </p>
                                </div>
                                <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                                    <button onClick={handleDeleteSurvey} type="button" className="text-white bg-red-500 hover:bg-red-400 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Ya</button>
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