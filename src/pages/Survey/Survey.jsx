import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import AddQuestion from "../../components/AddQuestion";
import Input from "../../components/Input";
import { FaCircleMinus, FaCirclePlus } from "react-icons/fa6";

const Survey = () => {
    let { id } = useParams();
    const { jwtToken } = useOutletContext();
    const { setOpenModal } = useOutletContext();
    const [survey, setSurvey] = useState([]);
    const [question, setQuestion] = useState([]);
    const [editSurvey, setEditSurvey] = useState(false); // State untuk mode edit survei
    const [editQuestion, setEditQuestion] = useState(false); // State untuk mode edit question
    const [updateQuestion, setUpdateQuestion] = useState(false); // State ketika berhasil update question
    const [addQuestion, setAddQuestion] = useState(false);
    const [showQuestionId, setShowQuestionId] = useState(null);

    const [errors, setErrors] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", "Bearer " + jwtToken);

        const requestOptions = {
            method: "GET",
            headers: headers,
        }

        fetch(`http://localhost:8080/forms/${id}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setSurvey(data);
                setUpdateQuestion(false);
            })
            .catch(err => {
                console.log(err);
            })

    }, [id, jwtToken, addQuestion, updateQuestion]);

    const handleQuestionButton = () => {
        setAddQuestion((prev) => !prev);
    };

    const handleShowQuestion = (id) => {
        if (showQuestionId !== id) {
            setShowQuestionId(id); // Setel id pertanyaan untuk memulai mode edit
            setEditQuestion(false);

            // Fetch data pertanyaan hanya jika tipe pertanyaan adalah "multiple_choice"
            setQuestion([]);

            const question = survey.questions.find(q => q.id === id);
            if (question) {
                const headers = new Headers();
                headers.append("Content-Type", "application/json");
                headers.append("Authorization", "Bearer " + jwtToken);

                const requestOptions = {
                    method: "GET",
                    headers: headers,
                }
                fetch(`http://localhost:8080/questions/${id}`, requestOptions)
                    .then(response => response.json())
                    .then(data => {
                        // Memperbarui state untuk menyimpan opsi pertanyaan dalam
                        if (!data.options) {
                            setQuestion(data);
                        } else {
                            const optionsArray = data.options.map(option => option.option_text);
                            setQuestion({
                                ...data,
                                options_array: optionsArray
                            });
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching question options:', error);
                    });
            }
        }
        
    };

    const handleCloseShowQuestion = (id) => {
        if (showQuestionId === id) {
            setShowQuestionId(null);
        }
    }

    const handleQuestionFormSubmit = () => {
        setAddQuestion(false);
    };

    if (survey.questions) {
        survey.questions = Object.values(survey.questions);
    } else {
        survey.questions = [];
    }

    // Edit Survey
    const handleChange = () => (event) => {
        const { name, value } = event.target;
        let formattedValue = value;

        setSurvey({
            ...survey,
            [name]: formattedValue,
        })
    }

    const hasError = (key) => {
        return errors.indexOf(key) !== -1;
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        let errors = [];
        let required = [
            { field: survey.title, name: "title"},
            { field: survey.description, name: "description"},
            // { field: survey.has_time_limit, name: "has_time_limit"},
            // { field: survey.start_date, name: "start_date"},
            // { field: survey.end_date, name: "end_date"},
        ]

        required.forEach(function (obj) {
            if (obj.field === "") {
                errors.push(obj.name);
            }
        })

        setErrors(errors);

        if (errors.length > 0) {
            return false;
        }

        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", "Bearer " + jwtToken);

        const requestBody = survey;

        const requestOptions = {
            body: JSON.stringify(requestBody),
            method: "PATCH",
            headers: headers,
            credentials: "include",
        }

        fetch(`http://localhost:8080/forms/${id}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    console.log(data.error);
                } else {
                    navigate(`/surveys/${id}`);
                }
            })
            .catch(err => {
                console.log(err);
            })
    }

    // Edit Question dan Options
    const handleEditSurvey = () => {
        setEditSurvey((prev) => !prev);
    };

    const handleEditQuestion = () => {
        setEditQuestion((prev) => !prev);
    };

    const handleQuestionChange = () => (event) => {
        const { name, value } = event.target;
        let formattedValue = value;

        setQuestion({
            ...question,
            [name]: formattedValue,
        })
    }

    const handleOptionChange = (index, value) => {
        const newChoices = [...question.options_array];
        newChoices[index] = value;

        setQuestion({
            ...question,
            options_array: newChoices
        });
    };

    const handleOptionAdd = () => {
        // Menambahkan elemen kosong baru ke dalam array state
        const newChoices = [...question.options_array, ''];
        setQuestion({
            ...question,
            options_array: newChoices
        });
    };

    const handleOptionRemove = (index) => {
        // Pastikan ada minimal satu pilihan sebelum menghapus
        if (question.options_array.length > 1) {
            // Menghapus elemen terakhir dari array choices
            const newChoices = question.options_array.filter((_, idx) => idx !== index);

            // Jika Anda juga ingin mengubah state question untuk mengikuti perubahan choices, Anda dapat melakukannya di sini
            setQuestion({
                ...question,
                options_array: newChoices
            });
        } else {
            console.log("Pilihan yang disediakan tidak boleh kurang dari satu.");
        }
    }

    const handleSubmitQuestionEdit = (idq) => (event) => {
        event.preventDefault();

        let errors = [];
        let required = [
            { field: question.question_text, name: "question_text"},
        ]

        required.forEach(function (obj) {
            if (obj.field === "") {
                errors.push(obj.name);
            }
        })

        setErrors(errors);

        if (errors.length > 0) {
            return false;
        }

        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", "Bearer " + jwtToken);

        const requestBody = question;

        const requestOptions = {
            body: JSON.stringify(requestBody),
            method: "PATCH",
            headers: headers,
            credentials: "include",
        }

        fetch(`http://localhost:8080/questions/${idq}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    console.log(data.error);
                } else {
                    setUpdateQuestion(true);
                }
            })
            .catch(err => {
                console.log(err);
            })
    }

    const handleShowModal = () => {
        setOpenModal(true);
    }

    return (
        <>
            <div className="flex justify-between items-center w-full mb-5">
                <h2 className="text-lg font-bold">Surveys</h2>
                <div className="flex gap-1.5">
                    <button onClick={handleEditSurvey} className="flex items-center bg-white hover:bg-gray-50 border-2 py-2 px-2 rounded-md text-xs font-semibold text-black">{editSurvey ? "Turn Editing Off" : "Turn Editing On"}</button>
                    <button onClick={handleShowModal} className="flex items-center bg-red-700 hover:bg-red-800 py-2 px-2 rounded-md text-xs font-semibold text-white">Delete</button>
                    <button onClick={handleQuestionButton} className="flex items-center bg-black hover:bg-gray-800 py-2 px-2 rounded-md text-xs font-semibold text-white">Add Question</button>
                </div>
            </div>
            <div className="flex flex-col gap-4">
                <div className="border rounded-xl shadow-md">
                    <div className="w-full rounded-t-xl bg-blue-400 p-5"></div>
                    <div className="flex flex-col p-5">
                        {/* <pre>{JSON.stringify(survey, null, 3)}</pre> */}
                        {editSurvey ? (
                            <form onSubmit={handleSubmit} className="flex flex-col">
                                <Input 
                                    type="text" 
                                    name="title" 
                                    className="text-xl font-bold mt-10 mb-2 px-0 border-0 border-b-2 focus:ring-0" 
                                    value={ survey.title } 
                                    onChange={handleChange("title")}
                                    errorMsg={hasError("title") ? "Please enter a title" : ""}
                                />
                                <textarea 
                                    name="description"
                                    className="text-sm px-0 border-0 border-b-2 focus:ring-0"
                                    value={survey.description}
                                    onChange={handleChange("description")}
                                ></textarea>
                            </form>
                        ) : (
                            <>
                                <h3 className="text-xl font-bold mt-10 mb-2 px-0">{ survey.title }</h3>
                                <p className="text-sm px-0">{survey.description}</p>
                            </>
                        ) }
                        
                    </div>
                </div>
                <AddQuestion className={addQuestion ? "" : "hidden"} value={id} onSuccess={handleQuestionFormSubmit} />
                {survey.questions.map((q) => (
                    <div className="flex flex-col w-full" key={q.id}>
                        {showQuestionId === q.id ? (
                            <div className="flex border rounded-xl shadow-md border-l-4 border-l-blue-400">
                                <div className="flex flex-col w-full p-5">
                                    <div className="flex w-full justify-between">
                                        <div className="flex flex-col w-full">
                                            {/* <pre>{JSON.stringify(question, null, 3)}</pre> */}
                                            {editQuestion ? (
                                                <input
                                                    name="question_text" 
                                                    className="w-full text-sm pt-0 px-0 border-0 border-b-2 focus:ring-0"
                                                    value={question.question_text}
                                                    onBlur={handleEditQuestion}
                                                    onChange={handleQuestionChange("question_text")}
                                                ></input>
                                            ) : (
                                                <p className="text-sm" onClick={handleEditQuestion}>{q.question_text}</p>
                                            ) }
                                        </div>
                                        <button type="button" className="text-gray-400 self-start" onClick={() => handleCloseShowQuestion(q.id)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-up"><path d="m18 15-6-6-6 6"/></svg>
                                        </button>
                                    </div>
                                    
                                    {question.type === "multiple_choice" ? (
                                        <div className="flex flex-col mt-3">
                                            {question.options_array && question.options_array.map((option, index) => (
                                                <div className="flex gap-1.5 mb-4 items-center" key={index}>
                                                    <div onClick={() => handleOptionRemove(index)}>
                                                        <FaCircleMinus className="text-xl text-red-500" />
                                                    </div>
                                                    <input 
                                                        type="text" 
                                                        value={option} 
                                                        name={`option_${index + 1}`}
                                                        className="text-sm pt-0 pb-1 px-0 border-0 border-b-2 focus:ring-0"
                                                        onChange={(e) => handleOptionChange(index, e.target.value)}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    ) : ("")}

                                    <div className={`flex items-center ${q.type === "multiple_choice" ? "justify-between" : "justify-start mt-5"}`}>
                                        {q.type === "multiple_choice" ? (
                                            <div onClick={handleOptionAdd}>
                                                <FaCirclePlus className="text-xl text-gray-500" />
                                            </div>
                                        ) : ("")}
                                        <button className="text-xs font-semibold py-2 px-3 bg-gray-500 text-white rounded-md" onClick={handleSubmitQuestionEdit(q.id)}>Simpan</button>
                                    </div> 
                                </div>
                            </div>
                        ) : (
                            <button type="button" className={`flex border rounded-xl shadow-md ${showQuestionId === q.id ? "border-l-4 border-l-blue-400" : ""}`} onClick={() => handleShowQuestion(q.id)}>
                                <div className="flex flex-col w-full text-left p-5">
                                    <p className="text-sm" onClick={handleEditQuestion}>{q.question_text}</p>
                                </div>
                            </button>
                        )}
                    </div>
                ))}
            </div>
            
        </>
    );
}

export default Survey;