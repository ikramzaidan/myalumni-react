import { Link, useNavigate, useOutletContext } from "react-router-dom";
import Input from "../../components/Input";
import { useEffect, useState } from "react";
import SelectInput from "../../components/SelectInput";
import { TbTableImport } from "react-icons/tb";

const AddAlummi = () => {
    const { jwtToken } = useOutletContext();
    const { isAdmin } = useOutletContext();
    const [errors, setErrors] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        if (!isAdmin) {
            navigate('/');
        }
    });

    const hasError = (key) => {
        return errors.indexOf(key) !== -1;
    }

    const [student, setStudent] = useState({});

    const handleChange = () => (event) => {
        const { name, value } = event.target;

        if (name === "graduation_year") {
            setStudent({
                ...student,
                [name]: parseInt(value, 10)
            })
        } else {
            setStudent({
                ...student,
                [name]: value,
            })
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        let errors = [];
        let required = [
            { field: student.name, name: "name"},
            { field: student.gender, name: "gender"},
            { field: student.phone, name: "phone"},
            { field: student.nis, name: "nis"},
            { field: student.nisn, name: "nisn"},
            { field: student.graduation_year, name: "graduation_yearyear"},
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

        fetch(`https://alumnihub.site/alumni/create`, requestOptions)
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
                <h2 className="text-lg font-bold">Alumni</h2>
                <Link to="/alumni/import" className="flex gap-1 bg-white hover:bg-gray-50 border p-2 rounded-md text-xl text-black shadow-md" title="Buat Survei Baru"><TbTableImport /> <span className="text-sm font-semibold">Impor Alumni</span></Link>
            </div>
            <div className="w-full border rounded-xl shadow-md p-5">
                {/* <pre>{JSON.stringify(student, null, 3)}</pre> */}
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
                            title="NISN"
                            type="text"
                            name="nisn"
                            placeHolder="NISN"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            onChange={handleChange("nisn")}
                            errorMsg={hasError("nisn") ? "Please enter a nisn" : ""}
                        />
                        <Input
                            title="NIS"
                            type="text"
                            name="nis"
                            placeHolder="NIS"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            onChange={handleChange("nis")}
                            errorMsg={hasError("nis") ? "Please enter a nis" : ""}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <SelectInput 
                            title="Jenis Kelamin"
                            name={"gender"}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md appearance-none"
                            options={[
                                {label: "Laki-laki", value: "M"},
                                {label: "Perempuan", value: "F"},
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
                    <Input
                        title="Tahun Kelulusan"
                        type="number"
                        name="graduation_year"
                        placeHolder="Tahun Kelulusan"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        onChange={handleChange("graduation_year")}
                        errorMsg={hasError("graduation_year") ? "Please enter a year" : ""}
                    />
                    <button type="submit" className="py-2 px-3 bg-red-500 hover:bg-red-400 text-white text-sm font-medium rounded-md">Simpan</button>
                </form>
            </div>
        </>
    );
}

export default AddAlummi;