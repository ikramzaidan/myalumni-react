import { useEffect, useState } from "react";
import { Link, useOutletContext, useParams } from "react-router-dom";

const Article = () => {
    const { jwtToken } = useOutletContext();
    const [article, setArticle] = useState({});
    let { id } = useParams();

    // Get data artikel pertama kali load
    useEffect(() => {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", "Bearer " + jwtToken);

        const requestOptions = {
            method: "GET",
            headers: headers,
        }

        fetch(`http://localhost:8080/articles/${id}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setArticle(data);
            })
            .catch(err => {
                console.log(err);
            })

    }, [id, jwtToken]);

    return(
        <>
            <div className="flex justify-between items-center w-full mb-5">
                <h2 className="text-lg font-bold">Articles</h2>
                <Link to="/articles/create" className="flex items-center bg-black hover:bg-gray-800 py-2 px-2 rounded-md text-xs font-semibold text-white">Create new</Link>
            </div>
            <div className="w-full border rounded-xl shadow-md p-5">
                <h2 className="text-xl font-bold mb-3">{article.title}</h2>
                <div dangerouslySetInnerHTML={{ __html: article.body }}></div>
            </div>
        </>
    );
}

export default Article;