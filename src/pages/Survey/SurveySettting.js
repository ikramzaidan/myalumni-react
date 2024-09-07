import classNames from "classnames";
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import Input from "../../components/Input";
import TextArea from "../../components/TextArea";

const SurveySetting = () => {
    let { id } = useParams();
    const { jwtToken } = useOutletContext();
    const { survey } = useOutletContext();
    const { setSurvey } = useOutletContext();
    const { setSurveyUpdated } = useOutletContext();
    const { isAdmin } = useOutletContext();

    const [isSwitched, setIsSwithed] = useState(false);
    const [isSwitched2, setIsSwithed2] = useState(false);

    const [errors, setErrors] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {

        if(!isAdmin) {
            navigate("/");
        }

    }, [isAdmin, navigate]);

    const hasError = (key) => {
        return errors.indexOf(key) !== -1;
    }

    const handleSwitch = (name) => () => {
        if (name === "visibility") {
            if (isSwitched && survey.hidden === "true") {
                setSurvey({
                    ...survey,
                    hidden: "false"
                });
                setIsSwithed(false);
            } else {
                setSurvey({
                    ...survey,
                    hidden: "true"
                });
                setIsSwithed(true);
            }
        } else {
            if (isSwitched2 && survey.has_time_limit === "true") {
                setSurvey({
                    ...survey,
                    has_time_limit: "false"
                });
                setIsSwithed2(false);
            } else {
                setSurvey({
                    ...survey,
                    has_time_limit: "true"
                });
                setIsSwithed2(true);
            }
        }
    };

    const handleChange = () => (event) => {
        const { name, value } = event.target;
        let formattedValue = value;

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
            { field: survey.hidden, name: "hidden"},
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
            method: "PATCH",
            headers: headers,
            credentials: "include",
        }

        fetch(`https://alumnihub.site/forms/${id}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    console.log(data.error);
                } else {
                    setSurveyUpdated(true);
                }
            })
            .catch(err => {
                console.log(err);
            })
    }

    const formatDateTimeLocal = (isoString) => {
        if (!isoString) return "";
        return isoString.slice(0, 16); // format to 'YYYY-MM-DDTHH:MM'
    };

    const convertToFormattedDateTime = (dateTimeString) => {
        return `${dateTimeString}:00Z`;
    }

    return(
        <>
            {survey && Object.keys(survey).length !== 0 ? (
                <div className="w-full border rounded-xl shadow-md p-5">
                    {/* <pre>{JSON.stringify(survey, null, 3)}</pre> */}
                    <div className="flex flex-col mb-6">
                        <h4 className="font-bold mb-3">Pengaturan</h4>
                        <div className="flex justify-between items-center mb-3">
                            <div className="flex flex-col">
                                <div>Visibilitas</div>
                                <div className="text-gray-400 text-sm font-light">Ubah visibilitas survei untuk menyembunyikan survei dari orang-orang.</div>
                            </div>
                            <div className="flex items-center gap-3">
                                <label className="font-semibold hidden lg:block">{survey.hidden === "false" ? "Terlihat" : "Disembunyikan"}</label>
                                <div onClick={handleSwitch("visibility")}
                                    className={classNames("flex h-6 w-12 rounded-full outline-none p-[0.1rem] transition-all duration-300 cursor-pointer", {
                                        "bg-red-400": isSwitched,
                                        "bg-gray-200": !isSwitched
                                    })}>
                                    <span className={classNames("h-full aspect-square rounded-full bg-white transition-all duration-300", {
                                        "ml-6": isSwitched
                                    })}></span>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between items-center mb-3">
                            <div className="flex flex-col">
                                <div>Batas waktu</div>
                                <div className="text-gray-400 text-sm font-light">Ubah batas waktu survei untuk memberikan batas waktu pengisian survei.</div>
                            </div>
                            <div className="flex items-center gap-3">
                                <label className="font-semibold hidden lg:block">{survey.has_time_limit === "false" ? "Tidak terbatas" : "Terbatas"}</label>
                                <div onClick={handleSwitch("limit")}
                                    className={classNames("flex h-6 w-12 rounded-full outline-none p-[0.1rem] transition-all duration-300 cursor-pointer", {
                                        "bg-red-400": isSwitched2,
                                        "bg-gray-200": !isSwitched2
                                    })}>
                                    <span className={classNames("h-full aspect-square rounded-full bg-white transition-all duration-300", {
                                        "ml-6": isSwitched2
                                    })}></span>
                                </div>
                            </div>
                        </div>
                        <div className={`flex-col gap-3 ` + (survey.has_time_limit === "true" ? "flex" : "hidden" )}>
                            <div className="flex flex-col lg:flex-row lg:justify-between items-start lg:items-center">
                                <div className="mb-2 lg:mb-0">
                                    <label>Waktu mulai</label>
                                </div>
                                <div className="w-full lg:w-auto">
                                    <input
                                        type="datetime-local"
                                        name="start_date"
                                        placeholder="Judul Survei"
                                        className="w-full px-3 py-2 border border-gray-300 focus:border-red-400 focus:ring-0 rounded-md"
                                        value={formatDateTimeLocal(survey.start_date)}
                                        onChange={handleChange("start_date")}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col lg:flex-row lg:justify-between items-start lg:items-center">
                                <div className="mb-2 lg:mb-0">
                                    <label>Waktu berakhir</label>
                                </div>
                                <div className="w-full lg:w-auto">
                                    <input
                                        type="datetime-local"
                                        name="end_date"
                                        placeholder="Judul Survei"
                                        className="w-full px-3 py-2 border border-gray-300 focus:border-red-400 focus:ring-0 rounded-md"
                                        value={formatDateTimeLocal(survey.end_date)}
                                        onChange={handleChange("end_date")}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mb-6">
                        <h4 className="font-bold mb-3">Edit</h4>
                        <div className="flex flex-col">
                            <div className="grid grid-cols-5 items-center">
                                <div className="hidden lg:block">
                                    <label>Judul Survei</label>
                                </div>
                                <div className="col-span-5 lg:col-span-4">
                                    <Input
                                        type="text"
                                        name="title"
                                        placeholder="Judul Survei"
                                        className="w-full px-3 py-2 border border-gray-300 focus:border-red-400 focus:ring-0 rounded-md"
                                        value={survey.title}
                                        onChange={handleChange("title")}
                                        errorMsg={hasError("title") ? "Please enter a title" : ""}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-5 items-center">
                                <div className="hidden lg:block">
                                    <label>Deskripsi</label>
                                </div>
                                <div className="col-span-5 lg:col-span-4">
                                    <TextArea
                                        type="text"
                                        name="description"
                                        placeholder="Deskripsi"
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 focus:border-red-400 focus:ring-0 rounded-md resize-none"
                                        value={survey.description}
                                        onChange={handleChange("description")}
                                        errorMsg={hasError("description") ? "Please enter a description" : ""}
                                    />
                                </div>
                            </div>
                        </div> 
                    </div>
                    <div className="flex justify-end">
                        <button onClick={handleSubmit} className="py-2 px-5 bg-red-500 hover:bg-red-400 text-white text-sm font-medium rounded-md">Simpan</button>
                    </div>
                </div>
            ) : ("")}
            
        </>
    );
}

export default SurveySetting;