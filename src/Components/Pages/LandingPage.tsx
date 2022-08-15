import landing from './../../assets/images/landing.png';
import logo from './../../assets/images/ledger-ltwds.png';
import { Link } from 'react-router-dom';

interface Props {
    
}

export const LandingPage = (props: Props) => {
    return (
        <div className='xl:flex xl:flex-wrap content-evenly mx-auto'>
            <div className="self-start w-full mt-8">
                <Link to="/">
                    <img src={logo} alt="logo" className='w-40 m-auto'/>
                </Link>
            </div>
            <div className="w-full px-8 xl:flex xl:flex-wrap xl:justify-between">
                <img src={landing} alt="signup" className='xl:order-2 h-48 xl:h-auto xl:w-3/5 m-auto my-10 xl:mb-0 '/>
                <div className='w-full xl:w-1/3 flex content-end flex-wrap justify-center'>
                    <div className='w-full xl:mb-12 font-leaguespartan'>
                        <p className='w-full text-center py-1 text-xl text-dkgreen'>Be a hero</p>
                        <p className='w-full text-center text-dark text-2xl'>Save your money</p>
                        <p className='w-12 m-auto border-2 border-dark mt-2'></p>
                    </div>
                    <div className='w-full h-1/2'>
                        <p className='w-full text-center font-nunitoreg my-2'>Ledger is for everyone who cares about their budget.</p>
                        <p className='w-full text-center font-nunitoreg my-2'>Regardless of age. Regardless of where. Regardless of prior savings.</p>
                        <p className='w-full text-center font-nunitoreg my-2'>It's never too late to start being savvy with your money.</p>
                        <div className="w-full font-nunitoblack my-12 flex">
                            <Link to="/register" className='m-auto inline-block px-4 py-2 rounded-full text-mdgreen bg-light hover:bg-opacity-70 transition-300'>
                                Get started
                            </Link>
                        </div>
                    </div>
                </div>
            </div>  
        </div>
    )
}
