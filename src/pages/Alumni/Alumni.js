import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa6";
import { PiStudentBold } from "react-icons/pi";
import { Link, useOutletContext } from "react-router-dom";

const Alumni = () => {
    const [students, setStudents] = useState([]);
    const { jwtToken } = useOutletContext();

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('id-ID', options);
    }

    useEffect( () => {
        if (jwtToken !== "") {
            
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Authorization", "Bearer " + jwtToken);

            const requestOptions = {
                method: "GET",
                headers: headers,
            }

            fetch('/alumni', requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    setStudents(data)
                })
                .catch(err => {
                    console.log(err);
                })
        }

    }, [jwtToken]);

    return (
        <>
            <div className="flex justify-between items-center w-full mb-5">
                <h2 className="text-lg font-bold">Alumni</h2>
                <Link to="/alumni/create" className="flex items-center bg-black hover:bg-gray-800 py-2 px-2 rounded-md text-xs font-semibold text-white">Create new</Link>
            </div>

            {!students || students.length === 0 ? (
                <div className="flex flex-col w-full h-64 justify-center items-center text-gray-400">
                    <div className="text-6xl mb-2"><PiStudentBold /></div>
                    <div className="text-2xl font-bold">Belum ada Alumni.</div>
                </div>
            ) : (
            <table className="w-full text-s text-left border">
                <thead className="text-xs font-semibold text-dark-grey bg-gray-200 uppercase">
                    <tr>
                        <th className="p-3">Nama</th>
                        <th className="p-3">Tempat Lahir</th>
                        <th className="p-3">Tanggal Lahir</th>
                        <th className="p-3"></th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((s) => (
                    <tr className="bg-white text-darker-black text-xs lg:text-sm border-b">
                        <td className="p-3">{s.name}</td>
                        <td className="p-3">{s.place_of_birth}</td>
                        <td className="p-3">{formatDate(s.date_of_birth)}</td>
                        <td className="p-3"><Link to={`/alumni/${s.id}`} className="hover:text-gray-600" title="Lihat"><FaEye /></Link></td>
                    </tr>
                    ))}
                </tbody>
            </table>
            )}
        </>
    );
}

export default Alumni;