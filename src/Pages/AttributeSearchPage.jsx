import Navbar from "../components/Navbar";
import AttributeSearchForm from "../components/AttributeSearchPage/AttributeSearchForm";
import Footer from "../components/Footer";

function AttributeSearchPage() {
    return (
        <>
            <Navbar />
            <div className="">
                <AttributeSearchForm />
            </div>
            <Footer position="lg:fixed" />
        </>
    )
}

export default AttributeSearchPage;