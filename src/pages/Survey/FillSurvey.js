import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";

const FillSurvey = () => {
    let { id } = useParams();
    const { jwtToken } = useOutletContext();
    const { isAdmin } = useOutletContext();
    const { setAlertMessage } = useOutletContext();
    const decodedJwt = jwtDecode(jwtToken);
    const [survey, setSurvey] = useState({});
    const [answers, setAnswers] = useState([]);
    const [focusQuestionId, setFocusQuestionId] = useState(null);
    const [countQuestions, setCountQuestions] = useState(0);
    const [countDisabledQuestions, setCountDisabledQuestions] = useState(0);
    const [isError, setIsError] = useState(false);
    const [submitPending, setSubmitPending] = useState(false);

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

        fetch(`https://alumnihub.site/forms/${id}/show`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                // Set survey data
                setSurvey(data);

                if (data.questions) {
                    // Modify questions to add 'disabled' key
                    const modifiedQuestions = data.questions.map(question => ({
                        ...question,
                        disabled: false
                    }));

                    // Set the modified questions back to survey state
                    setSurvey(prevSurvey => ({
                        ...prevSurvey,
                        questions: modifiedQuestions
                    }));
                }

                // Set question count
                const questionCount = data.questions ? data.questions.length : 0;
                setCountQuestions(questionCount);
            })
            .catch(err => {
                console.log(err);
            })

    }, [id, jwtToken]);

    useEffect(() => {
        setCountDisabledQuestions(survey.questions ? survey.questions.filter(question => question.disabled).length : 0);
    }, [survey.questions]);

    // Fill Survey
    const handleChange = () => (event) => {
        const { name, value } = event.target;
        const questionId = parseInt(name.replace("answer_", ""));

        setAnswers((prevAnswers) => {
            const existingAnswerIndex = prevAnswers.findIndex(answer => answer.question_id === questionId);
    
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

        // Update status disabled pertanyaan jika diperlukan
        const updatedQuestions = survey.questions.map(q => {
            const isDisabled = q.extension && q.question_extension && q.question_extension.followup_question_id === questionId && q.question_extension.followup_option_value !== value;

            if (isDisabled) {
                setAnswers((prevAnswers) => prevAnswers.filter(answer => answer.question_id !== q.id));
                return { ...q, disabled: true };
            }
            return { ...q, disabled: false };
        });

        // Update survey state dengan pertanyaan yang sudah dimodifikasi
        setSurvey(prevSurvey => ({
            ...prevSurvey,
            questions: updatedQuestions
        }));
    }

    // Submit Survey
    const handleSubmit = (event) => {
        event.preventDefault();

        setSubmitPending(true);

        const requiredQuestions = countQuestions - countDisabledQuestions;
        if (requiredQuestions !== answers.length) {
            setIsError(true);
        } else {
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

            fetch(`https://alumnihub.site/forms/${id}/submit`, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    if (data.error) {
                        setAlertMessage(`Terjadi kesalahan: ${data.error}`);
                        setSubmitPending(false);
                    } else {
                        navigate(`/surveys`);
                        setSubmitPending(false);
                    }
                })
                .catch(err => {
                    setAlertMessage(`Terjadi kesalahan: ${err}`);
                    setSubmitPending(false);
                })
        }
    }

    return (
        <>  
            {/* <pre>{JSON.stringify(survey, null, 3)}</pre> */}
            {/* <pre>{JSON.stringify(answers, null, 3)}</pre> */}
            {/* <pre>Disabled questions count: {countDisabledQuestions}</pre> */}
            {survey.questions && survey.questions.map((q) => (              
                <div key={q.id}>
                    {!q.disabled ? (
                        <div className={`flex border rounded-xl shadow-md ${focusQuestionId === q.id ? "border-l-4 border-l-red-400" : ""}`} onClick={() => handleFocusQuestion(q.id)}>
                            <div className="flex flex-col w-full text-left p-5">
                                <div className="flex w-full justify-between">
                                    <p className="text-sm">{q.question_text}</p>
                                </div>
                                {q.type === "multiple_choice" ? (
                                <div className="flex flex-col mt-3">
                                    {q.options && q.options.map((option, index) => (
                                        <div className="flex mb-2 items-center" key={index}>
                                            <input id={`option_${option.id}`} type="radio" value={option.option_text} name={`answer_${q.id}`} className="w-4 h-4 text-blue-500 bg-gray-100 border-gray-300" onChange={handleChange()} />
                                            <label htmlFor={`option_${option.id}`} className="ms-2">{option.option_text}</label>
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
                    ) : (
                        <div className={`flex border rounded-xl bg-gray-100 shadow-md opacity-80`}>
                            <div className="flex flex-col w-full text-left p-5">
                                <div className="flex w-full justify-between">
                                    <p className="text-sm">{q.question_text}</p>
                                </div>
                                {q.type === "multiple_choice" ? (
                                <div className="flex flex-col mt-3">
                                    {q.options && q.options.map((option, index) => (
                                        <div className="flex mb-2 items-center" key={index}>
                                            <input id={`option_${option.id}`} type="radio" value={option.option_text} name={`answer_${q.id}`} className="w-4 h-4 text-blue-500 bg-gray-100 border-gray-300" onChange={handleChange} checked={answers.some(answer => answer.question_id === q.id && answer.answer_text === option.option_text) && !q.disabled} disabled={true} />
                                            <label htmlFor={`option_${option.id}`} className="ms-2">{option.option_text}</label>
                                        </div>
                                    ))}
                                </div>
                                ) : (
                                    <div className="flex flex-col w-full mt-3">
                                        <input type="text" name={`answer_${q.id}`} className="bg-gray-100 border-0 border-b-2 border-gray-300 focus:ring-0" placeholder="Jawaban" onChange={handleChange()} value={answers.find(answer => answer.question_id === q.id)?.answer_text ?? ""} disabled={true} />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                
            ))}
            <div className="flex justify-between">
                <button onClick={handleSubmit} disabled={isAdmin ? (true) : (false) } className={`py-2 px-3 bg-red-500 ${isAdmin ? "cursor-not-allowed" : "hover:bg-red-400" } rounded-md text-white`}>Kirim Jawaban</button>
            </div>
            <p className={"text-xs " + (!isAdmin ? "hidden" : "")}>{isAdmin ? "Anda dalam mode pratinjau." : "" }</p>
            <p className="text-sm text-red-500">{isError ? "Kamu belum mengisi seluruh pertanyaan." : "" }</p>
        </>
    );
}

export default FillSurvey;