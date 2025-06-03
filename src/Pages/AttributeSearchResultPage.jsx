import Navbar from "../components/Navbar";
import Result from "../components/AttributeSearchPage/Result";
import Footer from "../components/Footer";

function ResultPage() {
    return (
        <>
            <Navbar />
            <div className="">
                <Result />
            </div>
            <Footer position="lg:fixed" />
        </>
    )
}

export default ResultPage;