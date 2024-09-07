const Loading = () => {
    return(
        <>
            <div className="flex justify-center items-center h-screen bg-white px-6 md:px-0">
                <div className="relative inline-flex">
                    <div className="w-20 h-20 bg-red-400 rounded-full"></div>
                    <div className="w-20 h-20 bg-red-400 rounded-full absolute top-0 left-0 animate-ping"></div>
                    <div className="w-20 h-20 bg-red-400 rounded-full absolute top-0 left-0 animate-pulse"></div>
                </div>
            </div>
        </>
    );
}

export default Loading;