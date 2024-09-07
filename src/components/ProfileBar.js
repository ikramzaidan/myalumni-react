import { useEffect, useState } from "react";
import { IoCaretUp, IoCaretDown } from "react-icons/io5";
import { Link, useLocation } from "react-router-dom";


const ProfileBar = (props) => {
    const [openNav, setOpenNav] = useState(false);

    const location = useLocation();

    useEffect(() => {
        setOpenNav(false);
    }, [location.pathname]);

    return(
        <div className={props.className}>
            <button onClick={() => setOpenNav((prev) => !prev) } className="flex gap-1 items-center py-2">
                <div className="max-w-[150px] font-semibold me-1 truncate ...">{props.userName}</div>
                <div className="flex gap-1 items-center">
                    {props.userPhoto !== "" ? (
                        <img src={"https://alumnihub.site/" + props.userPhoto} className="object-cover w-8 h-8 rounded-full" alt="Profile" />
                    ) : (
                        <svg className="w-8 h-8 text-black hover:text-gray-700 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a9 9 0 0 0 5-1.5 4 4 0 0 0-4-3.5h-2a4 4 0 0 0-4 3.5 9 9 0 0 0 5 1.5Zm3-11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                        </svg>
                    )}
                    {!openNav 
                    ? 
                    <IoCaretDown />
                    : 
                    <IoCaretUp />
                    }
                </div>
            </button>

            {openNav ? (
            <div className="z-10 absolute right-8 border bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                <ul className="py-2 px-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                    <li>
                        <Link to="/profile" className="block px-4 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 dark:hover:text-white">Profile</Link>
                    </li>
                    <li>
                        <button onClick={props.logOut} className="w-full text-start block px-4 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 dark:hover:text-white">Logout</button>
                    </li>
                </ul>
            </div>
            ) : "" }

        </div>
    )
}

export default ProfileBar;