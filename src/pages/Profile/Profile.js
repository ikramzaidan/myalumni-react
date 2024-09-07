import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import { TiPencil } from "react-icons/ti";
import { IoAdd } from "react-icons/io5";
import { PiGraduationCapFill, PiBriefcaseFill } from "react-icons/pi";
import { FaTrash } from "react-icons/fa6";

const Profile = () => {
    const { jwtToken } = useOutletContext();
    const { setAlertMessage } = useOutletContext();
    // const navigate = useNavigate();

    const [profile, setProfile] = useState({});
    const [education, setEducation] = useState({});
    const [job, setJob] = useState({});
    const [educationAddSection, setEducationAddSection] = useState(false);
    const [jobAddSection, setJobAddSection] = useState(false);
    const [jobIsHovered, setJobIsHovered] = useState(null);
    const [educationIsHovered, setEducationIsHovered] = useState(null);
    const [image, setImage] = useState({});
    const [updateProfile, setUpdateProfile] = useState(false);
    const [selectedImage, setSelectedImage] = useState("");
    const [submitPending, setSubmitPending] = useState(false);

    // Get data alumni saat pertama kali load
    useEffect(() => {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", "Bearer " + jwtToken);

        const requestOptions = {
            method: "GET",
            headers: headers,
        }

        fetch(`https://alumnihub.site/profile`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setProfile({
                    user_id: data.user_id || "",
                    alumni_id: data.alumni_id || 0,
                    user_name: data.user_name || "",
                    user_username: data.user_username || "",
                    bio: data.bio || "",
                    location: data.location || "",
                    sm_facebook: data.sm_facebook || "",
                    sm_instagram: data.sm_instagram || "",
                    sm_twitter: data.sm_twitter || "",
                    sm_tiktok: data.sm_tiktok || "",
                    photo: data.photo || "",
                    educations: data.educations || [],
                    jobs: data.jobs || [],
                });
            })
            .catch(err => {
                console.log(err);
            })

    }, [jwtToken, updateProfile]);

    const handleChange = (type) => (event) => {
        const { name, value } = event.target;
        const intValue = parseInt(value, 10);

        if (type === education) {
            setEducation((prevEducation) => ({
                ...prevEducation,
                [name]: isNaN(intValue) ? value : intValue,
            }));
        } else if (type === job) {
            setJob((prevJob) => ({
                ...prevJob,
                [name]: isNaN(intValue) ? value : intValue,
            }));
        } else {
            setProfile((prevProfile) => ({
                ...prevProfile,
                [name]: value,
            }));
        }
        
    }

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Revoke the old URL if there's any
            if (selectedImage) {
                URL.revokeObjectURL(selectedImage);
            }
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);

            const formData = new FormData();
            formData.append("image", file);
            setImage({ ...image, data: formData });
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        setSubmitPending(true);

        const headers = new Headers();
        headers.append("Authorization", "Bearer " + jwtToken);

        if(image.data) {
            const firstRequestOptions = {
                body: image.data,
                method: "POST",
                headers: headers,
                credentials: "include",
            }

            fetch(`https://alumnihub.site/upload_image`, firstRequestOptions)
            .then((response => response.json()))
            .then((data) => {
                if (data.error) {
                    console.log(data.error);
                    setSubmitPending(false);
                } else {
                    setProfile((prevProfile) => {
                        const updatedProfile = { ...prevProfile, photo: data.file_path };

                        // Create a new fetch request for updating the profile
                        const headers = new Headers();
                        headers.append("Authorization", "Bearer " + jwtToken);
                        headers.append("Content-Type", "application/json");

                        const requestOptions = {
                            body: JSON.stringify(updatedProfile),
                            method: "PATCH",
                            headers: headers,
                            credentials: "include",
                        };

                        fetch(`https://alumnihub.site/profile/update`, requestOptions)
                        .then((response) => response.json())
                        .then((data) => {
                            if (data.error) {
                                console.log(data.error);
                                setAlertMessage("Terjadi kesalahan. Profil gagal diperbarui.");
                                setSubmitPending(false);
                            } else {
                                setUpdateProfile(true);
                                setAlertMessage("Profil berhasil diperbarui.");
                                setSubmitPending(false);
                            }
                        })
                        .catch(err => {
                            console.log(err);
                            setAlertMessage("Terjadi kesalahan. Profil gagal diperbarui.");
                            setSubmitPending(false);
                        })
                    })
                }
            })
            .catch(err => {
                console.log(err);
                setSubmitPending(false);
            })

        } else {
            const headers = new Headers();
            headers.append("Authorization", "Bearer " + jwtToken);
            headers.append("Content-Type", "application/json");

            const requestOptions = {
                body: JSON.stringify(profile),
                method: "PATCH",
                headers: headers,
                credentials: "include",
            };

            fetch(`https://alumnihub.site/profile/update`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    console.log(data.error);
                    setAlertMessage("Terjadi kesalahan. Profil gagal diperbarui.");
                    setSubmitPending(false);
                } else {
                    setUpdateProfile(true);
                    setAlertMessage("Profil berhasil diperbarui.");
                    setSubmitPending(false);
                }
            })
            .catch(err => {
                console.log(err);
                setAlertMessage("Terjadi kesalahan. Profil gagal diperbarui.");
                setSubmitPending(false);
            })
        }
    }

    const handleEducationAddSection = () => {
        setEducationAddSection((prev) => !prev);
        if (jobAddSection) {
            setJobAddSection(false);
        }
    };
      
    const handleJobAddSection = () => {
        setJobAddSection((prev) => !prev);
        if (educationAddSection) {
            setEducationAddSection(false);
        }
    };

    const handleSubmitEducation = (event) => {
        event.preventDefault();

        setSubmitPending(true);

        const headers = new Headers();
        headers.append("Authorization", "Bearer " + jwtToken);
        headers.append("Content-Type", "application/json");

        const requestOptions = {
            body: JSON.stringify(education),
            method: "POST",
            headers: headers,
            credentials: "include",
        };

        fetch(`https://alumnihub.site/profile/educations/create`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
            if (data.error) {
                console.log(data.error);
                setAlertMessage("Pendidikan gagal disimpan.");
                setSubmitPending(false);
            } else {
                setUpdateProfile(true);
                setEducationAddSection(false);
                setAlertMessage("Pendidikan berhasil disimpan.");
                setSubmitPending(false);
            }
        })
        .catch(err => {
            console.log(err);
            setAlertMessage("Pendidikan gagal disimpan.");
            setSubmitPending(false);
        })
    }

    const handleDeleteEducation = (event, id) => {
        event.preventDefault();

        const headers = new Headers();
        headers.append("Authorization", "Bearer " + jwtToken);
        headers.append("Content-Type", "application/json");

        const requestOptions = {
            method: "DELETE",
            headers: headers,
            credentials: "include",
        };

        fetch(`https://alumnihub.site/profile/educations/${id}`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
            if (data.error) {
                console.log(data.error);
                setAlertMessage("Terjadi kesalahan. Profil gagal diperbarui.");
            } else {
                setUpdateProfile(true);
                setAlertMessage("Profil berhasil diperbarui.");
            }
        })
        .catch(err => {
            console.log(err);
            setAlertMessage("Terjadi kesalahan. Profil gagal diperbarui.");
        })
    }

    const handleSubmitJob = (event) => {
        event.preventDefault();

        setSubmitPending(true);

        const headers = new Headers();
        headers.append("Authorization", "Bearer " + jwtToken);
        headers.append("Content-Type", "application/json");

        const requestOptions = {
            body: JSON.stringify(job),
            method: "POST",
            headers: headers,
            credentials: "include",
        };

        fetch(`https://alumnihub.site/profile/jobs/create`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
            if (data.error) {
                console.log(data.error);
                setAlertMessage("Pekerjaan gagal disimpan.");
                setSubmitPending(false);
            } else {
                setUpdateProfile(true);
                setJobAddSection(false);
                setAlertMessage("Pekerjaan berhasil disimpan.");
                setSubmitPending(false);
            }
        })
        .catch(err => {
            console.log(err);
            setAlertMessage("Pekerjaan gagal disimpan.");
            setSubmitPending(false);
        })
    }

    const handleDeleteJob = (event, id) => {
        event.preventDefault();

        const headers = new Headers();
        headers.append("Authorization", "Bearer " + jwtToken);
        headers.append("Content-Type", "application/json");

        const requestOptions = {
            method: "DELETE",
            headers: headers,
            credentials: "include",
        };

        fetch(`https://alumnihub.site/profile/jobs/${id}`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
            if (data.error) {
                console.log(data.error);
                setAlertMessage("Terjadi kesalahan. Profil gagal diperbarui.");
            } else {
                setUpdateProfile(true);
                setAlertMessage("Profil berhasil diperbarui.");
            }
        })
        .catch(err => {
            console.log(err);
            setAlertMessage("Terjadi kesalahan. Profil gagal diperbarui.");
        })
    }

    return (
        <>
            <div className="flex justify-between items-center w-full mb-5">
                <h2 className="text-lg font-bold">Alumni</h2>
            </div>
                {/* <pre>{JSON.stringify(profile, null, 3)}</pre> */}
                {profile && Object.keys(profile).length !== 0 ? (
                <div className="flex flex-col gap-4">
                    <div className="border rounded-xl shadow-md">
                        <div className="w-full rounded-t-xl bg-black p-5"></div>
                        <div className="flex gap-4 p-5 items-end">
                            <label htmlFor="photo" className="relative cursor-pointer">
                                <div className="bg-gray-300 rounded-full w-36 h-auto aspect-square mb-2 overflow-hidden">
                                    {selectedImage ? (
                                        <img src={selectedImage} className="object-cover w-full h-full" alt="Profile" />
                                    ) : (
                                        <img src={profile.photo !== "" ? `https://alumnihub.site/${profile.photo}` : "https://alumnihub.site/public/no-image.png"} className="object-cover w-full h-full" alt="Profile" />
                                    )}
                                    <div className="absolute aspect-square rounded-full inset-0 flex justify-center items-center opacity-0 hover:bg-gradient-to-t hover:from-black hover:to-black/50 hover:opacity-100 transition-opacity duration-300">
                                        <div className="flex gap-0.5 text-white">
                                            <TiPencil />
                                            <span className="text-sm font-bold">Ubah profil</span>
                                        </div>
                                    </div>
                                </div>
                            </label>
                            <input id="photo" type="file" name="image" className="hidden" onChange={handleImageChange} />
                            <div className="flex flex-col">
                                <h3 className="text-xl font-bold mt-10 mb-1 px-0">{ profile.user_name }</h3>
                                <h3 className="text-base font-normal mb-2 px-0">@{ profile.user_username }</h3>
                            </div>
                        </div>
                    </div>

                    <div className="w-full border rounded-xl shadow-md p-5">
                        {/* <pre>{JSON.stringify(profile, null, 3)}</pre> */}
                        <div className="flex flex-col">
                            <div className="flex flex-col mb-5 gap-2">
                                <div className="flex justify-between items-center">
                                    <div className="font-bold text-lg">Pendidikan</div>
                                    <button type="button" className="bg-white hover:bg-gray-50 p-1.5 rounded-md text-xl text-black" title="Posting Pendidikan" onClick={handleEducationAddSection}><IoAdd className="stroke-w-4" /></button>
                                </div>
                                {!educationAddSection ? (
                                    <>
                                    {!profile.educations || profile.educations.length === 0 ? (
                                        <div className="flex flex-col bg-gray-100 text-gray-500 p-5 justify-center items-center rounded-md">
                                            <div className="text-4xl mb-1"><PiGraduationCapFill /></div>
                                            <div className="text-xl font-bold">Belum ada data riwayat pendidikan</div>
                                        </div>
                                    ) : (
                                        <>
                                        {profile.educations.map((e) => (
                                            <div className="flex flex-row items-center justify-between gap-3 py-1 px-3 hover:bg-gray-100" key={e.id} onMouseEnter={() => setEducationIsHovered(e.id)} onMouseLeave={() => setEducationIsHovered(null)}>
                                                <div className="flex flex-row items-center gap-3">
                                                    <div className="flex justify-center items-center bg-gray-300 rounded-full w-14 h-auto aspect-square overflow-hidden">
                                                        <PiGraduationCapFill className="text-white text-3xl" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <div className="font-bold">{e.school_name}</div>
                                                        <div className="">{e.school_degree}, {e.school_study_major}</div>
                                                        <div className="">{e.start_year} - {e.end_year}</div>
                                                    </div>
                                                </div>
                                                {educationIsHovered === e.id && (
                                                    <div className="flex px-3">
                                                        <button onClick={(event) => handleDeleteEducation(event, e.id)}><FaTrash /></button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                        </>
                                    )}
                                    </>
                                ) : (
                                    <form onSubmit={handleSubmitEducation}>
                                        <div className="flex flex-col mb-4">
                                            <label htmlFor="school" className="font-bold mb-1">Nama Sekolah / Universitas</label>
                                            <input
                                                id="school"
                                                name="school_name"
                                                className="w-full border border-gray-300 rounded-md focus:ring-0 focus:border-red-500"
                                                placeholder="Nama Sekolah / Universitas"
                                                onChange={handleChange(education)}
                                                value={education.school_name}
                                            ></input>
                                        </div>
                                        <div className="flex flex-col mb-4">
                                            <label htmlFor="degree" className="font-bold mb-1">Gelar</label>
                                            <input
                                                id="degree"
                                                name="school_degree"
                                                className="w-full border border-gray-300 rounded-md focus:ring-0 focus:border-red-500"
                                                placeholder="Gelar"
                                                onChange={handleChange(education)}
                                                value={education.school_degree}
                                            ></input>
                                        </div>
                                        <div className="flex flex-col mb-4">
                                            <label htmlFor="major" className="font-bold mb-1">Program Studi</label>
                                            <input
                                                id="major"
                                                name="school_study_major"
                                                className="w-full border border-gray-300 rounded-md focus:ring-0 focus:border-red-500"
                                                placeholder="Program Studi"
                                                onChange={handleChange(education)}
                                                value={education.school_study_major}
                                            ></input>
                                        </div>
                                        <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-3">
                                            <div className="flex flex-col mb-4">
                                                <label htmlFor="start_year" className="font-bold mb-1">Tahun Masuk</label>
                                                <input
                                                    id="start_year"
                                                    name="start_year"
                                                    className="w-full border border-gray-300 rounded-md focus:ring-0 focus:border-red-500"
                                                    placeholder="Tahun Masuk"
                                                    onChange={handleChange(education)}
                                                    value={education.start_year}
                                                ></input>
                                            </div>
                                            <div className="flex flex-col mb-4">
                                                <label htmlFor="end_year" className="font-bold mb-1">Tahun Lulus</label>
                                                <input
                                                    id="end_year"
                                                    name="end_year"
                                                    className="w-full border border-gray-300 rounded-md focus:ring-0 focus:border-red-500"
                                                    placeholder="Tahun Lulus"
                                                    onChange={handleChange(education)}
                                                    value={education.end_year}
                                                ></input>
                                            </div>
                                        </div>
                                        <div className="flex flex-col md:flex-row md:justify-end">
                                            <button type="submit" className="mt-5 bg-red-500 hover:bg-red-300 py-3 px-5 rounded-md text-sm font-semibold text-white">Simpan</button>
                                        </div>
                                    </form>
                                )}
                            </div>
                            <div className="flex flex-col mb-5 gap-2">
                                <div className="flex justify-between items-center">
                                    <div className="font-bold text-lg">Pekerjaan</div>
                                    <button type="button" className="bg-white hover:bg-gray-50 p-1.5 rounded-md text-xl text-black" title="Posting Pekerjaan" onClick={handleJobAddSection}><IoAdd className="stroke-w-4" /></button>
                                </div>
                                {!jobAddSection ? (
                                    <>
                                    {!profile.jobs || profile.jobs.length === 0 ? (
                                        <div className="flex flex-col bg-gray-100 text-gray-500 p-5 justify-center items-center rounded-md">
                                            <div className="text-4xl mb-1"><PiBriefcaseFill /></div>
                                            <div className="text-xl font-bold">Belum ada data riwayat pekerjaan</div>
                                        </div>
                                    ) : (
                                        <>
                                        {profile.jobs.map((j) => (
                                            <div className="flex flex-row items-center justify-between gap-3 py-1 px-3 hover:bg-gray-100" key={j.id} onMouseEnter={() => setJobIsHovered(j.id)} onMouseLeave={() => setJobIsHovered(null)}>
                                                <div className="flex flex-row items-center gap-3">
                                                    <div className="flex justify-center items-center bg-gray-300 rounded-full w-14 h-auto aspect-square overflow-hidden">
                                                        <PiBriefcaseFill className="text-white text-3xl" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <div className="font-bold">{j.position}</div>
                                                        <div className="">{j.company}, {j.company_location}</div>
                                                        <div className="">{j.start_year} - {j.end_year}</div>
                                                    </div>
                                                </div>
                                                {jobIsHovered === j.id && (
                                                    <div className="flex px-3">
                                                        <button onClick={(event) => handleDeleteJob(event, j.id)}><FaTrash /></button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                        </>
                                    )}
                                    </>
                                ) : (
                                    <form onSubmit={handleSubmitJob}>
                                        {/* <pre>{JSON.stringify(job, null, 3)}</pre> */}
                                        <div className="flex flex-col mb-4">
                                            <label htmlFor="position" className="font-bold mb-1">Nama Posisi</label>
                                            <input
                                                id="position"
                                                name="position"
                                                className="w-full border border-gray-300 rounded-md focus:ring-0 focus:border-red-500"
                                                placeholder="Nama Posisi"
                                                onChange={handleChange(job)}
                                                value={job.position}
                                            ></input>
                                        </div>
                                        <div className="flex flex-col mb-4">
                                            <label htmlFor="company" className="font-bold mb-1">Nama Perusahaan</label>
                                            <input
                                                id="company"
                                                name="company"
                                                className="w-full border border-gray-300 rounded-md focus:ring-0 focus:border-red-500"
                                                placeholder="Nama Perusahaan"
                                                onChange={handleChange(job)}
                                                value={job.company}
                                            ></input>
                                        </div>
                                        <div className="flex flex-col mb-4">
                                            <label htmlFor="company_location" className="font-bold mb-1">Lokasi Pekerjaan</label>
                                            <input
                                                id="company_location"
                                                name="company_location"
                                                className="w-full border border-gray-300 rounded-md focus:ring-0 focus:border-red-500"
                                                placeholder="Lokasi Pekerjaan"
                                                onChange={handleChange(job)}
                                                value={job.company_location}
                                            ></input>
                                        </div>
                                        <div className="flex flex-col mb-4">
                                            <label htmlFor="employment_type" className="font-bold mb-1">Jenis Pekerjaan</label>
                                            <input
                                                id="employment_type"
                                                name="employment_type"
                                                className="w-full border border-gray-300 rounded-md focus:ring-0 focus:border-red-500"
                                                placeholder="Jenis Pekerjaan"
                                                onChange={handleChange(job)}
                                                value={job.employment_type}
                                            ></input>
                                        </div>
                                        <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-3">
                                            <div className="flex flex-col mb-4">
                                                <label htmlFor="work_start_year" className="font-bold mb-1">Tahun Masuk</label>
                                                <input
                                                    id="work_start_year"
                                                    name="start_year"
                                                    className="w-full border border-gray-300 rounded-md focus:ring-0 focus:border-red-500"
                                                    placeholder="Tahun Masuk"
                                                    onChange={handleChange(job)}
                                                    value={job.start_year}
                                                ></input>
                                            </div>
                                            <div className="flex flex-col mb-4">
                                                <label htmlFor="work_end_year" className="font-bold mb-1">Tahun Akhir</label>
                                                <input
                                                    id="work_end_year"
                                                    name="end_year"
                                                    className="w-full border border-gray-300 rounded-md focus:ring-0 focus:border-red-500"
                                                    placeholder="Tahun Akhir"
                                                    onChange={handleChange(job)}
                                                    value={job.end_year}
                                                ></input>
                                            </div>
                                        </div>
                                        <div className="flex flex-col md:flex-row md:justify-end">
                                            <button type="submit" className="mt-5 bg-red-500 hover:bg-red-300 py-3 px-5 rounded-md text-sm font-semibold text-white">Simpan</button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    <div className="w-full border rounded-xl shadow-md p-5">
                        {/* <pre>{JSON.stringify(profile, null, 3)}</pre> */}
                        <form onSubmit={handleSubmit}>
                            <div className="flex flex-col mb-4">
                                <label htmlFor="bio" className="font-bold mb-1">Bio</label>
                                <textarea
                                    id="bio"
                                    name="bio"
                                    className="w-full border border-gray-300 rounded-md resize-none focus:ring-0 focus:border-red-500"
                                    placeholder="Bio"
                                    onChange={handleChange()}
                                    value={profile.bio}
                                ></textarea>
                            </div>
                            <div className="flex flex-col mb-4">
                                <label htmlFor="location" className="font-bold mb-1">Location</label>
                                <input
                                    id="location"
                                    name="location"
                                    className="w-full border border-gray-300 rounded-md focus:ring-0 focus:border-red-500"
                                    placeholder="Location"
                                    onChange={handleChange()}
                                    value={profile.location}
                                ></input>
                            </div>
                            <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-3">
                                <div className="flex flex-col mb-4">
                                    <label htmlFor="fb" className="font-bold mb-1">Facebook</label>
                                    <input
                                        id="fb"
                                        name="sm_facebook"
                                        className="w-full border border-gray-300 rounded-md focus:ring-0 focus:border-red-500"
                                        placeholder="Facebook"
                                        onChange={handleChange()}
                                        value={profile.sm_facebook}
                                    ></input>
                                </div>
                                <div className="flex flex-col mb-4">
                                    <label htmlFor="ig" className="font-bold mb-1">Instagram</label>
                                    <input
                                        id="ig"
                                        name="sm_instagram"
                                        className="w-full border border-gray-300 rounded-md focus:ring-0 focus:border-red-500"
                                        placeholder="Instagram"
                                        onChange={handleChange()}
                                        value={profile.sm_instagram}
                                    ></input>
                                </div>
                            </div>
                            <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-3">
                                <div className="flex flex-col mb-4">
                                    <label htmlFor="tw" className="font-bold mb-1">Twitter</label>
                                    <input
                                        id="tw"
                                        name="sm_twitter"
                                        className="w-full border border-gray-300 rounded-md focus:ring-0 focus:border-red-500"
                                        placeholder="Twitter"
                                        onChange={handleChange()}
                                        value={profile.sm_twitter}
                                    ></input>
                                </div>
                                <div className="flex flex-col mb-4">
                                    <label htmlFor="tt" className="font-bold mb-1">Tiktok</label>
                                    <input
                                        id="tt"
                                        name="sm_tiktok"
                                        className="w-full border border-gray-300 rounded-md focus:ring-0 focus:border-red-500"
                                        placeholder="Tiktok"
                                        onChange={handleChange()}
                                        value={profile.sm_tiktok}
                                    ></input>
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row md:justify-end">
                                <button type="submit" className={`${submitPending ? 'animate-pulse cursor-not-allowed bg-red-400' : ''} mt-5 bg-red-500 hover:bg-red-300 py-3 px-5 rounded-md text-sm font-semibold text-white`} disabled={submitPending}>Simpan</button>
                            </div>
                        </form>
                    </div>
                    
                </div>
                ) : ("")}
            
        </>
    );
}

export default Profile;