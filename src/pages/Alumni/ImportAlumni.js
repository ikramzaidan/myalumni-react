import { useNavigate, useOutletContext } from "react-router-dom";
import { useState } from "react";
import { FaUpload } from "react-icons/fa6";
import { IoCaretDown, IoCaretUp } from "react-icons/io5";
import { MdCancel } from "react-icons/md";

const ImportAlummi = () => {
    const { jwtToken } = useOutletContext();
    const [errors, setErrors] = useState([]);

    const navigate = useNavigate();

    const [students, setStudents] = useState([]);
    const [fileName, setFileName] = useState("");
    const [showPreview, setShowPreview] = useState(true);

    const handleShowPreview = () => {
        setShowPreview((prev) => !prev);
    };

    const handleDeleteFile = () => {
        setFileName("");
        setStudents([]);
    }

    const handleFileChange = async (event) => {
        const file = event.target.files[0];

        if (!file) {
            setErrors(['Please select a file to upload.']);
            return;
        } else {
            setFileName(file.name);
        }

        if (file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            setErrors(['Only .xlsx files are allowed.']);
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`https://alumnihub.site/alumni/import`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to import alumni data.');
            }

            const data = await response.json();
            setStudents(data); // Assuming the response data contains the list of students under 'Data'
        } catch (error) {
            setErrors([error.message]);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", "Bearer " + jwtToken);

        const requestBody = students;

        const requestOptions = {
            body: JSON.stringify(requestBody),
            method: "POST",
            headers: headers,
            credentials: "include",
        }

        fetch(`https://alumnihub.site/alumni/import/save`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    setErrors(data.error);
                } else {
                    navigate('/alumni');
                }
            })
            .catch(err => {
                setErrors(err);
            })
    }

    return (
        <>
            <div className="flex justify-between items-center w-full mb-5">
                <h2 className="text-lg font-bold">Impor Alumni</h2>
            </div>
            {/* <pre>{JSON.stringify(students, null, 3)}</pre> */}
            {errors.length > 0 && (
                <div className="text-red-500 mb-5">
                    {errors.map((error, index) => (
                        <div key={index}>{error}</div>
                    ))}
                </div>
            )}
            <div className="w-full flex flex-col items-center border-dashed border-4 rounded-xl p-5 mb-8">
                {!fileName ? (
                    <>
                    <input id="file" type="file" name="file" className="hidden" accept=".xlsx" onChange={handleFileChange} />
                    <label htmlFor="file" className="flex flex-col items-center gap-2">
                        <FaUpload className="text-4xl text-gray-400" />
                        <div className="flex flex-col items-center">
                            <div className="text-gray-600 font-bold">Pilih file di komputer anda</div>
                            <div className="text-gray-600 text-sm font-normal">File harus memiliki ekstensi .xlsx</div>
                        </div>
                    </label>
                    </>
                ) : (
                    <>
                    <div className="flex items-center gap-1 mb-3">
                        {fileName}
                        <button onClick={handleDeleteFile} className="text-gray-400"><MdCancel /></button>
                    </div>
                    <button onClick={handleSubmit} className="bg-red-500 px-5 py-2 text-white font-bold hover:bg-red-400">Simpan</button>
                    </>
                )}
                
            </div>
            {!students || students.length === 0 ? ("") : (
            <>
                <div className="flex justify-between items-center mb-5">
                    <div className="flex items-center gap-1">
                        <div className="text-lg font-bold">Pratinjau</div> 
                        <button className="text-gray-600" type="button" onClick={handleShowPreview}>{!showPreview ? (<IoCaretDown />) : (<IoCaretUp />)}</button>
                    </div>
                    <p>{students.length + 1} Baris</p>
                </div>
                {!showPreview ? ("") : (
                    <table className="w-full text-s text-left overflow-x-auto">
                        <thead className="text-xs font-semibold border-b border-t text-dark-grey uppercase">
                            <tr>
                                <th className="p-3 text-center">NISN</th>
                                <th className="p-3 text-center">NIS</th>
                                <th className="p-3 text-center">Nama</th>
                                <th className="p-3 text-center">Jenis Kelamin</th>
                                <th className="p-3 text-center">Telepon</th>
                                <th className="p-3 text-center">Tahun Lulus</th>
                                <th className="p-3 text-center">Kelas</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((s, index) => (
                            <tr className="bg-white text-darker-black text-xs lg:text-sm border-b" key={index}>
                                <td className="p-3 text-center">{s.nisn}</td>
                                <td className="p-3 text-center">{s.nis}</td>
                                <td className="p-3 text-center">{s.name}</td>
                                <td className="p-3 text-center">{s.gender}</td>
                                <td className="p-3 text-center">{s.phone}</td>
                                <td className="p-3 text-center">{s.graduation_year}</td>
                                <td className="p-3 text-center">{s.class}</td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </>
            )}
        </>
    );
}

export default ImportAlummi;