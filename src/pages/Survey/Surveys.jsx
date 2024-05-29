import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import { PiNewspaperClippingFill } from "react-icons/pi";

const Surveys = () => {
    const { jwtToken } = useOutletContext();
    const [surveys, setSurveys] = useState([]);

    useEffect( () => {
        if (jwtToken !== "") {
            
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Authorization", "Bearer " + jwtToken);

            const requestOptions = {
                method: "GET",
                headers: headers,
            }

            fetch('http://localhost:8080/forms', requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    setSurveys(data)
                })
                .catch(err => {
                    console.log(err);
                })
        }

    }, [jwtToken]);

    return (
        <>
            <div className="flex justify-between items-center w-full mb-5">
                <h2 className="text-xl sm:text-lg font-bold">Surveys</h2>
                <Link to="/surveys/create" className="flex items-center bg-black hover:bg-gray-800 py-2 px-2 rounded-md text-xs font-semibold text-white">Create new</Link>
            </div>
            <div className="flex flex-col gap-4">
                {!surveys || surveys.length === 0 ? (
                    <div className="flex flex-col w-full h-64 justify-center items-center text-gray-400">
                        <div className="text-6xl mb-2"><PiNewspaperClippingFill /></div>
                        <div className="text-2xl font-bold">Belum ada Survey.</div>
                    </div>
                ) : (
                    <div>
                        {surveys.map((a) => (
                        <div key={a.id} className="border rounded-xl shadow-md p-4 mb-3">
                            <div className="flex justify-between items-center">
                                <Link to={`/surveys/${a.id}`}><h3 className="text-lg font-semibold line-clamp-1">{a.title}</h3></Link>
                                <Link to={`/surveys/${a.id}`}><IoIosArrowForward className="text-xl text-gray-400" title="Edit" /></Link>
                            </div>
                        </div>))}
                    </div>
                )}
                
            </div>
            
        </>
    );
}

export default Surveys;