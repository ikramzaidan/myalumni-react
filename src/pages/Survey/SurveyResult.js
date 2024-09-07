import { useEffect, useState } from "react";
import { Link, useNavigate, useOutletContext, useParams } from "react-router-dom";

const SurveyResult = () => {
    let { id } = useParams();
    const { jwtToken } = useOutletContext();
    const { isAdmin } = useOutletContext();
    const [survey, setSurvey] = useState([]);
    const [focusQuestionId, setFocusQuestionId] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        if(!isAdmin) {
            navigate("/");
        }
    }, [isAdmin, navigate]);

    useEffect(() => {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", "Bearer " + jwtToken);

        const requestOptions = {
            method: "GET",
            headers: headers,
        }

        fetch(`https://alumnihub.site/forms/${id}/answers`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setSurvey(data);
            })
            .catch(err => {
                console.log(err);
            })

    }, [id, jwtToken]);

    const handleFocusQuestion = (id) => {
        if (focusQuestionId !== id) {
            setFocusQuestionId(id); // Setel id pertanyaan untuk memulai mode edit
        }   
    };

    return (
        <>
            {/* <pre>{JSON.stringify(survey.questions, null, 3)}</pre> */}
            {survey && survey.questions && survey.questions.map((q) => (
                <div className={`flex border rounded-xl shadow-md ${focusQuestionId === q.id ? "border-l-4 border-l-blue-400" : ""}`} key={q.id} onClick={() => handleFocusQuestion(q.id)}>
                    <div className="flex flex-col w-full text-left p-5">
                        <div className="flex w-full justify-between mb-3">
                            <p className="text-sm">{q.question_text}</p>
                        </div>
                        <div className="flex flex-col mb-3">
                            {q.answers_group && q.answers_group.map((answer, index) => (
                                <div className="flex justify-between mb-2 py-2 px-3 text-sm bg-gray-200 rounded" key={index}>
                                    <div className="font-medium">{answer.answer_text}</div>
                                    <div className="font-light">{answer.answer_count} Jawaban</div>
                                </div>
                            ))}
                        </div>
                        <Link to={`/surveys/${id}/question/${q.id}/result`} className="text-sm underline hover:text-gray-500">Lihat seluruh jawaban</Link>
                    </div>
                </div>
            ))}
        </>
    );
}

export default SurveyResult;