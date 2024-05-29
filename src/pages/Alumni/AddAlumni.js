import { Link, useNavigate, useOutletContext } from "react-router-dom";
import Input from "../../components/Input";
import { useState } from "react";
import Select from "../../components/Select";

const AddAlummi = () => {
    const { jwtToken } = useOutletContext();
    const [errors, setErrors] = useState([]);

    const navigate = useNavigate();

    const hasError = (key) => {
        return errors.indexOf(key) !== -1;
    }

    const [student, setStudent] = useState({});

    const handleChange = () => (event) => {
        const { name, value } = event.target;

        setStudent({
            ...student,
            [name]: value,
        })
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        let errors = [];
        let required = [
            { field: student.name, name: "name"},
            { field: student.place_of_birth, name: "place_of_birth"},
            { field: student.date_of_birth, name: "date_of_birth"},
            { field: student.gender, name: "gender"},
            { field: student.phone, name: "phone"},
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

        const requestBody = student;

        const requestOptions = {
            body: JSON.stringify(requestBody),
            method: "POST",
            headers: headers,
            credentials: "include",
        }

        fetch('http://localhost:8080/alumni/create', requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    console.log(data.error);
                } else {
                    navigate('/alumni');
                }
            })
            .catch(err => {
                console.log(err);
            })
    }

    return (
        <>
            <div className="flex justify-between items-center w-full mb-5">
                <h2 className="text-lg font-bold">students</h2>
                <Link to="/articles/create" className="flex items-center bg-black hover:bg-gray-800 py-2 px-2 rounded-md text-xs font-semibold text-white">Create new</Link>
            </div>
            <div className="w-full border rounded-xl shadow-md p-5">
                <pre>{JSON.stringify(student, null, 3)}</pre>
                <form onSubmit={handleSubmit}>
                    <Input
                        title="Nama"
                        type="text"
                        name="name"
                        placeHolder="Nama"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        onChange={handleChange("title")}
                        errorMsg={hasError("title") ? "Please enter a title" : ""}
                    />
                    <div className="grid grid-cols-2 gap-3">
                        <Input
                            title="Tempat Lahir"
                            type="text"
                            name="place_of_birth"
                            placeHolder="Tempat Lahir"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            onChange={handleChange("end_date")}
                            errorMsg={hasError("end_date") ? "Please enter a place" : ""}
                        />
                        <Input
                            title="Tanggal Lahir"
                            type="date"
                            name="date_of_birth"
                            placeHolder="Tanggal Lahir"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            onChange={handleChange("start_date")}
                            errorMsg={hasError("start_date") ? "Please enter a time" : ""}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <Select 
                            title="Jenis Kelamin"
                            name={"gender"}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md appearance-none"
                            options={[
                                {id: "M", value: "Laki-laki"},
                                {id: "F", value: "Perempuan"},
                            ]}
                            onChange={handleChange("gender")}
                            placeHolder={"Jenis Kelamin"}
                            errorMsg={hasError("gender") ? "Please select a gender" : ""}
                        />
                        <Input
                            title="Nomor Telepon"
                            type="text"
                            name="phone"
                            placeHolder="Nomor Telepon"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            onChange={handleChange("phone")}
                            errorMsg={hasError("phone") ? "Please enter a phone" : ""}
                        />
                    </div>
                    <button className="bg-black hover:bg-gray-800 py-2 px-2 rounded-md text-xs font-semibold text-white">Save</button>
                </form>
            </div>
        </>
    );
}

export default AddAlummi;