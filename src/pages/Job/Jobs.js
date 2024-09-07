import { Link, useOutletContext } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { PiBriefcaseFill } from "react-icons/pi";
import { ImSearch } from 'react-icons/im';
import Input from '../../components/Input';
import TextArea from '../../components/TextArea';
import SelectInput from '../../components/SelectInput';
import { FaChevronRight, FaChevronUp } from 'react-icons/fa6';
import { IoAdd } from 'react-icons/io5';
import DateTimeDisplay from '../../components/DateTimeDisplay';

const Jobs = () => {
    const { jwtToken } = useOutletContext();
    const [errors, setErrors] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [job, setJob] = useState({});
    const [newJob, setNewJob] = useState(false);
    const [viewSalary, setViewSalary] = useState(true);
    const [jobCreateMode, setJobCreateMode] = useState(false);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect( () => {
        if (jwtToken !== "") {
            
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Authorization", "Bearer " + jwtToken);

            const requestOptions = {
                method: "GET",
                headers: headers,
            }

            fetch(`https://alumnihub.site/jobs`, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    setJobs(data);
                    setFilteredJobs(data);
                    setNewJob(false);
                })
                .catch(err => {
                    console.log(err);
                })
        }

    }, [jwtToken, newJob]);

    const handleSearch = (event) => {
        const value = event.target.value.toLowerCase();
        setSearchTerm(value);
        filterData(value);
    };

    const filterData = (term) => {
        const filtered = jobs.filter(job => {
            const jobPosition = job.job_position ? job.job_position.toLowerCase() : ''; // Pastikan ada nilai sebelum melakukan toLowerCase()
            const company = job.company ? job.company.toLowerCase() : ''; // Pastikan ada nilai sebelum melakukan toLowerCase()
    
            return jobPosition.includes(term.toLowerCase()) || company.includes(term.toLowerCase());
        });
        setFilteredJobs(filtered);
    };

    const hasError = (key) => {
        return errors.indexOf(key) !== -1;
    }

    const handleChange = () => (event) => {
        const { name, value } = event.target;

        if(name === "min_salary" || name === "max_salary") {
            setJob(prevState => ({
                ...prevState,
                [name]: parseInt(value, 10),
            }));
        } else if(name === "view_salary") {
            if (value === "false") {
                setJob(prevState => ({
                    ...prevState,
                    min_salary: 0,
                    max_salary: 0,
                }));
                setViewSalary(false);
            } else {
                setViewSalary(true);
            }
        } else {
            setJob(prevState => ({
                ...prevState,
                [name]: value,
            }));
        }
    }

    const handlePostSubmit = (event) => {
        event.preventDefault();

        const requiredFields = ["job_position", "company", "job_location", "job_type", "description"];
        const newErrors = [];

        requiredFields.forEach(field => {
            if (!job[field]) {
                newErrors.push(field);
            }
        });

        if (newErrors.length > 0) {
            setErrors(newErrors);
            return;
        }
        
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", "Bearer " + jwtToken);

        const requestBody = job;

        const requestOptions = {
            body: JSON.stringify(requestBody),
            method: "POST",
            headers: headers,
            credentials: "include",
        }

        fetch(`https://alumnihub.site/jobs/create`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    console.log(data.error);
                } else {
                    setNewJob(true);
                    setJobCreateMode(false);
                    setJob({});
                }
            })
            .catch(err => {
                console.log(err);
            })
        
    }

    return (
        <>
            <div className="flex justify-between items-center w-full mb-5">
                <h2 className="text-lg font-bold">Loker</h2>
                <button type="button" className="bg-white hover:bg-gray-50 border p-1.5 rounded-md text-xl text-black shadow-md" title="Posting Pekerjaan" onClick={() => setJobCreateMode((prev) => !prev)}><IoAdd className="stroke-w-4" /></button>
            </div>
            <div className="flex flex-col xl:grid xl:grid-cols-3 gap-4 mb-8">
                <div className="xl:col-span-2 flex flex-col gap-4">
                    {/* <pre>{JSON.stringify(job, null, 3)}</pre> */}
                    {jobCreateMode ? (
                        <div className="flex flex-col border shadow rounded-xl bg-white p-4">
                            <div className="flex w-full justify-end mb-1">
                                <button type="button" onClick={() => setJobCreateMode(false)}><FaChevronUp className="text-sm" /></button>
                            </div>
                            <Input 
                                name="job_position"
                                className="w-full border border-gray-400 p-2 focus:ring-0 focus:border-red-400 rounded-md"
                                placeHolder="Posisi Pekerjaan"
                                onChange={handleChange()}
                                marginBottom="mb-1"
                                value={job.job_position || ""}
                                errorMsg={hasError("job_position") ? "Please enter this section" : ""}
                            />
                            <Input 
                                name="company"
                                className="w-full border border-gray-400 p-2 focus:ring-0 focus:border-red-400 rounded-md"
                                placeHolder="Nama Perusahaan"
                                onChange={handleChange()}
                                marginBottom="mb-1"
                                value={job.company || ""}
                                errorMsg={hasError("company") ? "Please enter this section" : ""}
                            />
                            <Input 
                                name="job_location"
                                className="w-full border border-gray-400 p-2 focus:ring-0 focus:border-red-400 rounded-md"
                                placeHolder="Lokasi"
                                onChange={handleChange()}
                                marginBottom="mb-1"
                                value={job.job_location || ""}
                                errorMsg={hasError("job_location") ? "Please enter this section" : ""}
                            />
                            <SelectInput
                                name="job_type"
                                className="w-full border border-gray-400 p-2 focus:ring-0 focus:border-red-400 rounded-md"
                                defaultValue={job.type || ""}
                                options={ [{value: "Full time", label: "Full time"}, {value: "Part time", label: "Part time"}] }
                                onChange={handleChange()}
                                placeHolder={"Pilih jenis pekerjaan"}
                                marginBottom="mb-1"
                                errorMsg={hasError("job_type") ? "Please enter this section" : ""}
                            />
                            <SelectInput
                                name="view_salary"
                                className="w-full border border-gray-400 p-2 focus:ring-0 focus:border-red-400 rounded-md"
                                defaultValue={"true"}
                                options={ [{value: "true", label: "Tampilkan Gaji"}, {value: "false", label: "Jangan Tampilkan Gaji"}] }
                                onChange={handleChange()}
                                placeHolder="Opsi gaji"
                                marginBottom="mb-1"
                            />
                            {viewSalary ? (
                                <div className="flex gap-2 mt-2 mb-1">
                                    <input 
                                        id="min"
                                        name="min_salary"
                                        type="number"
                                        className="w-full border border-gray-400 p-2 focus:ring-0 focus:border-red-400 rounded-md mb-0.5"
                                        placeholder="Gaji minimal"
                                        onChange={handleChange()}
                                        value={job.min_salary || ""}
                                    />
                                    <input 
                                        id="max"
                                        name="max_salary"
                                        type="number"
                                        className="w-full border border-gray-400 p-2 focus:ring-0 focus:border-red-400 rounded-md mb-0.5"
                                        placeholder="Gaji maksimal"
                                        onChange={handleChange()}
                                        value={job.max_salary || ""}
                                    />
                                </div>
                            ) : ("")}
                            <TextArea 
                                name="description"
                                className="w-full border border-gray-400 resize-none overflow-hidden p-2 focus:ring-0 focus:border-red-400"
                                placeHolder="Deskripsi"
                                onChange={handleChange()}
                                value={job.description || ""}
                                errorMsg={hasError("description") ? "Please enter this section" : ""}
                            />
                            <div className="flex mt-5">
                                <button type="button" className="py-2 px-3 bg-red-500 text-white text-sm rounded-md" onClick={handlePostSubmit}>Posting</button>
                            </div>
                        </div>
                    ) : ("")}
                    {!jobs || jobs.length === 0 ? (
                        <div className="flex flex-col w-full h-64 justify-center items-center text-gray-400">
                            <div className="text-6xl mb-2"><PiBriefcaseFill /></div>
                            <div className="text-2xl font-bold">Belum ada Pekerjaan.</div>
                        </div>
                    ) : !filteredJobs || filteredJobs.length === 0 ? (
                        <div className="flex flex-col w-full h-64 justify-center items-center text-gray-400">
                            <div className="text-6xl mb-2"><PiBriefcaseFill /></div>
                            <div className="text-2xl font-bold">Pekerjaan tidak ditemukan.</div>
                        </div>
                    ) : (
                        <>
                        {filteredJobs.map((j) => (
                            <div className="flex flex-col border shadow rounded-xl bg-white p-4 font-normal" key={j.id}>
                                <div className="flex items-center">
                                    <div className="w-full flex flex-col">
                                        <Link to={`/jobs/${j.id}`} className="font-semibold">{j.job_position}</Link>
                                        <div className="mb-3">{j.company}</div>
                                        <div className="text-xs text-gray-400 font-medium"><DateTimeDisplay dateTimeStr={j.created_at} /></div>
                                    </div>
                                    <Link to={`/jobs/${j.id}`}>
                                        <FaChevronRight />
                                    </Link>
                                </div>
                                <div className="w-full border mt-3"></div>                                
                            </div>
                        ))}
                        </>
                    )}
                </div>
                <div className="hidden xl:flex xl:flex-col xl:col-span-1 gap-4">
                    <form className="hidden md:flex items-center">
                        <div className="flex items-center w-full border px-3 rounded-md shadow-sm">
                            <ImSearch className="text-gray-400" />
                            <input id="search" type="text" className="border-0 text-sm focus:border-0 focus:ring-0" placeholder="Search..." value={searchTerm} onChange={handleSearch} />
                        </div>
                    </form>
                    <div className="w-full border rounded-md p-4">
                        <div className="text-sm text-black font-semibold mb-1">Filter</div>
                        <div className="w-full border-0 border-b mb-3"></div>
                        <div className="flex flex-col gap-2">
                            <div className="text-xs font-semibold text-gray-500 mb-1">Diposting oleh:</div>
                            <div className="flex gap-2 items-center">
                                <input type="checkbox" className="border-gray-400 focus:ring-0"></input>
                                <label className="text-sm">Guru</label>
                            </div>
                            <div className="flex gap-2 items-center">
                                <input type="checkbox" className="border-gray-400 focus:ring-0"></input>
                                <label className="text-sm">Alumni</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Jobs;