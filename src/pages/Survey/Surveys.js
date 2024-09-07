import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import { IoAdd, IoCheckbox, IoDocumentText } from "react-icons/io5";

const Surveys = () => {
    const { jwtToken } = useOutletContext();
    const { isAdmin } = useOutletContext();
    const [surveys, setSurveys] = useState([]);
    const [answers, setAnswers] = useState([]);
    const filledSurveyIds = new Set((answers || []).map(answer => answer.form_id));

    useEffect( () => {
        if (jwtToken !== "") {
            
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Authorization", "Bearer " + jwtToken);

            const requestOptions = {
                method: "GET",
                headers: headers,
            }

            fetch(`https://alumnihub.site/forms`, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    setSurveys(data);
                })
                .catch(err => {
                    console.log(err);
                })

            if (!isAdmin) {
                const headers = new Headers();
                headers.append("Content-Type", "application/json");
                headers.append("Authorization", "Bearer " + jwtToken);

                const requestOptions = {
                    method: "GET",
                    headers: headers,
                }

                fetch(`https://alumnihub.site/answers`, requestOptions)
                    .then((response) => response.json())
                    .then((data) => {
                        setAnswers(data);
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }
        }

    }, [jwtToken, isAdmin]);

    return (
        <>
            {/* <pre>{JSON.stringify(answers, null, 3)}</pre> */}
            <div className="flex justify-between items-center w-full mb-5">
                <h2 className="text-xl sm:text-lg font-bold">Survei</h2>
                { isAdmin ? (
                    <Link to="/surveys/create" className="bg-white hover:bg-gray-50 border p-1.5 rounded-md text-xl text-black shadow-md" title="Buat Survei Baru"><IoAdd className="stroke-w-4" /></Link>
                ) : ("") }
            </div>
            <div className="flex flex-col gap-3">
                {!surveys || surveys.length === 0 ? (
                    <div className="flex flex-col w-full h-64 justify-center items-center text-gray-400">
                        <div className="text-6xl mb-2"><IoDocumentText /></div>
                        <div className="text-2xl font-bold">Belum ada Survey.</div>
                    </div>
                ) : (
                    <>
                    { !isAdmin ? (
                        <>
                        {surveys.map((a) => (
                            <div key={a.id}>
                                {filledSurveyIds.has(a.id) ? (
                                    <div className="border rounded-xl shadow-md p-4">
                                        <div className="flex justify-between items-center gap-3">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-1">
                                                    <h3 className="text-lg font-bold line-clamp-1">{a.title}</h3>
                                                    <div className="text-lg text-green-400"><IoCheckbox title="Jawaban terkirim" /></div>
                                                </div>
                                                <p className="font-light line-clamp-2">{a.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <Link to={`/surveys/${a.id}/fill`}>
                                        <div className="border rounded-xl shadow-md p-4">
                                            <div className="flex justify-between items-center gap-3">
                                                <div className="flex flex-col gap-1">
                                                    <h3 className="text-lg font-bold line-clamp-1">{a.title}</h3>
                                                    <p className="font-light line-clamp-2">{a.description}</p>
                                                </div>
                                                <IoIosArrowForward className="text-xl text-gray-400 stroke-w-2" title="Edit" />
                                            </div>
                                        </div>
                                    </Link>
                                )}
                            </div>
                        ))}
                        </>
                    ) : (
                        <>
                        {surveys.map((a) => (
                        <div key={a.id} className="border rounded-xl shadow-md p-4">
                            <div className="flex justify-between items-center">
                                <Link to={`/surveys/${a.id}`}><h3 className="text-lg font-semibold line-clamp-1">{a.title}</h3></Link>
                                <Link to={`/surveys/${a.id}`}><IoIosArrowForward className="text-xl text-gray-400" title="Edit" /></Link>
                            </div>
                        </div>))}
                        </>
                    ) }
                    </>
                )}
                
            </div>
            
        </>
    );
}

export default Surveys;