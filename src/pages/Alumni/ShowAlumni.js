import { Link, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaPenToSquare, FaTrash } from "react-icons/fa6";

const ShowAlummi = () => {
    const { jwtToken } = useOutletContext();
    const { isAdmin } = useOutletContext();
    const navigate = useNavigate();
    let { id } = useParams();

    const [student, setStudent] = useState({});

    const handleDelete = () => {
        let headers = new Headers();
        headers.append("Authorization", "Bearer " + jwtToken)

        const requestOptions = {
            method: "DELETE",
            headers: headers,
        }

        fetch(`https://alumnihub.site/alumni/${id}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    console.log(data.error);
                } else {
                    navigate("/alumni");
                }
            })
            .catch(err => {console.log(err)});
    }

    // Get data alumni saat pertama kali load
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
            <div className="flex flex-col gap-4">
                <div className="border rounded-xl shadow-md">
                    <div className="w-full rounded-t-xl bg-black p-5"></div>
                    <div className="flex flex-col p-5">
                        <h3 className="text-xl font-bold mt-10 px-0">{ student.name }</h3>
                        {student.user_username ? (
                            <Link to={`../profile/${student.user_username}`} className="mt-1 text-gray-400 hover:text-gray-500 hover:underline text-sm font-semibold">Lihat profil</Link>
                        ) : ("")}
                    </div>
                </div>
                <div className="w-full border rounded-xl shadow-md p-5">
                    {/* <pre>{JSON.stringify(student, null, 3)}</pre> */}
                    <form>
                        <div className="flex flex-col mb-3">
                            <label className="mb-1.5">Nama</label>
                            <div className="w-full border p-3 border-gray-300 rounded-md">{student.name}</div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                            <div className="flex flex-col">
                                <label className="mb-1.5">NISN</label>
                                <div className="w-full border p-3 border-gray-300 rounded-md">{student.nisn}</div>
                            </div>
                            <div className="flex flex-col">
                            <label className="mb-1.5">NIS</label>
                            <div className="w-full border p-3 border-gray-300 rounded-md">{student.nis}</div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                            <div className="flex flex-col">
                                <label className="mb-1.5">Jenis Kelamin</label>
                                <div className="w-full border p-3 border-gray-300 rounded-md">{student.gender === "M" ? "Laki-laki" : "Perempuan"}</div>
                            </div>
                            <div className="flex flex-col">
                            <label className="mb-1.5">Telepon</label>
                            <div className="w-full border p-3 border-gray-300 rounded-md">{student.phone}</div>
                            </div>
                        </div>
                        <div className="flex flex-col mb-3">
                            <label className="mb-1.5">Tahun Kelulusan</label>
                            <div className="w-full border p-3 border-gray-300 rounded-md">{student.graduation_year}</div>
                        </div>
                    </form>
                </div>

                { !isAdmin ? ("") : (
                    <div className="flex gap-2 justify-end items-center w-full">
                        <Link to={`/alumni/${student.id}/edit`} className="flex items-center gap-1 py-2 px-3 hover:bg-gray-200 hover:text-blue-500 rounded-md transition delay-300 duration-300 ease-in-out">
                            <FaPenToSquare />
                            <span className="text-sm font-semibold">Edit</span>
                        </Link>
                        <button onClick={handleDelete} className="flex items-center gap-1 py-2 px-3 hover:bg-gray-200 hover:text-red-600 rounded-md transition delay-300 duration-300 ease-in-out">
                            <FaTrash />
                            <span className="text-sm font-semibold">Delete</span>
                        </button>
                    </div>
                )}
            </div>
            
        </>
    );
}

export default ShowAlummi;