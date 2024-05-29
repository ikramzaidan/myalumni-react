import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";

const SurveyResult = () => {
    let { id } = useParams();
    const { jwtToken } = useOutletContext();
    const [survey, setSurvey] = useState([]);
    const [focusQuestionId, setFocusQuestionId] = useState(null);

    const handleFocusQuestion = (id) => {
        if (focusQuestionId !== id) {
            setFocusQuestionId(id); // Setel id pertanyaan untuk memulai mode edit
        }   
    };

    useEffect(() => {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", "Bearer " + jwtToken);

        const requestOptions = {
            method: "GET",
            headers: headers,
        }

        fetch(`http://localhost:8080/forms/${id}/answers`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setSurvey(data);
            })
            .catch(err => {
                console.log(err);
            })

    }, [id, jwtToken]);

    return (
        <>
            <div className="flex justify-between items-center w-full mb-5">
                <h2 className="text-lg font-bold">Surveys</h2>
            </div>
            <div className="flex flex-col gap-4">
                <div className="border rounded-xl shadow-md">
                    <div className="w-full rounded-t-xl bg-blue-400 p-5"></div>
                    <div className="flex flex-col p-5">
                        {/* <pre>{JSON.stringify(survey, null, 3)}</pre> */}
                        <h3 className="text-xl font-bold mt-10 mb-2 px-0">{ survey.title }</h3>
                        <p className="text-sm px-0">{survey.description}</p>
                    </div>
                </div>
                {survey && survey.questions && survey.questions.map((q) => (
                    <div className={`flex border rounded-xl shadow-md ${focusQuestionId === q.id ? "border-l-4 border-l-blue-400" : ""}`} key={q.id} onClick={() => handleFocusQuestion(q.id)}>
                        <div className="flex flex-col w-full text-left p-5">
                            <div className="flex w-full justify-between">
                                <p className="text-sm">{q.question_text}</p>
                            </div>
                            <div className="flex flex-col mt-3">
                                {q.answers && q.answers.map((answer) => (
                                    <div className="flex mb-2 py-2 px-3 text-sm bg-gray-200 rounded" key={answer.id}>
                                        {answer.answer_text}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default SurveyResult;