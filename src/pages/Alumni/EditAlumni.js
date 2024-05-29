import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import Input from "../../components/Input";
import { useEffect, useState } from "react";
import Select from "../../components/Select";

const EditAlumni = () => {
    const { jwtToken } = useOutletContext();
    const [errors, setErrors] = useState([]);

    const navigate = useNavigate();
    let { id } = useParams();

    const formatDate = (dateString) => {
        if (student.date_of_birth) {
            const date = new Date(dateString);
            const formattedDate = date.toISOString().slice(0, 10);
            return formattedDate;
        } else {
            return null
        }
    }

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
            method: "PATCH",
            headers: headers,
            credentials: "include",
        }

        fetch(`http://localhost:8080/alumni/${student.id}`, requestOptions)
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

    useEffect(() => {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", "Bearer " + jwtToken);

        const requestOptions = {
            method: "GET",
            headers: headers,
        }

        fetch(`http://localhost:8080/alumni/${id}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setStudent(data);
            })
            .catch(err => {
                console.log(err);
            })

    }, [id, jwtToken]);

    return (
        <>
            <div className="flex justify-between items-center w-full mb-5">
                <h2 className="text-lg font-bold">Alumni</h2>
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
                        onChange={handleChange()}
                        errorMsg={hasError("name") ? "Please enter a name" : ""}
                        value={student.name}
                    />
                    <div className="grid grid-cols-2 gap-3">
                        <Input
                            title="Tempat Lahir"
                            type="text"
                            name="place_of_birth"
                            placeHolder="Tempat Lahir"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            onChange={handleChange()}
                            errorMsg={hasError("place_of_birth") ? "Please enter a place" : ""}
                            value={student.place_of_birth}
                        />
                        <Input
                            title="Tanggal Lahir"
                            type="date"
                            name="date_of_birth"
                            placeHolder="Tanggal Lahir"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            onChange={handleChange()}
                            errorMsg={hasError("date_of_birth") ? "Please enter a date" : ""}
                            value={formatDate(student.date_of_birth)}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <Select 
                            title="Jenis Kelamin"
                            name={"gender"}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md appearance-none"
                            options={[
                                {id: "M", value: "Laki-laki", selected: student.gender === "M" ? true : false },
                                {id: "F", value: "Perempuan", selected: student.gender === "F" ? true : false },
                            ]}
                            onChange={handleChange()}
                            placeHolder={"Jenis Kelamin"}
                            errorMsg={hasError("gender") ? "Please select a gender" : ""}
                        />
                        <Input
                            title="Nomor Telepon"
                            type="text"
                            name="phone"
                            placeHolder="Nomor Telepon"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            onChange={handleChange()}
                            errorMsg={hasError("phone") ? "Please enter a phone number" : ""}
                            value={student.phone}
                        />
                    </div>
                    <button className="bg-black hover:bg-gray-800 py-2 px-2 rounded-md text-xs font-semibold text-white">Save</button>
                </form>
            </div>
        </>
    );
}

export default EditAlumni;