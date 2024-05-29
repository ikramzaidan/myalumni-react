const Home = () => {
    return(
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="border shadow rounded-xl bg-white p-6 font-medium">
                    Jumlah Alumni
                </div>
                <div className="border shadow rounded-xl bg-white p-6 font-medium">
                    Jumlah Kelas
                </div>
                <div className="border shadow rounded-xl bg-white p-6 font-medium">
                    Sudah Registrasi
                </div>
                <div className="border shadow rounded-xl bg-white p-6 font-medium">
                    Belum Registrasi
                </div>
            </div>

            <h2 className="text-lg font-bold mb-3">Alumni Baru</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <div className="flex flex-col border shadow rounded-xl bg-white p-6 text-center">
                    <div className="bg-gray-300 rounded-full w-full h-auto aspect-square mb-1"></div>
                    <div className="font-medium mb-2">Ikram Zaidan</div>
                    <a href="#!" className="bg-black py-2 px-3 rounded-md text-xs font-semibold text-white">View Profile</a>
                </div>
                <div className="flex flex-col border shadow rounded-xl bg-white p-6 text-center">
                    <div className="bg-gray-300 rounded-full w-full h-auto aspect-square mb-1"></div>
                    <div className="font-medium mb-2">Ikram Zaidan</div>
                    <a href="#!" className="bg-black py-2 px-3 rounded-md text-xs font-semibold text-white">View Profile</a>
                </div>
                <div className="flex flex-col border shadow rounded-xl bg-white p-6 text-center">
                    <div className="bg-gray-300 rounded-full w-full h-auto aspect-square mb-1"></div>
                    <div className="font-medium mb-2">Ikram Zaidan</div>
                    <a href="#!" className="bg-black py-2 px-3 rounded-md text-xs font-semibold text-white">View Profile</a>
                </div>
                <div className="flex flex-col border shadow rounded-xl bg-white p-6 text-center">
                    <div className="bg-gray-300 rounded-full w-full h-auto aspect-square mb-1"></div>
                    <div className="font-medium mb-2">Ikram Zaidan</div>
                    <a href="#!" className="bg-black py-2 px-3 rounded-md text-xs font-semibold text-white">View Profile</a>
                </div>
            </div>
        </>
    );
}

export default Home;