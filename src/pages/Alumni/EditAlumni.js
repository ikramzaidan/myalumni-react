import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import Input from "../../components/Input";
import { useEffect, useState } from "react";
import SelectInput from "../../components/SelectInput";

const EditAlumni = () => {
    const { jwtToken } = useOutletContext();
    const { isAdmin } = useOutletContext();
    const [student, setStudent] = useState({});
    const [errors, setErrors] = useState([]);
    
    let { id } = useParams();

    const navigate = useNavigate();

    useEffect(() => {
        if (!isAdmin) {
            navigate('/');
        }
    });

    const hasError = (key) => {
        return errors.indexOf(key) !== -1;
    }

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

        fetch(`https://alumnihub.site/alumni/${student.id}`, requestOptions)
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

        fetch(`https://alumnihub.site/alumni/${id}`, requestOptions)
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
                {/* <pre>{JSON.stringify(student, null, 3)}</pre> */}
                {student && Object.keys(student).length !== 0 ? (
                <form onSubmit={handleSubmit}>
                    <Input
                        title="Nama"
                        type="text"
                        name="name"
                        placeHolder="Nama"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        onChange={handleChange("name")}
                        errorMsg={hasError("name") ? "Please enter a name" : ""}
                        value={student.name}
                    />
                    <div className="grid grid-cols-2 gap-3">
                        <Input
                            title="NISN"
                            type="text"
                            name="nisn"
                            placeHolder="NISN"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            value={student.nisn}
                            onChange={handleChange("nisn")}
                            errorMsg={hasError("nisn") ? "Please enter a nisn" : ""}
                        />
                        <Input
                            title="NIS"
                            type="text"
                            name="nis"
                            placeHolder="NIS"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            value={student.nis}
                            onChange={handleChange("nis")}
                            errorMsg={hasError("nis") ? "Please enter a nis" : ""}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <SelectInput 
                            title="Jenis Kelamin"
                            name="gender"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            options={[{value: "M", label: "Laki-laki"},{value: "F", label: "Perempuan"}]}
                            defaultValue={student.gender === "M" ? "M" : "F"}
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
                            onChange={handleChange()}
                            errorMsg={hasError("phone") ? "Please enter a phone number" : ""}
                            value={student.phone}
                        />
                    </div>
                    <button type="submit" className="py-2 px-3 bg-red-500 hover:bg-red-400 text-white text-sm font-medium rounded-md">Simpan</button>
                </form>
                ) : ("")}
            </div>
        </>
    );
}

export default EditAlumni;