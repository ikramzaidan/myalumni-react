import { Link, useOutletContext } from 'react-router-dom';
import Image from '../../images/image-1.jpg';
import { useEffect, useState } from 'react';
import { PiNewspaperClippingFill } from "react-icons/pi";
import { TbEdit } from "react-icons/tb";

const Articles = () => {
    const [articles, setArticles] = useState([]);
    const { jwtToken } = useOutletContext();

    useEffect( () => {
        if (jwtToken !== "") {
            
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Authorization", "Bearer " + jwtToken);

            const requestOptions = {
                method: "GET",
                headers: headers,
            }

            fetch('/articles', requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    setArticles(data)
                })
                .catch(err => {
                    console.log(err);
                })
        }

    }, [jwtToken]);

    return (
        <>
            <div className="flex justify-between items-center w-full mb-5">
                <h2 className="text-lg font-bold">Articles</h2>
                <Link to="/articles/create" className="flex items-center bg-black hover:bg-gray-800 py-2 px-2 rounded-md text-xs font-semibold text-white">Create new</Link>
            </div>

            {!articles || articles.length === 0 ? (
                <div className="flex flex-col w-full h-64 justify-center items-center text-gray-400">
                    <div className="text-6xl mb-2"><PiNewspaperClippingFill /></div>
                    <div className="text-2xl font-bold">Belum ada Artikel.</div>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {articles.map((a) => (
                    <div key={a.id} className="border rounded-xl shadow-md p-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="w-full sm:w-1/3 xl:w-1/12">
                                <img src={Image} className="aspect-[16/9] xl:aspect-square object-cover rounded-lg" alt={a.title}></img>
                            </div>
                            <div className="w-full sm:w-2/3 xl:w-10/12 flex flex-col justify-center">
                                <div className="text-xs text-orange-500 font-medium capitalize mb-0">{a.status}</div>
                                <Link to={`/articles/${a.id}`}><h3 className="text-xl font-bold line-clamp-1 capitalize mb-0.5">{a.title}</h3></Link>
                                <p className="text-sm line-clamp-3 md:line-clamp-2 xl:line-clamp-1 capitalize">{a.body.replace(/<[^>]+>/g, '')}</p>
                            </div>
                            <div className="hidden xl:w-1/12 xl:flex items-center xl:justify-center">
                                <Link to={`/articles/${a.id}/edit`} className="flex" title="Edit">
                                    <TbEdit className="text-xl" />
                                </Link>
                            </div>
                        </div>
                    </div>))}
                </div>
            )}
        </>
    );
}

export default Articles;