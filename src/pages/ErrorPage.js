import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
    const error = useRouteError();
    
    return (
        <div className="flex flex-col w-full h-screen text-center py-32">
            <h1 className="text-4xl font-bold mb-5">Oops!</h1>
            <p className="text-xl font-semibold">Sorry, an error has occured.</p>
            <p className="text-red-500">
                <em>{ error.statusText || error.message }</em>
            </p>
        </div>
    );
}

