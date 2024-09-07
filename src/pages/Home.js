import { useEffect, useState } from "react";
import { IoChatbubbleOutline, IoHeart, IoHeartOutline } from "react-icons/io5";
import { PiNewspaperClippingFill, PiStudentBold } from "react-icons/pi";
import { Link, useOutletContext } from "react-router-dom";
import DateTimeDisplay from "../components/DateTimeDisplay";
import { FaUserPlus, FaUserXmark, FaUsers } from "react-icons/fa6";

const Home = () => {
    const { isAdmin } = useOutletContext();
    const { jwtToken } = useOutletContext();
    const [dashboard, setDashboard] = useState({});
    const [articles, setArticles] = useState([]);
    const [forums, setForums] = useState([]);
    const [likes, setLikes] = useState([]);

    const [newLike, setNewLike] = useState(false);

    const likedForumIds = new Set((likes || []).map(like => like.forum_id));

    useEffect(() => {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", "Bearer " + jwtToken);

        const requestOptions = {
            method: "GET",
            headers: headers,
        }

        if (isAdmin) {
            fetch(`https://alumnihub.site/dashboard`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setDashboard(data);
            })
            .catch(err => {
                console.log(err);
            })
        }

        fetch(`https://alumnihub.site/forums`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setForums(data);
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

        fetch(`https://alumnihub.site/articles`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setArticles(data)
            })
            .catch(err => {
                console.log(err);
            })

    }, [jwtToken, isAdmin, newLike]);

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

    const formatIndonesianDate = (isoDateString) => {
        const date = new Date(isoDateString);
    
        const optionsDate = { year: 'numeric', month: 'long', day: 'numeric' };
    
        const formattedDate = date.toLocaleDateString('id-ID', optionsDate);
    
        return `${formattedDate}`;
    };

    return(
        <>
            { !isAdmin ? (
            <>
                <div className="flex flex-col xl:grid xl:grid-cols-3 gap-4 mb-8">
                    <div className="xl:col-span-2 flex flex-col gap-4">
                        <h2 className="text-lg font-bold">Timeline</h2>
                        {!forums || forums.length === 0 ? (
                            <div className="flex flex-col w-full h-64 justify-center items-center text-gray-400">
                                <div className="text-6xl mb-2"><PiNewspaperClippingFill /></div>
                                <div className="text-2xl font-bold">Belum ada kabar terbaru.</div>
                            </div>
                        ) : (
                            <>
                            {forums.map((q) => (
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
                                        <div className="flex items-center gap-1.5 text-xl text-gray-500 hover:text-blue-500">
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
                                </div>
                            ))}
                            </>
                        )}
                    </div>
                    <div className="hidden xl:flex xl:flex-col xl:col-span-1 gap-4">
                        <h2 className="text-lg font-bold">Berita</h2>
                        {!articles || articles.length === 0 ? (
                            <div className="flex flex-col w-full h-64 justify-center items-center text-gray-400">
                                <div className="text-6xl mb-2"><PiNewspaperClippingFill /></div>
                                <div className="text-2xl font-bold">Belum ada Artikel.</div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {articles.filter(a => a.status === 'published').map((a) => (
                                <div key={a.id} className="border rounded-xl shadow-md p-4">
                                    <div className="flex flex-col gap-3">
                                        <div className="flex">
                                            <img src={a.image ? a.image : "https://alumnihub.site/public/no-image.png"} className="aspect-[16/9] object-cover rounded-lg" alt={a.title}></img>
                                        </div>
                                        <div className="flex flex-col justify-start pe-3">
                                            <Link to={`/articles/${a.id}`}><h3 className="text-xl font-bold line-clamp-1 capitalize">{a.title}</h3></Link>
                                            <div className="text-xs text-gray-400 font-medium capitalize">{formatIndonesianDate(a.published_at)}</div>
                                        </div>
                                    </div>
                                </div>))}
                            </div>
                        )}
                    </div>
                </div>
            </>
            ) : (
            <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="flex flex-col border shadow rounded-xl bg-white py-3 px-6">
                        <div className="flex justify-between items-center mb-0.5">
                            <div className="text-sm font-bold">Jumlah Alumni</div>
                            <div className=""><FaUsers /></div>
                        </div>
                        <div className="text-2xl font-bold">{dashboard.count_alumni}</div>
                    </div>
                    <div className="flex flex-col border shadow rounded-xl bg-white py-3 px-6 font-medium">
                        <div className="flex justify-between items-center mb-0.5">
                            <div className="text-sm font-bold">Sudah Registrasi</div>
                            <div className=""><FaUserPlus /></div>
                        </div>
                        <div className="text-2xl font-bold">{dashboard.count_alumni_account}</div>
                    </div>
                    <div className="flex flex-col border shadow rounded-xl bg-white py-3 px-6 font-medium">
                        <div className="flex justify-between items-center mb-0.5">
                            <div className="text-sm font-bold">Belum Registrasi</div>
                            <div className=""><FaUserXmark /></div>
                        </div>
                        <div className="text-2xl font-bold">{dashboard.count_alumni && dashboard.count_alumni_account ? dashboard.count_alumni - dashboard.count_alumni_account : 0}</div>
                    </div>
                </div>

                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">Alumni Baru</h2>
                    <Link className="text-gray-500 text-sm font-bold">Lihat semua</Link>
                </div>
                {!dashboard.profiles || dashboard.profiles === 0 ? (
                    <div className="flex flex-col w-full h-64 justify-center items-center text-gray-400">
                        <div className="text-6xl mb-2"><PiStudentBold /></div>
                        <div className="text-2xl font-bold">Belum ada Alumni.</div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 overflow-x-auto">
                        {dashboard.profiles.map((a) => (
                        <div className="flex flex-col border shadow rounded-xl bg-white p-4 items-center" key={a.id}>
                            <div className="bg-gray-300 rounded-full w-full h-auto aspect-square overflow-hidden border-white mb-3">
                                <img src={a.photo ? `https://alumnihub.site/${a.photo}` : "https://alumnihub.site/public/no-image.png"} className="object-cover w-full h-full" alt="Profile" />
                            </div>
                            <div className="font-medium mb-2 line-clamp-1">{a.user_name}</div>
                            <Link to={`/profile/${a.user_username}`} className="w-full bg-black py-2 px-3 rounded-md text-center text-xs font-semibold text-white">View Profile</Link>
                        </div>
                        ))}
                    </div>
                )}
            </>
            )}
        </>
    );
}

export default Home;