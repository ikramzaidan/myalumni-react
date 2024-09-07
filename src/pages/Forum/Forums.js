import { useEffect, useState } from "react";
import { IoChatbubbleOutline, IoHeart, IoHeartOutline, IoSend } from "react-icons/io5";
import { PiNewspaperClippingFill } from "react-icons/pi";
import { Link, useOutletContext } from "react-router-dom";
import DateTimeDisplay from "../../components/DateTimeDisplay";
import { ImSearch } from "react-icons/im";

const Forums = () => {
    const { jwtToken } = useOutletContext();
    const [forums, setForums] = useState([]);
    const [forum, setForum] = useState({});
    const [likes, setLikes] = useState([]);
    const [comment, setComment] = useState({});
    const [newForum, setNewForum] = useState(false);
    const [newLike, setNewLike] = useState(false);
    const [newComment, setNewComment] = useState(false);
    const [addComment, setAddComment] = useState(false);
    const [addCommentId, setAddCommentId] = useState(null);
    const [filteredForums, setFilteredForums] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [forumPending, setForumPending] = useState(false);

    const likedForumIds = new Set((likes || []).map(like => like.forum_id));

    useEffect(() => {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", "Bearer " + jwtToken);

        const requestOptions = {
            method: "GET",
            headers: headers,
        }

        fetch(`https://alumnihub.site/forums`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setForums(data);
                setFilteredForums(data);
                setNewForum(false);
                setNewComment(false);
            })
            .catch(err => {
                console.log(err);
            })

        fetch(`https://alumnihub.site/likes`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setLikes(data);
                setNewLike(false);
            })
            .catch(err => {
                console.log(err);
            })

    }, [jwtToken, newForum, newLike, newComment]);

    const handleSearch = (event) => {
        const value = event.target.value.toLowerCase();
        setSearchTerm(value);
        filterData(value);
    };

    const filterData = (term) => {
        const filtered = forums.filter(forum => {
            const userName = forum.user_name ? forum.user_name.toLowerCase() : ''; // Pastikan ada nilai sebelum melakukan toLowerCase()
            const forumText = forum.forum_text ? forum.forum_text.toLowerCase() : ''; // Pastikan ada nilai sebelum melakukan toLowerCase()
    
            return userName.includes(term.toLowerCase()) || forumText.includes(term.toLowerCase());
        });
        setFilteredForums(filtered);
    };
    
    const handleChange = (type) => (event) => {
        const { name, value } = event.target;

        if (type === "forum") {
            setForum({
                ...forum,
                [name]: value,
            });
        } else if (type === "comment") {
            setComment({
                ...comment,
                [name]: value,
            });
        } else {
            console.log("error occured");
        }
    }

    const handlePostSubmit = (event) => {
        event.preventDefault();

        setForumPending(true);

        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", "Bearer " + jwtToken);

        const requestBody = forum;

        const requestOptions = {
            body: JSON.stringify(requestBody),
            method: "POST",
            headers: headers,
            credentials: "include",
        }

        fetch(`https://alumnihub.site/forums/create`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    console.log(data.error);
                    setForumPending(false);
                } else {
                    setNewForum(true);
                    setForum({});
                    setForumPending(false);
                }
            })
            .catch(err => {
                console.log(err);
                setForumPending(false);
            })
    }

    const handleLike = (id) => (event) => {
        event.preventDefault();

        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", "Bearer " + jwtToken);

        const requestBody = forum;

        const requestOptions = {
            body: JSON.stringify(requestBody),
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

    return(
        <>
            <div className="flex flex-col xl:grid xl:grid-cols-3 gap-4 mb-8">
                <div className="xl:col-span-2 flex flex-col gap-4">
                    <h2 className="text-lg font-bold">Timeline</h2>
                    {/* <pre>{JSON.stringify(likes, null, 3)}</pre> */}
                    {/* <pre>{JSON.stringify(forums, null, 3)}</pre> */}
                    {/* <pre>{likedForumIds}</pre> */}
                    <div className="flex flex-col border shadow rounded-xl bg-white p-4 font-medium">
                        <form onSubmit={handlePostSubmit}>
                            <textarea 
                                name="forum_text"
                                className="w-full border-0 border-b border-b-transparent resize-none overflow-hidden p-0 mb-3 focus:ring-0 focus:border-b-gray-300"
                                placeholder="Bagikan sesuatu!"
                                onChange={handleChange("forum")}
                                value={forum.forum_text || ""}
                            ></textarea>
                            <div className="flex justify-between">
                                <button type="submit" className={`${forumPending ? 'animate-pulse cursor-not-allowed bg-red-400' : ''} py-2 px-3 bg-red-500 text-white text-sm rounded-md`} disabled={forumPending}>
                                    Posting
                                </button>
                            </div>
                        </form>
                    </div>
                    {!forums || forums.length === 0 ? (
                        <div className="flex flex-col w-full h-64 justify-center items-center text-gray-400">
                            <div className="text-6xl mb-2"><PiNewspaperClippingFill /></div>
                            <div className="text-2xl font-bold">Belum ada kabar terbaru.</div>
                        </div>
                    ) : !filteredForums || filteredForums.length === 0 ? (
                        <div className="flex flex-col w-full h-64 justify-center items-center text-gray-400">
                            <div className="text-6xl mb-2"><PiNewspaperClippingFill /></div>
                            <div className="text-2xl font-bold">Forum tidak ditemukan.</div>
                        </div>
                    ) : (
                        <>
                        {filteredForums.map((q) => (
                            <div className="flex flex-col gap-3 border shadow rounded-xl bg-white p-4 font-normal" key={q.id}>
                                <div className="flex gap-2 items-center">
                                    {q.user_photo ? (
                                        <img src={'https://alumnihub.site/' + q.user_photo} className="object-cover w-10 h-10 rounded-full" alt="Profile" />
                                    ) : (
                                        <svg className="w-10 h-10 text-black hover:text-gray-700 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a9 9 0 0 0 5-1.5 4 4 0 0 0-4-3.5h-2a4 4 0 0 0-4 3.5 9 9 0 0 0 5 1.5Zm3-11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                                        </svg>
                                    )}
                                    <div className="flex flex-col">
                                        {q.user_name ? (
                                            <Link to={`/profile/${q.user_username}`} className="font-semibold">{q.user_name} <span className="text-sm font-light">@{q.user_username}</span></Link>
                                        ) : (
                                            <Link to={`/profile/${q.user_username}`} className="font-semibold">{q.user_username}</Link>
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
                                    <div onClick={() => handleAddComment(q.id)} className="flex items-center gap-1.5 text-xl text-gray-500 hover:text-red-500 cursor-pointer">
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
                                            {c.user_photo ? (
                                                <img src={c.user_photo} className="object-cover w-8 h-8 rounded-full" alt="Profile" />
                                            ) : (
                                                <svg className="w-8 h-8 text-black hover:text-gray-700 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a9 9 0 0 0 5-1.5 4 4 0 0 0-4-3.5h-2a4 4 0 0 0-4 3.5 9 9 0 0 0 5 1.5Zm3-11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                                                </svg>
                                            )}
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
                                                    id="reply"
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
                <div className="hidden xl:flex xl:flex-col xl:col-span-1 gap-4">
                    <h2 className="text-lg font-bold">Populer</h2>
                    <form className="hidden md:flex items-center">
                        <div className="flex items-center w-full border px-3 rounded-md shadow-sm">
                            <ImSearch className="text-gray-400" />
                            <input id="search" type="text" className="border-0 text-sm focus:border-0 focus:ring-0" placeholder="Search..." value={searchTerm} onChange={handleSearch} />
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Forums;