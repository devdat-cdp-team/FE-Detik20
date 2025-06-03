import logo from '../assets/thumb-1585190130detikcom_logo_png.png';

function Footer(props) {
    const { position } = props;

    return (
        <>
            <div className={`p-5 bg-white xxs:py-3 ${ position } xxs:w-full lg:bottom-0`}>
                <hr />
                <div className="flex justify-center items-center font-bold text-color-2 lg:text-lg">
                    <p>part of</p>
                    <div className='xxs:w-[80px] xxs:mt-0.5 xxs:ml-1 lg:w-[90px] lg:mt-1 lg:ml-1'>
                        <span><img src={ logo } alt={ logo } /></span>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Footer;