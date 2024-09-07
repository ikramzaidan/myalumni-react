import { Link, useOutletContext } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { PiNewspaperClippingFill } from "react-icons/pi";
import { TbEdit } from "react-icons/tb";
import { IoAdd } from 'react-icons/io5';

const Articles = () => {
    const { jwtToken } = useOutletContext();
    const { isAdmin } = useOutletContext();
    const [articles, setArticles] = useState([]);

    useEffect( () => {
        if (jwtToken !== "") {
            
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Authorization", "Bearer " + jwtToken);

            const requestOptions = {
                method: "GET",
                headers: headers,
            }

            fetch(`https://alumnihub.site/articles`, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    setArticles(data)
                })
                .catch(err => {
                    console.log(err);
                })
        }

    }, [jwtToken]);

    const formatIndonesianDate = (isoDateString) => {
        const date = new Date(isoDateString);
    
        const optionsDate = { year: 'numeric', month: 'long', day: 'numeric' };
    
        const formattedDate = date.toLocaleDateString('id-ID', optionsDate);
    
        return `${formattedDate}`;
    };

    return (
        <>
            <div className="flex justify-between items-center w-full mb-5">
                <h2 className="text-lg font-bold">Artikel</h2>
                { isAdmin ? (
                    <Link to="/articles/create" className="bg-white hover:bg-gray-50 border p-1.5 rounded-md text-xl text-black shadow-md" title="Buat Artikel Baru"><IoAdd className="stroke-w-4" /></Link>
                ) : ("") }
            </div>

            {!articles || articles.length === 0 ? (
                <div className="flex flex-col w-full h-64 justify-center items-center text-gray-400">
                    <div className="text-6xl mb-2"><PiNewspaperClippingFill /></div>
                    <div className="text-2xl font-bold">Belum ada Artikel.</div>
                </div>
            ) : (
                <>
                { isAdmin ? (
                    <div className="flex flex-col gap-4">
                        {articles.map((a) => (
                        <div key={a.id} className="border rounded-xl shadow-md p-4">
                            <div className="flex flex-col sm:grid sm:grid-cols-9 gap-4">
                                <div className="sm:col-span-3 xl:col-span-1">
                                    <img src={a.image ? a.image : "https://alumnihub.site/public/no-image.png"} className="aspect-[16/9] xl:aspect-square object-cover rounded-lg" alt={a.title}></img>
                                </div>
                                <div className="sm:col-span-6 xl:col-span-7 flex flex-col justify-center">
                                    <div className="text-xs text-orange-500 font-medium capitalize mb-0">{a.status}</div>
                                    <Link to={`/articles/${a.slug}`}><h3 className="text-xl font-bold line-clamp-1 capitalize mb-0.5">{a.title}</h3></Link>
                                    <p className="text-sm line-clamp-3 md:line-clamp-2 xl:line-clamp-1 text-justify">{a.body.replace(/<[^>]+>/g, '')}</p>
                                </div>
                                <div className="hidden xl:col-span-1 xl:flex items-center xl:justify-center">
                                    <Link to={`/articles/${a.id}/edit`} className="flex" title="Edit">
                                        <TbEdit className="text-xl" />
                                    </Link>
                                </div>
                            </div>
                        </div>))}
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {articles.filter(a => a.status === 'published').map((a) => (
                        <div key={a.id} className="border rounded-xl shadow-md p-4">
                            <div className="flex flex-col md:grid md:grid-cols-12 gap-4">
                                <div className="md:col-span-4 xl:col-span-2">
                                    <img src={a.image ? a.image : "https://alumnihub.site/public/no-image.png"} className="aspect-[16/9] xl:aspect-square object-cover rounded-lg" alt={a.title}></img>
                                </div>
                                <div className="md:col-span-8 xl:col-span-10 flex flex-col justify-start pe-3">
                                    <Link to={`/articles/${a.slug}`}><h3 className="text-xl font-bold line-clamp-1 capitalize">{a.title}</h3></Link>
                                    <div className="text-xs text-gray-400 font-medium capitalize mb-2">{formatIndonesianDate(a.published_at)}</div>
                                    <p className="text-sm line-clamp-3 md:line-clamp-2 xl:line-clamp-3 text-justify">{a.body.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ')}</p>
                                </div>
                            </div>
                        </div>))}
                    </div>
                ) }
                    
                </>
            )}
        </>
    );
}

export default Articles;