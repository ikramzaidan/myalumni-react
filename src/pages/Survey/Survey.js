import SelectInput from "./../../components/SelectInput";
import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaTrash, FaCopy, FaEllipsisVertical } from "react-icons/fa6";
import { useNavigate, useOutletContext } from "react-router-dom";

const Survey = () => {
    const { jwtToken } = useOutletContext();
    const { survey } = useOutletContext();
    const { isAdmin } = useOutletContext();
    const { setQuestionUpdated } = useOutletContext();
    const { setNewQuestion } = useOutletContext();
    const { setAlertMessage } = useOutletContext();

    const [question, setQuestion] = useState({});

    const [questionId, setQuestionId] = useState(null); // State untuk nilai ID Question yang aktif (mode show)
    const [optionId, setOptionId] = useState(null); // State untuk nilai ID Option yang aktif (mode edit)
    const [questionExtId, setQuestionExtId] = useState(null); // State untuk nilai ID question extension yang aktif (mode edit)

    const [questionEditMode, setQuestionEditMode] = useState(false);

    const [errors, setErrors] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {

        if(!isAdmin) {
            navigate("/");
        }

    }, [isAdmin, navigate]);

    const hasError = (key) => {
        return errors.indexOf(key) !== -1;
    }

    const handleQuestionChange = () => (event) => {
        const { name, value } = event.target;
    
        if (name.startsWith('question_extension.')) {
            const key = name.split('.')[1];

            if (key === "followup_question_id") {
                const newValue = value === "" ? 0 : parseInt(value);
                setQuestion(prevState => ({
                    ...prevState,
                    question_extension: {
                        ...prevState.question_extension,
                        [key]: newValue,
                    },
                    extension: value !== ""  // Set extension to false if value is empty, true otherwise
                }));
            } else {
                setQuestion(prevState => ({
                    ...prevState,
                    question_extension: {
                        ...prevState.question_extension,
                        [key]: value,
                    },
                }));
            }

        } else {
            setQuestion(prevState => ({
                ...prevState,
                [name]: value,
            }));
        }
    };

    // Tampilkan question
    const handleQuestionShow = (id) => {
        if (questionId !== id) {
            setQuestionId(id); // Setel id pertanyaan untuk memulai mode edit
            setOptionId(null);
            const foundQuestion = survey.questions.find(q => q.id === id); // Mencari objek questions dengan id di dalam survey.questions
            if (foundQuestion) {
                setQuestion(foundQuestion);
                const questionExtension = foundQuestion.question_extension;
                const optionsArray = foundQuestion.options ? foundQuestion.options.map(option => option.option_text) : [];
                setQuestion({
                    ...foundQuestion,
                    question_extension: {
                        ...questionExtension,
                        question_id: id,
                    },
                    options_array: optionsArray
                });
            }
        } else {
            setQuestionId(null);
            setQuestion({});
        } 
    };

    // Duplikat question
    const handleQuestionDuplicate = (question) => (event) => {
        event.preventDefault();

        if(question.type === "multiple_choice") {
            setNewQuestion({
                form_id: question.form_id,
                question_text: question.question_text,
                type: question.type,
                options_array: question.options.map(option => option.option_text)
            });
        } else {
            setNewQuestion({
                form_id: question.form_id,
                question_text: question.question_text,
                type: question.type,
            });
        }
        
    };

    // Simpan question
    const handleQuestionSave = (idq) => (event) => {
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

        fetch(`https://alumnihub.site/questions/${idq}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    console.log(data.error);
                    setAlertMessage("Terjadi kesalahan. Pertanyaan gagal diperbarui.");
                } else {
                    setQuestionUpdated(true);
                    setAlertMessage("Pertanyaan berhasil diperbarui.");
                }
            })
            .catch(err => {
                console.log(err);
                setAlertMessage("Terjadi kesalahan. Pertanyaan gagal diperbarui.");
            })
    }

    // Simpan question
    const handleQuestionDelete = (idq) => (event) => {
        event.preventDefault();

        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", "Bearer " + jwtToken);

        const requestBody = question;

        const requestOptions = {
            body: JSON.stringify(requestBody),
            method: "DELETE",
            headers: headers,
            credentials: "include",
        }

        fetch(`https://alumnihub.site/questions/${idq}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    console.log(data.error);
                    setAlertMessage("Terjadi kesalahan. Pertanyaan gagal dihapus.");
                } else {
                    setQuestionUpdated(true);
                    setAlertMessage("Pertanyaan berhasil dihapus.");
                }
            })
            .catch(err => {
                console.log(err);
                setAlertMessage("Terjadi kesalahan. Pertanyaan gagal dihapus.");
            })
    }

    const handleQuestionExtension = (id) => {
        if (questionExtId !== id) {
            setQuestionExtId(id); // Setel id pertanyaan untuk memulai mode edit
        } else {
            setQuestionExtId(null);
        } 
    };

    // Tampilkan question
    const handleOptionEdit = (qid, oid) => {
        if (questionId === qid && optionId !== oid) {
            setOptionId(oid); // Setel id opsi untuk memulai mode edit
        } else {
            setOptionId(null);
        } 
    };

    const handleOptionChange = (index, value) => {
        const newChoices = [...question.options_array];
        newChoices[index] = value;

        setQuestion({
            ...question,
            options_array: newChoices
        });
    };

    const handleOptionAdd = () => {
        const newValue = question.options_array.length + 1;
        // Menambahkan elemen kosong baru ke dalam array state
        const newChoices = [...question.options_array, `Opsi ${newValue}`];
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

    const formattedQuestions = (excludeId) => {
        return survey.questions
            .filter(question => question.id !== excludeId && question.type === "multiple_choice")
            .map(question => ({
                value: question.id,
                label: question.question_text
            }));
    };

    const formattedOptions = (questionId) => {
        // Temukan pertanyaan dengan id yang sesuai
        const selectedQuestion = survey.questions.find(q => q.id === questionId);
        
        // Jika pertanyaan ditemukan dan memiliki options, ubah formatnya
        if (selectedQuestion && selectedQuestion.options) {
            return selectedQuestion.options.map(option => ({
                value: option.option_text,
                label: option.option_text
            }));
        }
    
        // Jika tidak ditemukan atau tidak memiliki options, kembalikan array kosong
        return [];
    };

    return(
        <>
            {/* <pre>{JSON.stringify(question, null, 3)}</pre> */}
            {survey.questions && survey.questions.map((q) => (
                <div className="flex flex-col w-full" key={q.id}>
                    {questionId === q.id ? (
                        <div className="flex border rounded-xl shadow-md border-l-4 border-l-gray-400">
                            <div className="flex flex-col w-full p-5">
                                <div className="flex w-full justify-between gap-1">
                                    <div className="flex w-full">
                                        {questionEditMode ? (
                                            <>
                                                <input
                                                    name="question_text" 
                                                    className="w-full text-sm pt-0 px-0 border-0 border-b-2 focus:ring-0"
                                                    value={question.question_text}
                                                    onBlur={() => setQuestionEditMode(false)}
                                                    onChange={handleQuestionChange("question_text")}
                                                ></input>
                                            </>
                                        ) : (
                                            <p className="text-sm" onClick={() => setQuestionEditMode(true)}>{q.question_text}</p>
                                        ) }
                                    </div>
                                    <button type="button" className="text-gray-400 self-start" onClick={() => handleQuestionShow(q.id)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-up"><path d="m18 15-6-6-6 6"/></svg>
                                    </button>
                                </div>
                                {/* <pre>{JSON.stringify(q, null, 3)}</pre> */}
                                {question.type === "multiple_choice" ? (
                                    <div className="flex flex-col mt-5">
                                        {question.options_array && question.options_array.map((option, index) => (
                                            <div className="flex gap-1.5 mb-4 items-center" key={index}>
                                                {optionId === index ? (
                                                    <div className="flex items-center gap-2">
                                                        <div>
                                                            <div className="w-4 h-4 border-2 rounded-full border-gray-400"></div>
                                                        </div>
                                                        <input 
                                                            type="text" 
                                                            value={option} 
                                                            name={`option_${index + 1}`}
                                                            className="w-full text-sm pt-0 pb-1 px-0 border-0 border-b-2 focus:ring-0"
                                                            onChange={(e) => handleOptionChange(index, e.target.value)}
                                                            onBlur={() => setOptionId(null)}
                                                        />
                                                        <button type="button" onClick={() => handleOptionRemove(index)} title="Hapus opsi">
                                                            <IoClose className="text-2xl text-gray-400" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <div onClick={() => handleOptionEdit(q.id, index)}>
                                                            <div className="w-4 h-4 border-2 rounded-full border-gray-400"></div>
                                                        </div>
                                                        <p className="text-sm" onClick={() => handleOptionEdit(q.id, index)}>{option}</p>
                                                    </div>
                                                ) }
                                            </div>
                                        ))}
                                        <div className="flex items-center gap-2">
                                            <div>
                                                <div className="w-4 h-4 border-2 rounded-full border-gray-400"></div>
                                            </div>
                                            <p className="text-sm text-gray-500 underline cursor-pointer" onClick={handleOptionAdd}>Tambahkan opsi baru</p>
                                        </div>
                                    </div>
                                ) : ("")}
                                <div className="border-b border-gray-300 mt-5 mb-3"></div>
                                <div className="flex items-center justify-between">
                                    <div className="flex w-full">
                                        <SelectInput
                                            name="type"
                                            className="w-36 text-sm mb-1.5 self-center px-2 py-2 border border-gray-300 rounded-md focus:ring-0 focus:border-gray-400"
                                            defaultValue={question.type}
                                            options={ [{value: "short_answer", label: "Jawaban Singkat"}, {value: "multiple_choice", label: "Pilihan Ganda"}] }
                                            onChange={handleQuestionChange("type")}
                                            placeHolder={"Pilih tipe pertanyaan"}
                                            marginBottom="mb-0"
                                        />
                                    </div>
                                    <div className="flex gap-1.5">
                                    <button type="button" className="w-full aspect-square p-1.5 text-base rounded-md hover:bg-gray-300 text-gray-500" onClick={() => handleQuestionExtension(q.id)}  title="Lainnya"><FaEllipsisVertical /></button>
                                        <button type="button" className="w-full aspect-square p-1.5 text-base rounded-md hover:bg-gray-300 text-gray-500" onClick={handleQuestionDelete(q.id)} title="Hapus"><FaTrash /></button>
                                        <button type="button" className="w-full aspect-square p-1.5 text-base rounded-md hover:bg-gray-300 text-gray-500" onClick={handleQuestionDuplicate(q)} title="Duplikat"><FaCopy /></button>
                                        <button className="text-xs font-semibold py-2 px-3 bg-black hover:bg-gray-500 text-white rounded-md" onClick={handleQuestionSave(q.id)}>Simpan</button>
                                    </div>
                                </div>
                                {questionExtId === q.id ? (
                                    <>
                                        <div className="border-b border-gray-300 mt-3 mb-3"></div>
                                        <div className="flex flex-col">
                                            <SelectInput
                                                title="Pertanyaan lanjutan dari:"
                                                titleClassName="text-gray-500 text-xs font-semibold mb-2"
                                                name="question_extension.followup_question_id"
                                                className="w-full text-sm mb-1.5 px-2 py-2 border border-gray-300 rounded-md focus:ring-0 focus:border-gray-400"
                                                options={ formattedQuestions(q.id) }
                                                defaultValue={q.extension ? q.question_extension.followup_question_id : 0}
                                                onChange={handleQuestionChange()}
                                                placeHolder={"Tidak ada"}
                                            />
                                            {question.question_extension.followup_question_id ? (
                                                <SelectInput
                                                    title="Jawaban:"
                                                    titleClassName="text-gray-500 text-xs font-semibold mb-2"
                                                    name="question_extension.followup_option_value"
                                                    className="w-full text-sm mb-1.5 px-2 py-2 border border-gray-300 rounded-md focus:ring-0 focus:border-gray-400"
                                                    options={ formattedOptions(question.question_extension.followup_question_id) }
                                                    defaultValue={q.extension ? q.question_extension.followup_option_value : ""}
                                                    onChange={handleQuestionChange()}
                                                    placeHolder={"Pilih Jawaban"}
                                                />
                                            ) : ("")}
                                        </div> 
                                    </>
                                ) : ("")}
                            </div>
                        </div>
                    ) : (
                        <button type="button" className={`flex border rounded-xl shadow-md ${questionId === q.id ? "border-l-4 border-l-red-400" : ""}`} onClick={() => handleQuestionShow(q.id)}>
                            <div className="flex flex-col w-full text-left p-5">
                                <p className="text-sm">{q.question_text}</p>
                            </div>
                        </button>
                    )}
                </div>
            ))}
        </>
    );
}

export default Survey;