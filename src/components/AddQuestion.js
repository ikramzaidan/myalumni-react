import { useState } from "react";
import TextArea from "./TextArea";
import SelectInput from "./SelectInput";
import { useOutletContext } from "react-router-dom";
import { IoClose } from "react-icons/io5";

const AddQuestion = (props) => {
    const { jwtToken } = useOutletContext();
    const { setAlertMessage } = useOutletContext();

    const [errors, setErrors] = useState([]);
    const [choices, setChoices] = useState(['']); 
    const [submitPending, setSubmitPending] = useState(false);

    const [question, setQuestion] = useState({
        form_id: parseInt(props.value, 10),
        question_text: "",
        type: "",
        options_array: choices
    });

    const handleChange = () => (event) => {
        const { name, value } = event.target;

        setQuestion({
            ...question,
            [name]: value,
        })
    }

    const hasError = (key) => {
        return errors.indexOf(key) !== -1;
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        setSubmitPending(true);

        let errors = [];
        let required = [
            { field: question.question_text, name: "question_text"},
            { field: question.type, name: "type"},
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
            method: "POST",
            headers: headers,
            credentials: "include",
        }

        fetch(`https://alumnihub.site/questions/create`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    console.log(data.error);
                    setAlertMessage(`Terjadi kesalahan: ${data.error}`);
                    setSubmitPending(false);
                } else {
                    props.onSuccess();
                    setQuestion({
                        form_id: parseInt(props.value, 10),
                        question_text: "",
                        type: "",
                    });
                    setChoices(['']);
                    setAlertMessage("Pertanyaan berhasil ditambahkan.");
                    setSubmitPending(false);
                }
            })
            .catch(err => {
                console.log(err);
                setAlertMessage(`Terjadi kesalahan: ${err}`);
                setSubmitPending(false);
            })
    }

    const handleAddChoice = () => {
        setChoices([...choices, '']); // Menambahkan elemen kosong baru ke dalam array state
    };

    const handleRemoveChoice = (index) => {
        // Pastikan ada minimal satu pilihan sebelum menghapus
        if (choices.length > 1) {
            // Menghapus elemen terakhir dari array choices
            const newChoices = choices.filter((_, idx) => idx !== index);
            
            // Mengatur state choices dengan array baru yang telah dihapus elemen terakhirnya
            setChoices(newChoices);

            // Jika Anda juga ingin mengubah state question untuk mengikuti perubahan choices, Anda dapat melakukannya di sini
            setQuestion({
                ...question,
                options_array: newChoices
            });
        } else {
            console.log("Pilihan yang disediakan tidak boleh kurang dari satu.");
        }
    }

    const handleChoicesChange = (index, value) => {
        const newChoices = [...choices];
        newChoices[index] = value;
        setChoices(newChoices);

        setQuestion({
            ...question,
            options_array: newChoices
        });
    };

    return (
        <div className={"flex flex-col border rounded-xl shadow-md p-5 border-l-4 border-l-gray-400 " + props.className}>
            {/* <pre>{JSON.stringify(question, null, 3)}</pre> */}

                <TextArea
                    name="question_text"
                    className="w-full text-sm pt-0 pb-1 px-0 border-0 border-b-2 focus:ring-0 rounded-none resize-none"
                    placeHolder="Kamu ingin pertanyaan apa?"
                    value={question.question_text}
                    onChange={handleChange("question_text")}
                    rows="2"
                />
                
                {question.type === "multiple_choice" && (
                    <>
                        {choices.map((choice, index) => (
                            <div className="flex items-center gap-2 mt-3" key={index}>
                                <div>
                                    <div className="w-4 h-4 border-2 rounded-full border-gray-400"></div>
                                </div>
                                <input
                                    type="text"
                                    name={`option_${index + 1}`}
                                    className="w-44 text-sm pt-0 pb-1 px-0 border-0 border-b-2 border-gray-300 focus:ring-0"
                                    placeholder={`Opsi ${index + 1}`}
                                    value={choice}
                                    onChange={(e) => handleChoicesChange(index, e.target.value)}
                                    required
                                />
                                <button type="button" onClick={() => handleRemoveChoice(index)} title="Hapus opsi">
                                    <IoClose className="text-2xl text-gray-400" />
                                </button>
                            </div>
                        ))}
                        <div className="flex items-center gap-2 mt-3">
                            <div>
                                <div className="w-4 h-4 border-2 rounded-full border-gray-400"></div>
                            </div>
                            <p className="text-sm text-gray-500 underline cursor-pointer" onClick={handleAddChoice}>Tambahkan opsi baru</p>
                        </div>
                        <div className="border-b border-gray-300 mt-5 mb-3"></div>
                    </>
                )}
                <div className="flex gap-2 justify-between items-center">
                    <SelectInput
                        name="type"
                        className="w-36 text-sm self-center px-2 py-2 border border-gray-300 rounded-md focus:ring-0 focus:border-gray-400"
                        value={question.type}
                        options={ [{value: "short_answer", label: "Jawaban Singkat"}, {value: "multiple_choice", label: "Pilihan Ganda"}] }
                        onChange={handleChange("type")}
                        placeHolder={"Pilih tipe soal"}
                        marginBottom="mb-0"
                    />
                    <button className={`${submitPending ? "animate-pulse cursor-not-allowed" : ""} text-xs font-semibold py-2 px-3 bg-black hover:bg-gray-500 text-white rounded-md`} onClick={handleSubmit} disabled={submitPending}>Simpan</button>
                </div>
                
        </div>
    );
}

export default AddQuestion;