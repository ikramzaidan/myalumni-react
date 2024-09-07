import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa6";
import { IoAdd } from "react-icons/io5";
import { PiStudentBold } from "react-icons/pi";
import { Link, useOutletContext } from "react-router-dom";

const Alumni = () => {
    const [students, setStudents] = useState([]);
    const { jwtToken } = useOutletContext();
    const { isAdmin } = useOutletContext();
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (jwtToken !== "") {
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Authorization", "Bearer " + jwtToken);

            const requestOptions = {
                method: "GET",
                headers: headers,
            }

            fetch(`https://alumnihub.site/alumni`, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    setStudents(data);
                    setFilteredStudents(data);
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }, [jwtToken]);

    const handleSearch = (event) => {
        const value = event.target.value.toLowerCase();
        setSearchTerm(value);
        filterData(value);
    };

    const filterData = (term) => {
        const filtered = students.filter(student => 
            student.name.toLowerCase().includes(term) ||
            student.graduation_year.toString().includes(term)
        );
        setFilteredStudents(filtered);
    };


    return (
        <>
            <div className="flex justify-between items-center w-full mb-5">
                <h2 className="text-lg font-bold">Alumni</h2>
                <div className="flex gap-2.5">
                    <input 
                        id="search"
                        type="text" 
                        placeholder="Search..." 
                        value={searchTerm}
                        onChange={handleSearch} 
                        className="w-full px-3 text-xs border border-gray-300 focus:border-blue-400 focus:ring-0 rounded-md"
                    />
                    {isAdmin ? (
                        <Link to="/alumni/create" className="bg-white hover:bg-gray-50 border px-1.5 rounded-md text-xl text-black shadow-md flex items-center" title="Tambah Data Alumni"><IoAdd className="stroke-w-4" /></Link>
                    ) : ("")}
                </div>
            </div>

            {!students || students.length === 0 ? (
                <div className="flex flex-col w-full h-64 justify-center items-center text-gray-400">
                    <div className="text-6xl mb-2"><PiStudentBold /></div>
                    <div className="text-2xl font-bold">Belum ada Alumni.</div>
                </div>
            ) : filteredStudents.length === 0 ? (
                <div className="flex flex-col w-full h-64 justify-center items-center text-gray-400">
                    <div className="text-2xl font-bold">Alumni tidak ditemukan.</div>
                </div>
            ) : (
                <table className="w-full text-s text-left">
                    <thead className="text-xs font-semibold text-dark-grey uppercase border-b-2 border-t-2">
                        <tr>
                            <th className="p-3 text-center">Nama</th>
                            <th className="p-3 text-center">Tahun Lulus</th>
                            <th className="p-3 text-center"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.map((s) => (
                            <tr className="bg-white text-darker-black text-xs lg:text-sm border-b" key={s.id}>
                                <td className="p-3">{s.name}</td>
                                <td className="p-3 text-center">{s.graduation_year}</td>
                                <td className="p-3 text-center"><Link to={`/alumni/${s.id}`} className="hover:text-gray-600" title="Lihat"><FaEye /></Link></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </>
    );
}

export default Alumni;