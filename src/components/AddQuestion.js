import { useState } from "react";
import TextArea from "./TextArea";
import Select from "./Select";
import { useOutletContext } from "react-router-dom";
import { IoIosAddCircleOutline } from "react-icons/io";
import { IoIosRemoveCircleOutline } from "react-icons/io";

const AddQuestion = (props) => {
    const { jwtToken } = useOutletContext();
    const [errors, setErrors] = useState([]);
    const [choices, setChoices] = useState(['']); 

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

        fetch('http://localhost:8080/questions/create', requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    console.log(data.error);
                } else {
                    props.onSuccess();
                    setQuestion({
                        form_id: parseInt(props.value, 10),
                        question_text: "",
                        type: "",
                    });
                    setChoices(['']);
                }
            })
            .catch(err => {
                console.log(err);
            })
    }

    const handleAddChoice = () => {
        setChoices([...choices, '']); // Menambahkan elemen kosong baru ke dalam array state
    };

    const handleRemoveChoice = () => {
        // Pastikan ada minimal satu pilihan sebelum menghapus
        if (choices.length > 1) {
            // Menghapus elemen terakhir dari array choices
            const newChoices = choices.slice(0, -1);
            
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
        <div className={"flex flex-col border rounded-xl shadow-md p-5 " + props.className}>
            <pre>{JSON.stringify(question, null, 3)}</pre>
            <form onSubmit={handleSubmit}>
                <TextArea
                    title="Pertanyaan"
                    name="question_text"
                    placeHolder="Untitled Question"
                    value={question.question_text}
                    onChange={handleChange("question_text")}
                    errorMsg={hasError("question_text") ? "Please enter a question" : ""}
                    rows="2"
                />
                <Select 
                    title="Tipe"
                    name="type"
                    className="w-full px-2 py-2 border border-gray-300 rounded-md"
                    value={question.type}
                    options={ [{id: "short_answer", value: "Jawaban Singkat"}, {id: "multiple_choice", value: "Pilihan Ganda"}, {id: "checkbox", value: "Kotak Centang"} ] }
                    onChange={handleChange("type")}
                    placeHolder={"Pilih tipe soal"}
                    errorMsg={hasError("type") ? "Please select a type" : ""}
                />
                {question.type === "multiple_choice" && (
                    <>
                        <div className="mb-2">Opsi</div>
                        {choices.map((choice, index) => (
                            <div key={index} className="choices flex w-full gap-1.5 mb-3">
                            <input
                                type="text"
                                name={`option_${index + 1}`}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                placeholder={`Opsi ${index + 1}`}
                                value={choice}
                                onChange={(e) => handleChoicesChange(index, e.target.value)}
                                required
                            />
                            </div>
                        ))}
                        <div className="flex w-full">
                            <button type="button" onClick={handleAddChoice}>
                                <IoIosAddCircleOutline className="text-2xl text-black" />
                            </button>
                            <button type="button" onClick={handleRemoveChoice}>
                                <IoIosRemoveCircleOutline className="text-2xl text-black" />
                            </button>
                        </div>
                    </>
                )}
                <button className="w-full py-2 bg-black hover:bg-gray-800 rounded-lg text-center text-white text-sm font-semibold mt-5">Simpan</button>
            </form>
        </div>
    );
}

export default AddQuestion;