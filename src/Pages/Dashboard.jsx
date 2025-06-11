import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import image from "../assets/3556940.jpg";

function Dashboard() {
    return (
        <>
            <Navbar />

            <div className="grid grid-cols-2 xxs:mx-5 xxs:my-3 lg:mx-10 lg:my-10">
                <div className="">
                    <div className="text-color-1">
                        <p className="font-light text-6xl">WELCOME TO</p>
                        {/* <p className="text-9xl lg:mt-10">20DETIK</p> */}
                        <p className="text-[85px]">VIDEO ANALYTICS</p>
                    </div>

                    <div className="flex lg:mt-40">
                        <div className='text-center'>
                            <button className='home-button border border-color-1 rounded-full xxs:px-2 xxs:py-1 xxs:text-sm sm:px-4 sm:text-base lg:px-6 lg:py-2 lg:mr-3'><a href="/video-analysis">Video Analytics</a></button>
                        </div>
                        <div className='text-center'>
                            <button className='home-button border border-color-1 rounded-full xxs:px-2 xxs:py-1 xxs:text-sm sm:px-4 sm:text-base lg:px-6 lg:py-2 lg:ml-3'><a href="/attribute-search">Attribute Search</a></button>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center">
                    <div className="lg:w-[500px]">
                        <img src={ image } alt={ image } />
                    </div>
                </div>
            </div>

            {/* <Footer position="lg:fixed" /> */}
        </>
    )
}

export default Dashboard;