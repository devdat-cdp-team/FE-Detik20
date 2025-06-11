import Navbar from "../components/Navbar";
import VideoAnalyticsForm from "../components/VideoAnalyticsPage/VideoAnalyticsForm";
import Footer from "../components/Footer";

function VideoAnalyticsPage() {
    return (
        <div>
            <Navbar />
            <div className="flex justify-center">
                <VideoAnalyticsForm />
            </div>
            {/* <Footer position="xxs:fixed" /> */}
        </div>
    );
}

export default VideoAnalyticsPage;