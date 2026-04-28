import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { useEffect } from 'react';
import { apiGet } from '../api/apiClient';

const Test = () => {
    const { jwtToken } = useOutletContext();
    const navigate = useNavigate();

    useEffect( () => {
        apiGet('/claims')
            .then((data) => {
                console.log(data)
            })
            .catch(err => {
                console.log(err);
            })

    }, [jwtToken, navigate]);

    return (
        <>
            <div className="flex justify-between items-center w-full mb-3">
                <h2 className="font-bold">Data Tes</h2>
                <Link to="/articles/create" className="bg-blue-500 py-2 px-3 rounded-md text-xs font-semibold text-white">Tambah Artikel</Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
                
            </div>
        </>
    );
}

export default Test;