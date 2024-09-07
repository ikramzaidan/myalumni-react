import { useEffect, useRef, useState } from "react";
import { IoAdd, IoEllipsisHorizontal } from "react-icons/io5";
import { Link, Outlet, useLocation, useOutletContext, useParams } from "react-router-dom";
import Input from "../../components/Input";
import AddQuestion from "../../components/AddQuestion";
import { FaDownload } from "react-icons/fa6";

const SurveyLayout = () => {
    const { jwtToken } = useOutletContext();
    const { isAdmin } = useOutletContext();
    const { setAlertMessage } = useOutletContext();
    const { setOpenModal } = useOutletContext();

    const [survey, setSurvey] = useState({}); // State untuk objek survei
    const [newQuestion, setNewQuestion] = useState({}); // State untuk objek question baru (duplikat)

    const [dropdown, setDropdown] = useState(false); // State untuk dropdown
    const dropdownRef = useRef(null);

    const [surveyEditMode, setSurveyEditMode] = useState(false);
    const [questionCreateMode, setQuestionCreateMode] = useState(false);

    const [surveyUpdated, setSurveyUpdated] = useState(false); // State status berhasil update survey
    const [questionCreated, setQuestionCreated] = useState(false); // State status berhasil menambah question
    const [questionUpdated, setQuestionUpdated] = useState(false); // State status berhasil update question

    const [errors, setErrors] = useState([]);

    let { id } = useParams(); // Simpan id survei dari url
    const location = useLocation(); // Simpan seluruh path url

    // handle click di luar dropdown  
    const handleClickOutsideDropdown = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDropdown(false);
        }
    };

    // useEffect untuk dropdown
    useEffect(() => {
        if (dropdown) {
            document.addEventListener('mousedown', handleClickOutsideDropdown);
        } else {
            document.removeEventListener('mousedown', handleClickOutsideDropdown);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutsideDropdown);
        };

    }, [dropdown]);

    // Mengambil data survei
    useEffect(() => {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", "Bearer " + jwtToken);

        const requestOptions = {
            method: "GET",
            headers: headers,
        }

        fetch(`https://alumnihub.site/forms/${id}/show`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setSurvey(data);
                setSurveyEditMode(false);
                setSurveyUpdated(false);
                setQuestionUpdated(false);
                setQuestionCreated(false);
            })
            .catch(err => {
                console.log(err);
            })

    }, [id, jwtToken, surveyUpdated, questionUpdated, questionCreated]);

    // Menambahkan question baru
    useEffect(() => {
        if (Object.keys(newQuestion).length !== 0) {
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Authorization", "Bearer " + jwtToken);

            const requestBody = newQuestion;

            const requestOptions = {
                body: JSON.stringify(requestBody),
                method: "POST",
                headers: headers,
                credentials: "include",
            }

            fetch(`https://alumnihub.site/questions/create`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    console.log(data.error);
                } else {
                    setQuestionCreated(true);
                    setNewQuestion({});
                }
            })
            .catch(err => {
                console.log(err);
            })
        }

    }, [id, jwtToken, newQuestion]);

    const getPath = (url) => {
        const pathParts = url.pathname.split('/');

        let result;
    
        if (pathParts.length >= 4 && pathParts[3] === 'result') {
            result = "result";
        } else if (pathParts.length >= 6 && pathParts[5] === 'result') {
            result = "result";
        } else if (pathParts.length >= 4 && pathParts[3] === 'fill') {
            result = "fill";
        } else if (pathParts.length >= 4 && pathParts[3] === 'setting') {
            result = "setting";
        } else {
            result = "";
        }
    
        return result;
    }

    const hasError = (key) => {
        return errors.indexOf(key) !== -1;
    }

    const handleChange = () => (event) => {
        const { name, value } = event.target;
        let formattedValue = value;

        setSurvey({
            ...survey,
            [name]: formattedValue,
        })
    }

    const handleSurveySave = (event) => {
        event.preventDefault();

        let errors = [];
        let required = [
            { field: survey.title, name: "title"},
            { field: survey.description, name: "description"},
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
            method: "PATCH",
            headers: headers,
            credentials: "include",
        }

        fetch(`https://alumnihub.site/forms/${id}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    console.log(data.error);
                    setAlertMessage("Terjadi kesalahan. Survei gagal diperbarui.");
                } else {
                    setSurveyUpdated(true);
                    setAlertMessage("Survei berhasil diperbarui.");
                }
            })
            .catch(err => {
                console.log(err);
                setAlertMessage("Terjadi kesalahan. Survei gagal diperbarui.");
            })
    }

    const handleQuestionCreate = () => {
        setQuestionCreated(true);
        setQuestionCreateMode(false);
    };

    const handleExportSurvey = () => {
        const headers = new Headers();
        headers.append("Authorization", "Bearer " + jwtToken);

        const requestOptions = {
            method: "GET",
            headers: headers,
            credentials: "include",
        }

        fetch(`https://alumnihub.site/forms/${id}/answers/export`, requestOptions)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.blob();  // Mengambil respons sebagai blob
            })
            .then((blob) => {
                // Buat URL untuk file
                const url = window.URL.createObjectURL(new Blob([blob]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `survey_${survey.title}.xlsx`);  // Nama file unduhan
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
                setAlertMessage("Survei berhasil diunduh.");
            })
            .catch(err => {
                console.log(err);
                setAlertMessage("Terjadi kesalahan. Survei gagal diunduh.");
            });
    }

    return (
        <>
            <div className="flex justify-between items-center w-full mb-5">
                <h2 className="text-lg font-bold">Survei</h2>
                {isAdmin ? (
                <div className="flex gap-2">
                    <button type="button" onClick={() => setQuestionCreateMode((prev) => !prev)} className={`bg-white hover:bg-gray-50 border p-1 rounded-md text-xl text-black shadow-md ${getPath(location) !== "" ? "hidden" : ""}`} title="Tambah Pertanyaan"><IoAdd className="stroke-w-4"/></button>
                    <button type="button" onClick={() => setDropdown((prev) => !prev)} className="bg-white hover:bg-gray-50 border p-1 rounded-md text-xl text-black shadow-md"><IoEllipsisHorizontal className="stroke-w-4" /></button>
                    {dropdown ? (
                        <div ref={dropdownRef} className="z-10 absolute top-[8.5rem] right-6 lg:right-8 border bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700" onBlur={() => setDropdown((prev) => !prev)}>
                            <ul className="py-2 px-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                                <li>
                                    <button type="button" onClick={() => setSurveyEditMode((prev) => !prev)} className="w-full text-start block px-4 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 dark:hover:text-white">{surveyEditMode ? "Nonaktifkan Mode Edit" : "Aktifkan Mode Edit"}</button>
                                </li>
                                <li>
                                    <button type="button" className="w-full text-start block px-4 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 dark:hover:text-white" onClick={() => setOpenModal(true)}>Hapus Survei</button>
                                </li>
                            </ul>
                        </div>
                    ) : "" }
                </div>
                ) : ("")}
            </div>
            <div className="flex flex-col gap-4">
            <div className="border rounded-xl shadow-md">
                <div className="w-full rounded-t-xl bg-gray-400 p-5"></div>
                    <div className="flex flex-col p-5">
                        {/* <pre>{JSON.stringify(survey, null, 3)}</pre> */}
                        {surveyEditMode ? (
                            <form onSubmit={handleSurveySave} className="flex flex-col">
                                <Input 
                                    type="text" 
                                    name="title" 
                                    className="text-xl font-bold mt-10 mb-2 px-0 border-0 border-b-2 focus:ring-0" 
                                    value={ survey.title } 
                                    onChange={handleChange("title")}
                                    errorMsg={hasError("title") ? "Please enter a title" : ""}
                                />
                                <textarea 
                                    name="description"
                                    className="text-sm px-0 border-0 border-b-2 focus:ring-0"
                                    value={survey.description}
                                    onChange={handleChange("description")}
                                    errorMsg={hasError("description") ? "Please enter a description" : ""}
                                ></textarea>
                            </form>
                        ) : (
                            <div className="flex flex-row justify-between  mt-10 items-end">
                                <div className="flex flex-col">
                                    <h3 className="text-xl font-bold mb-2 px-0">{ survey.title }</h3>
                                    <p className="text-sm px-0">{survey.description}</p>
                                </div>
                                <div className={`${getPath(location) === "result" ? "" : "hidden"} flex items-center gap-1 py-2 px-3 bg-gray-400 hover:bg-gray-300 text-white text-sm font-medium rounded-md cursor-pointer`} onClick={handleExportSurvey}><FaDownload />Ekspor</div>
                            </div>
                        ) }
                        
                    </div>
                </div>
                {isAdmin ? (
                    <div className="flex justify-center items-center rounded-xl border shadow-md gap-5 py-2">
                        <Link to={`/surveys/${id}/`} className={`p-2 hover:bg-gray-200 text-sm font-medium rounded-md ${getPath(location) === "" ? "bg-gray-200" : ""}`}>Pertanyaan</Link>
                        <Link to={`/surveys/${id}/result`} className={`p-2 hover:bg-gray-200 text-sm font-medium rounded-md ${getPath(location) === "result" ? "bg-gray-200" : ""}`}>Jawaban</Link>
                        <Link to={`/surveys/${id}/fill`} className={`p-2 hover:bg-gray-200 text-sm font-medium rounded-md ${getPath(location) === "fill" ? "bg-gray-200" : ""}`}>Pratinjau</Link>
                        <Link to={`/surveys/${id}/setting`} className={`p-2 hover:bg-gray-200 text-sm font-medium rounded-md ${getPath(location) === "setting" ? "bg-gray-200" : ""}`}>Setelan</Link>
                    </div>
                ) : ("")}
                <AddQuestion className={questionCreateMode ? "" : "hidden"} value={id} onSuccess={handleQuestionCreate} />
                <Outlet context={{ jwtToken, isAdmin, survey, setSurvey, setNewQuestion, setSurveyUpdated, setQuestionUpdated, setQuestionCreateMode, setAlertMessage }} />
            </div>
        </>
    );
}

export default SurveyLayout;