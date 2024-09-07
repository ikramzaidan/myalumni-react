import { Link, useOutletContext, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaFacebookF, FaInstagram, FaTiktok, FaTwitter } from "react-icons/fa6";
import { IoChatbubbleOutline, IoHeart, IoHeartOutline, IoSend } from "react-icons/io5";
import { PiBriefcaseFill, PiGraduationCapFill, PiNewspaperClippingFill } from "react-icons/pi";
import DateTimeDisplay from "../../components/DateTimeDisplay";

const ShowProfile = () => {
    const { jwtToken } = useOutletContext();
    let { username } = useParams();

    const [profile, setProfile] = useState({});
    const [forums, setForums] = useState([]);
    const [comment, setComment] = useState({});
    const [likes, setLikes] = useState([]);
    const [newLike, setNewLike] = useState(false);
    const [newComment, setNewComment] = useState(false);
    const [addComment, setAddComment] = useState(false);
    const [addCommentId, setAddCommentId] = useState(null);

    const likedForumIds = new Set((likes || []).map(like => like.forum_id));

    useEffect(() => {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", "Bearer " + jwtToken);

        const requestOptions = {
            method: "GET",
            headers: headers,
        }

        fetch(`https://alumnihub.site/profile/${username}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setProfile({
                    id: data.id || "",
                    user_id: data.user_id || "",
                    alumni_id: data.alumni_id || "",
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
                    jobs: data.jobs || []
                });
            })
            .catch(err => {
                console.log(err);
            });

        fetch(`https://alumnihub.site/forums/user/${username}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setForums(data);
            })
            .catch(err => {
                console.log(err);
            });

        fetch(`https://alumnihub.site/likes`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setLikes(data);
                setNewLike(false);
            })
            .catch(err => {
                console.log(err);
            })

    }, [jwtToken, username, newLike, newComment]);

    const handleLike = (id) => (event) => {
        event.preventDefault();

        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", "Bearer " + jwtToken);

        const requestOptions = {
            method: "POST",
            headers: headers,
            credentials: "include",
        }

        if (likedForumIds.has(id)) {
            fetch(`https://alumnihub.site/forums/${id}/unlike`, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    if (data.error) {
                        console.log(data.error);
                    } else {
                        setNewLike(true);
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        } else {
            fetch(`https://alumnihub.site/forums/${id}/like`, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    if (data.error) {
                        console.log(data.error);
                    } else {
                        setNewLike(true);
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        }

    }

    const handleChange = (type) => (event) => {
        const { name, value } = event.target;

        setComment({
            ...comment,
            [name]: value,
        });
    }

    const handleAddComment = (id) => {
        if (addCommentId !== id) {
            setAddCommentId(id); // Setel id pertanyaan untuk memulai mode edit
            setAddComment(true);
            setComment({
                ...comment,
                forum_id: id,
                reply_text: "",
            });
        } else {
            setAddCommentId(null); // Setel id pertanyaan untuk memulai mode edit
            setAddComment(false);
            setComment({
                ...comment,
                forum_id: null,
            });
        }
    }

    const handleCommentSubmit = (event) => {
        event.preventDefault();

        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", "Bearer " + jwtToken);

        const requestBody = comment;

        const requestOptions = {
            body: JSON.stringify(requestBody),
            method: "POST",
            headers: headers,
            credentials: "include",
        }

        fetch(`https://alumnihub.site/forums/${comment.forum_id}/reply`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    console.log(data.error);
                } else {
                    setNewComment(true);
                    setAddComment(false);
                    setComment({});
                }
            })
            .catch(err => {
                console.log(err);
            })
    }

    return (
        <>
            {/* <pre>{JSON.stringify(profile, null, 3)}</pre> */}
            <div className="flex flex-col gap-4">
                <div className="relative border rounded-xl shadow-md">
                    <div className="absolute -z-10 rounded-xl rounded-b-none w-full h-32 bg-red-400"></div>
                        <div className="flex flex-col p-5 pt-16">
                            <div className="bg-gray-300 rounded-full w-36 h-36 aspect-square overflow-hidden border-4 border-white">
                                <img src={profile.photo && profile.photo !== "" ? `https://alumnihub.site/${profile.photo}` : "https://alumnihub.site/public/no-image.png"} className="object-cover w-full h-full" alt="Profile" />
                            </div>
                            <div className="flex flex-col px-1">
                                <h3 className="text-xl font-bold mt-5">{ profile.user_name }</h3>
                                <h4 className="text-base text-gray-600 font-normal">@{ profile.user_username }</h4>
                                { profile.bio !== "" ? (
                                    <p className="mt-3 mb-3">{profile.bio}</p>
                                ) : "" }
                                <div className="flex gap-2 items-center">
                                    {profile.sm_facebook !== "" ? (
                                        <div className="p-2 text-lg text-white bg-black rounded-md"><FaFacebookF /></div>
                                    ) : ("")}
                                    {profile.sm_instagram !== "" ? (
                                        <div className="p-2 text-lg text-white bg-black rounded-md"><FaInstagram /></div>
                                    ) : ("")}
                                    {profile.sm_twitter !== "" ? (
                                        <div className="p-2 text-lg text-white bg-black rounded-md"><FaTwitter /></div>
                                    ) : ("")}
                                    {profile.sm_tiktok !== "" ? (
                                        <div className="p-2 text-lg text-white bg-black rounded-md"><FaTiktok /></div>
                                    ) : ("")}
                                </div>
                            </div>
                            <div className="flex flex-col xl:grid xl:grid-cols-2">
                                {/* Pendidikan */}
                                {!profile.educations || profile.educations.length === 0 ? ("") : (
                                    <div className="flex flex-col gap-2 mt-5">
                                        <div className="font-bold text-base">Pendidikan</div>
                                        {profile.educations.map((e) => (
                                            <div className="flex flex-row items-center justify-between gap-3" key={e.id}>
                                                <div className="flex flex-row items-center gap-3">
                                                    <div className="flex justify-center items-center bg-gray-300 rounded-full w-14 h-auto aspect-square overflow-hidden">
                                                        <PiGraduationCapFill className="text-white text-3xl" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <div className="text-sm font-semibold">{e.school_name}</div>
                                                        <div className="text-sm">{e.school_degree}, {e.school_study_major}</div>
                                                        <div className="text-sm">{e.start_year} - {e.end_year}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {/* Pekerjaan */}
                                {!profile.jobs || profile.jobs.length === 0 ? ("") : (
                                    <div className="flex flex-col gap-2 mt-5">
                                        <div className="font-bold text-base">Pekerjaan</div>
                                        {profile.jobs.map((j) => (
                                            <div className="flex flex-row items-center justify-between gap-3" key={j.id}>
                                                <div className="flex flex-row items-center gap-3">
                                                    <div className="flex justify-center items-center bg-gray-300 rounded-full w-14 h-auto aspect-square overflow-hidden">
                                                        <PiBriefcaseFill className="text-white text-3xl" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <div className="text-sm font-semibold">{j.position}</div>
                                                        <div className="text-sm">{j.company}, {j.location}</div>
                                                        <div className="text-sm">{j.start_year} - {j.end_year}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                </div>
                {!forums || forums.length === 0 ? (
                    <div className="flex flex-col w-full h-64 justify-center items-center text-gray-400">
                        <div className="text-6xl mb-2"><PiNewspaperClippingFill /></div>
                        <div className="text-2xl font-bold">Belum ada postingan terbaru.</div>
                    </div>
                ) : (
                    <>
                    {forums.map((q) => (
                        <div className="flex flex-col gap-3 border shadow rounded-xl bg-white p-4 font-normal" key={q.id}>
                            <div className="flex gap-2 items-center">
                                <svg className="w-10 h-10 text-black hover:text-gray-700 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a9 9 0 0 0 5-1.5 4 4 0 0 0-4-3.5h-2a4 4 0 0 0-4 3.5 9 9 0 0 0 5 1.5Zm3-11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                                </svg>
                                <div className="flex flex-col">
                                    {q.user_name ? (
                                        <div className="font-semibold">{q.user_name} <span className="text-sm font-light">@{q.user_username}</span></div>
                                    ) : (
                                        <div className="font-semibold">{q.user_username}</div>
                                    )}
                                    <div className="text-gray-500 text-xs font-normal"><DateTimeDisplay dateTimeStr={q.published_at} /></div>
                                </div>
                            </div>
                            <p>{q.forum_text}</p>
                            <div className="w-full border mt-3"></div>
                            <div className="flex gap-5 items-center">
                                <button type="button" className="flex items-center gap-1.5 text-xl text-gray-500 hover:text-red-500" onClick={handleLike(q.id)}>
                                    {likedForumIds.has(q.id) ? (
                                        <IoHeart size={21} className="text-red-500" />
                                    ) : (
                                        <IoHeartOutline size={21} className="stroke-w-3" />
                                    )}
                                    {!q.likes_number ? (
                                        <span className="text-base">Suka</span>
                                    ) : (
                                        <span className="text-base">{q.likes_number}</span>
                                    )}
                                </button>
                                <div onClick={() => handleAddComment(q.id)} className="flex items-center gap-1.5 text-xl text-gray-500 hover:text-red-500">
                                    <IoChatbubbleOutline className="stroke-w-3 " />
                                    {!q.comments_number ? (
                                        <span className="text-base">Komentar</span>
                                    ) : (
                                        <span className="text-base">{q.comments_number}</span>
                                    )}
                                </div>
                            </div>
                            { q.comments_number ? (
                                    <>
                                    <div className="w-full border"></div>
                                    { q.comments && q.comments.map((c) => (
                                        <div className="flex gap-2 items-start" key={c.id}>
                                            <svg className="w-8 h-8 text-black hover:text-gray-700 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a9 9 0 0 0 5-1.5 4 4 0 0 0-4-3.5h-2a4 4 0 0 0-4 3.5 9 9 0 0 0 5 1.5Zm3-11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                                            </svg>
                                            <div className="flex flex-col">
                                                {c.user_name ? (
                                                    <Link to={`/profile/${c.user_username}`} className="text-sm font-semibold">{c.user_name} <span className="text-sm font-light">@{c.user_username}</span></Link>
                                                ) : (
                                                    <Link to={`/profile/${c.user_username}`} className="text-sm font-semibold">{c.user_username}</Link>
                                                )}
                                                <p className="text-sm mt-1">{c.reply_text}</p>
                                            </div>
                                        </div>
                                    ))}
                                    </>
                                ) : ("") }
                                { addComment && addCommentId === q.id ? (
                                    <>
                                        <div className="w-full border"></div>
                                        <form onSubmit={handleCommentSubmit}>
                                            <div className="flex justify-between items-stretch">
                                                <input
                                                    name="reply_text"
                                                    className="w-full border-0 border-b border-gray-300 focus:ring-0 focus:border-gray-300"
                                                    placeholder="Beri Komentar"
                                                    onChange={handleChange("comment")}
                                                    value={comment.reply_text || ""}
                                                ></input>
                                                <button type="submit" className="px-3 border-0 border-b border-gray-300 text-gray-500" title="Kirim komentar"><IoSend className="hover:text-red-500" /></button>
                                            </div>
                                        </form>
                                    </>
                                ) : ("") }
                        </div>
                    ))}
                    </>
                )}
            </div>
            
        </>
    );
}

export default ShowProfile;