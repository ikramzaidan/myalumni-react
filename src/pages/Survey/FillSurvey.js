import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";

const FillSurvey = () => {
    let { id } = useParams();
    const { jwtToken } = useOutletContext();
    const [survey, setSurvey] = useState([]);
    const [answers, setAnswers] = useState([]);
    const decodedJwt = jwtDecode(jwtToken);
    const [focusQuestionId, setFocusQuestionId] = useState(null);

    const navigate = useNavigate();

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

        fetch(`http://localhost:8080/forms/${id}/show`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setSurvey(data);
            })
            .catch(err => {
                console.log(err);
            })

    }, [id, jwtToken]);

    if (survey.questions) {
        survey.questions = Object.values(survey.questions);
    } else {
        survey.questions = [];
    }

    // Fill Survey
    const handleChange = () => (event) => {
        const { name, value } = event.target;

        setAnswers((prevAnswers) => {
            const existingAnswerIndex = prevAnswers.findIndex(answer => answer.question_id === parseInt(name.replace("answer_", "")));
    
            if (existingAnswerIndex !== -1) {
                // Jika sudah ada jawaban untuk pertanyaan dengan id yang sama, update nilai jawabannya
                return prevAnswers.map((answer, index) => {
                    if (index === existingAnswerIndex) {
                        return { ...answer, answer_text: value };
                    }
                    return answer;
                });
            } else {
                // Jika belum ada jawaban untuk pertanyaan dengan id yang sama, tambahkan jawaban baru
                return [
                    ...prevAnswers,
                    {
                        user_id: parseInt(decodedJwt.sub),
                        form_id: survey.id,
                        question_id: parseInt(name.replace("answer_", "")),
                        answer_text: value,
                    }
                ];
            }
        });
    }

    // Submit Survey
    const handleSubmit = (event) => {
        event.preventDefault();

        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", "Bearer " + jwtToken);

        const requestBody = answers;

        const requestOptions = {
            body: JSON.stringify(requestBody),
            method: "POST",
            headers: headers,
            credentials: "include",
        }

        fetch(`http://localhost:8080/forms/${id}/submit`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    console.log(data.error);
                } else {
                    navigate(`/surveys`);
                }
            })
            .catch(err => {
                console.log(err);
            })
    }

    return (
        <>
            <div className="flex justify-between items-center w-full mb-5">
                <h2 className="text-lg font-bold">Surveys</h2>
            </div>
            <div className="flex flex-col gap-4">
                <div className="border rounded-xl shadow-md">
                    <div className="w-full rounded-t-xl bg-blue-400 p-5"></div>
                    <div className="flex flex-col p-5">
                        <pre>{JSON.stringify(answers, null, 3)}</pre>
                        <h3 className="text-xl font-bold mt-10 mb-2 px-0">{ survey.title }</h3>
                        <p className="text-sm px-0">{survey.description}</p>
                    </div>
                </div>
                {survey.questions.map((q) => (
                    <div className={`flex border rounded-xl shadow-md ${focusQuestionId === q.id ? "border-l-4 border-l-blue-400" : ""}`} key={q.id} onClick={() => handleFocusQuestion(q.id)}>
                        <div className="flex flex-col w-full text-left p-5">
                            <div className="flex w-full justify-between">
                                <p className="text-sm">{q.question_text}</p>
                            </div>
                            {q.type === "multiple_choice" ? (
                            <div className="flex flex-col mt-3">
                                {q.options && q.options.map((option, index) => (
                                    <div className="flex mb-2 items-center" key={index}>
                                        <input id={`option_${index}`} type="radio" value={option.option_text} name={`answer_${q.id}`} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300" onChange={handleChange()} />
                                        <label htmlFor={`option_${index}`} className="ms-2">{option.option_text}</label>

                                    </div>
                                ))}
                            </div>
                            ) : (
                                <div className="flex flex-col w-full mt-3">
                                    <input type="text" name={`answer_${q.id}`} className="bg-white border-0 border-b-2 border-gray-300 focus:ring-0" placeholder="Jawaban" onChange={handleChange()} />
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                <div className="flex justify-between">
                    <button onClick={handleSubmit} className="py-2 px-3 bg-blue-400 rounded-md text-white">Kirim Jawaban</button>
                </div>
            </div>
        </>
    );
}

export default FillSurvey;