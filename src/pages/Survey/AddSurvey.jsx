import { Link, useNavigate, useOutletContext } from "react-router-dom";
import Input from "../../components/Input";
import TextArea from "../../components/TextArea";
import { useState } from "react";
import Select from "../../components/Select";

const AddSurvey = () => {
    const { jwtToken } = useOutletContext();
    const [errors, setErrors] = useState([]);

    const navigate = useNavigate();

    const statusOptions = [
        {id: "false", value: "Tidak terbatas waktu"},
        {id: "true", value: "Terbatas waktu"},
    ]

    const hasError = (key) => {
        return errors.indexOf(key) !== -1;
    }

    const [survey, setSurvey] = useState({
        title: "",
        description: "",
        has_time_limit: "",
        start_date: "",
        end_date: "",
    });

    const convertToFormattedDateTime = (dateTimeString) => {
        return `${dateTimeString}:00Z`;
    }

    const handleChange = () => (event) => {
        const { name, value } = event.target;
        let formattedValue = value;

        // Melakukan konversi format tanggal dan waktu jika input adalah datetime-local
        if (event.target.type === "datetime-local") {
            formattedValue = convertToFormattedDateTime(value);
        }

        setSurvey({
            ...survey,
            [name]: formattedValue,
        })
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        let errors = [];
        let required = [
            { field: survey.title, name: "title"},
            { field: survey.description, name: "description"},
            { field: survey.has_time_limit, name: "has_time_limit"},
            { field: survey.start_date, name: "start_date"},
            { field: survey.end_date, name: "end_date"},
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
            method: "POST",
            headers: headers,
            credentials: "include",
        }

        fetch('http://localhost:8080/forms/create', requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    console.log(data.error);
                } else {
                    navigate('/surveys');
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
                <Link to="/articles/create" className="flex items-center bg-black hover:bg-gray-800 py-2 px-2 rounded-md text-xs font-semibold text-white">Create new</Link>
            </div>
            <div className="w-full border rounded-xl shadow-md p-5">
                <pre>{JSON.stringify(survey, null, 3)}</pre>
                <form onSubmit={handleSubmit}>
                    <Input
                        title="Judul"
                        type="text"
                        name="title"
                        placeHolder="Judul"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        onChange={handleChange("title")}
                        errorMsg={hasError("title") ? "Please enter a title" : ""}
                    />
                    <TextArea
                        title="Deskripsi"
                        name="description"
                        placeHolder="Deskripsi"
                        value={survey.description}
                        onChange={handleChange("description")}
                        errorMsg={hasError("description") ? "Please enter a description" : ""}
                    />
                    <Select 
                        title="Timer"
                        name={"has_time_limit"}
                        className="w-full px-2 py-2 border border-gray-300 rounded-md appearance-none"
                        options={statusOptions}
                        onChange={handleChange("has_time_limit")}
                        placeHolder={"Pilih status timer"}
                        errorMsg={hasError("has_time_limit") ? "Please select a timer status" : ""}
                    />
                    <div className="grid grid-cols-2 gap-3">
                        <Input
                            title="Waktu mulai"
                            type="datetime-local"
                            name="start_date"
                            placeHolder="Judul"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            onChange={handleChange("start_date")}
                            errorMsg={hasError("start_date") ? "Please enter a time" : ""}
                        />
                        <Input
                            title="Waktu berakhir"
                            type="datetime-local"
                            name="end_date"
                            placeHolder="Judul"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            onChange={handleChange("end_date")}
                            errorMsg={hasError("end_date") ? "Please enter a time" : ""}
                        />
                    </div>
                    <button className="bg-black hover:bg-gray-800 py-2 px-2 rounded-md text-xs font-semibold text-white">Save</button>
                </form>
            </div>
        </>
    );
}

export default AddSurvey;