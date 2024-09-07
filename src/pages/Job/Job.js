import { useOutletContext, useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { PiBriefcaseFill } from "react-icons/pi";
import { IoEllipsisVertical, IoLocationOutline, IoTimeOutline, IoWalletOutline } from 'react-icons/io5';

const Job = () => {
    const { jwtToken } = useOutletContext();
    const { profile } = useOutletContext();
    const [isOwner, setIsOwner] = useState(false);
    const [job, setJob] = useState({});

    const [dropdown, setDropdown] = useState(false); // State untuk dropdown
    const dropdownRef = useRef(null);

    let { id } = useParams();

    // handle click di luar dropdown  
    const handleClickOutsideDropdown = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDropdown(false);
        }
    };

    // useEffect untuk dropdown
    useEffect(() => {
        if (dropdown) {
            document.addEventListener('mousedown', handleClickOutsideDropdown);
        } else {
            document.removeEventListener('mousedown', handleClickOutsideDropdown);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutsideDropdown);
        };

    }, [dropdown]);

    // Get data artikel pertama kali load
    useEffect(() => {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", "Bearer " + jwtToken);

        const requestOptions = {
            method: "GET",
            headers: headers,
        }

        fetch(`https://alumnihub.site/jobs/${id}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if(data.error === true) {
                    setJob({});
                } else {
                    setJob(data);
                    if (data.user_id === profile.user_id) {
                        setIsOwner(true);
                    }
                }
            })
            .catch(err => {
                console.log(err);
            })

    }, [id, jwtToken, profile]);

    const formatIndonesianDate = (isoDateString) => {
        const date = new Date(isoDateString);
    
        const optionsDate = { year: 'numeric', month: 'long', day: 'numeric' };
    
        const formattedDate = date.toLocaleDateString('id-ID', optionsDate);
    
        return `${formattedDate}`;
    };

    function formatRupiah(number) {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
    }

    return (
        <>
            <div className="flex justify-between items-center w-full mb-5">
                <h2 className="text-lg font-bold">Loker</h2>
                {isOwner ? (
                    <>
                    <button type="button" onClick={() => setDropdown((prev) => !prev)} className={`${dropdown ? "bg-gray-100" : ""} hover:bg-gray-100 p-1 rounded-md text-xl text-black`}><IoEllipsisVertical className="stroke-w-4" /></button>
                    {dropdown ? (
                        <div ref={dropdownRef} className="z-10 absolute top-[8rem] right-6 lg:right-8 border bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700" onBlur={() => setDropdown((prev) => !prev)}>
                            <ul className="py-2 px-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                                <li>
                                    <button type="button" className="w-full text-start block px-4 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 dark:hover:text-white">Edit</button>
                                </li>
                                <li>
                                    <button type="button" className="w-full text-start block px-4 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 dark:hover:text-white">Delete</button>
                                </li>
                            </ul>
                        </div>
                    ) : "" }
                    </>
                ) : ("")}
            </div>
            {/* <pre>{JSON.stringify(profile, null, 3)}</pre> */}
            {!job || Object.keys(job).length === 0 ? (
                <div className="flex flex-col w-full h-64 justify-center items-center text-gray-400">
                    <div className="text-6xl mb-2"><PiBriefcaseFill /></div>
                    <div className="text-2xl font-bold">Pekerjaan tidak ditemukan.</div>
                </div>
            ) : (
                <div className="w-full border rounded-xl shadow-md p-5">
                    <h2 className="text-2xl font-bold">{job.job_position}</h2>
                    <h3 className="text-gray-500">{job.company}</h3>
                    <div className="flex flex-col my-5">
                        <div className="flex gap-3 items-center mb-1.5">
                            <div className="text-xl text-gray-500">
                                <IoLocationOutline />
                            </div>
                            <div className="">
                                {job.job_location}
                            </div>
                        </div>
                        {job.job_type ? (
                            <div className="flex gap-3 items-center mb-1.5">
                                <div className="text-xl text-gray-500">
                                    <IoTimeOutline />
                                </div>
                                <div className="">
                                    {job.job_type}
                                </div>
                            </div>
                        ) : ("")}
                        {job.min_salary || job.max_salary ? (
                            <div className="flex gap-3 items-center mb-1.5">
                                <div className="text-xl text-gray-500">
                                    <IoWalletOutline />
                                </div>
                                <div className="">
                                    {job.min_salary ? formatRupiah(job.min_salary) : formatRupiah(0)} {job.max_salary ? (`- ${formatRupiah(job.max_salary)}`) : ("")}
                                </div>
                            </div>
                        ) : ("")}
                        <div className="text-sm text-gray-500 font-light">Diposting pada {formatIndonesianDate(job.created_at)}</div>
                    </div>
                    <div className="article-content" dangerouslySetInnerHTML={{ __html: job.description }}></div>
                </div>
            )}
        </>
    );
}

export default Job;