import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import Input from '../../components/Input';
import { useEffect, useState } from 'react';
import slugify from 'slugify';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from 'ckeditor5-custom-build/build/ckeditor';
import classNames from 'classnames';

const EditArticle = () => {
    const { jwtToken } = useOutletContext();
    const [errors, setErrors] = useState([]);
    const [article, setArticle] = useState({});
    const [articleBody, setArticleBody] = useState({});
    const [isSwitched, setIsSwithed] = useState("");
    let { id } = useParams();
    const navigate = useNavigate();

    const handleChange = (fieldName) => (event) => {
        const { value } = event.target;

        if (fieldName === "title") {
            const slugValue = slugify(value, { lower: true });
            setArticle({
                ...article,
                [fieldName]: value,
                slug: slugValue
            });
        } else if (fieldName === "body") {
            setArticleBody({
                [fieldName]: value
            });
        } else {
            setArticle({
                ...article,
                [fieldName]: value
            });
        }
    };

    const hasError = (key) => {
        return errors.indexOf(key) !== -1;
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        let errors = [];
        let required = [
            { field: article.title, name: "title" },
            { field: article.body, name: "body" },
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

        const requestBody = { ...article, ...articleBody };

        const requestOptions = {
            body: JSON.stringify(requestBody),
            method: "PATCH",
            headers: headers,
            credentials: "include",
        }

        fetch(`https://alumnihub.site/articles/${id}`, requestOptions)
            .then((response) => {if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();})
            .then((data) => {
                if (data.error) {
                    console.log(data.error);
                } else {
                    navigate('/articles');
                }
            })
            .catch(err => {
                console.log(err);
            })
    }

    const handleDelete = () => {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", "Bearer " + jwtToken)

        const requestOptions = {
            method: "DELETE",
            headers: headers,
        }

        fetch(`https://alumnihub.site/articles/${id}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    console.log(data.error);
                } else {
                    navigate("/articles");
                }
            })
            .catch(err => {console.log(err)});
    }

    const imageUploadAdapter = (loader) => {
        return {
            upload : () => {
                return new Promise((resolve, reject) => {
                    const body = new FormData();
                    loader.file.then((file) => {
                        body.append("image", file);

                        const headers = new Headers();
                        headers.append("Authorization", "Bearer " + jwtToken);

                        const requestOptions = {
                            body: body,
                            method: "POST",
                            headers: headers,
                            credentials: "include",
                        }

                        fetch(`https://alumnihub.site/upload_image`, requestOptions)
                        .then((response => response.json()))
                        .then((data) => {
                            if (data.error) {
                                console.log(data.error);
                            } else {
                                resolve({ default: `https://alumnihub.site/${data.file_path}` });
                            }
                        })
                        .catch(err => {
                            reject(err);
                        })
                    })
                });
            }
        }
    }

    function imageUploadPlugin( editor ) {
        editor.plugins.get( 'FileRepository' ).createUploadAdapter = ( loader ) => {
            // Configure the URL to the upload script in your back-end here!
            return imageUploadAdapter( loader );
        };
    }
    
    const handleStatusChange = () => {
        if (isSwitched && article.status === "published") {
            setArticle({
                ...article,
                status: "draft"
            });
            setIsSwithed(false);
        } else {
            setArticle({
                ...article,
                status: "published"
            });
            setIsSwithed(true);
        }
    };

    useEffect(() => {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", "Bearer " + jwtToken);

        const requestOptions = {
            method: "GET",
            headers: headers,
        }

        fetch(`https://alumnihub.site/articles/${id}/show`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setArticle(data);
                setIsSwithed(data.status === "published" ? true : false);
            })
            .catch(err => {
                console.log(err);
            })

    }, [id, jwtToken]);

    return (
        <>
            <div className="flex justify-between items-center w-full mb-5">
                <h2 className="text-lg font-bold">Artikel</h2>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="flex justify-between items-center gap-2.5 border rounded-xl shadow-md px-5 py-3 mb-3">
                    <div className="flex items-center gap-3">
                        <div onClick={handleStatusChange}
                            className={classNames("flex h-6 w-12 rounded-full outline-none p-[0.1rem] transition-all duration-300", {
                                "bg-blue-400": isSwitched,
                                "bg-gray-200": !isSwitched
                            })}>
                            <span className={classNames("h-full aspect-square rounded-full bg-white transition-all duration-300", {
                                "ml-6": isSwitched
                            })}></span>
                        </div>
                        <label className="font-semibold">{article.status === "draft" ? "Draft" : "Publish"}</label>
                    </div>
                    <div className="flex gap-2">
                        <button type="button" onClick={handleDelete} className="py-2 px-3 bg-red-700 hover:bg-red-800 rounded text-center text-white text-sm font-semibold">Delete</button>
                        <button type="submit" className="py-2 px-3 bg-black hover:bg-gray-800 rounded text-center text-white text-sm font-semibold">Simpan</button>
                    </div>
                </div>
                <div className="w-full border rounded-xl shadow-md p-5">
                    {/* <pre>{JSON.stringify(article, null, 3)}</pre> */}
                    <Input
                        type="text"
                        name="title"
                        placeHolder="Judul Berita"
                        className="w-full text-2xl px-3 py-2 border-0 bg-white focus:bg-gray-50 border-b-2 border-gray-300 focus:border-blue-400 focus:ring-0 focus:outline-0 focus:shadow-[rgb(96,165,250)_0px_15px_15px_-15px]"
                        onChange={handleChange("title")}
                        errorMsg={hasError("title") ? "Please enter a title" : ""}
                        value={article.title}
                    />
                    <div className="flex flex-col mt-6 mb-5">
                        <CKEditor
                            name="body"
                            config={{
                                extraPlugins: [imageUploadPlugin]
                            }}
                            editor={ ClassicEditor }
                            data={article.body}
                            onReady={(editor) => {
                                editor.editing.view.change((writer) => {
                                writer.setStyle(
                                    "min-height",
                                    "200px",
                                    editor.editing.view.document.getRoot()
                                );
                                });
                            }}
                            onChange={ ( event, editor ) => {
                                const data = editor.getData();
                                handleChange("body")({target: {value: data}});
                            } }
                        />
                    </div>
                </div>
            </form>
        </>
    );
}

export default EditArticle;