import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";

const Article = () => {
    const { jwtToken } = useOutletContext();
    const [article, setArticle] = useState({});
    let { slug } = useParams();

    // Get data artikel pertama kali load
    useEffect(() => {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", "Bearer " + jwtToken);

        const requestOptions = {
            method: "GET",
            headers: headers,
        }

        fetch(`https://alumnihub.site/articles/${slug}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setArticle(data);
            })
            .catch(err => {
                console.log(err);
            })

    }, [slug, jwtToken]);

    const formatIndonesianDate = (isoDateString) => {
        const date = new Date(isoDateString);
        date.setHours(date.getHours() - 7);
    
        const optionsDate = { year: 'numeric', month: 'long', day: 'numeric' };
        const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: false };
    
        const formattedDate = date.toLocaleDateString('id-ID', optionsDate);
        const formattedTime = date.toLocaleTimeString('id-ID', optionsTime);
    
        return `${formattedDate} ${formattedTime}`;
    };

    return(
        <>
            <div className="flex justify-between items-center w-full mb-5">
                <h2 className="text-lg font-bold">Artikel</h2>
            </div>
            <div className="w-full border rounded-xl shadow-md p-5">
                <h2 className="text-2xl font-bold mb-1">{article.title}</h2>
                <div className="text-gray-500 text-xs font-normal mb-5">{article.status === "published" ? `Diposting pada ${formatIndonesianDate(article.published_at)} WIB` : "Draf"}</div>
                <div className="article-content" dangerouslySetInnerHTML={{ __html: article.body }}></div>
            </div>
        </>
    );
}

export default Article;