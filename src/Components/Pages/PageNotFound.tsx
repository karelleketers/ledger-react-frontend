import { Link } from 'react-router-dom';
import FourOhFour from './../../assets/images/404.png';

interface Props {
    
}

export const PageNotFound = (props: Props) => {
    return (
        <div className='w-full flex flex-wrap'>
            <div className='m-auto w-3/4'>
                <img className="w-full" src={FourOhFour} alt="404" />
            </div>
            <div className='w-full flex '>
                <Link className="inline-block px-4 rounded-full bg-light hover:bg-opacity-70 transition-300 py-2 m-auto text-mdgreen font-nunitoblack" to="/">GO BACK</Link>
            </div>
            
        </div>
    )
}
