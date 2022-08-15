import { useApolloClient } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import {ReactComponent as LogoutIcon} from './../../../assets/images/power.svg';

export const NavAdmin = () => {
    const client = useApolloClient();
    const navigate = useNavigate();
    const handleLogout = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        localStorage.clear();
        client.clearStore();
        navigate('/login')
      };

    return (
        <nav className='h-12 w-full flex flex-wrap'>
            <div className='w-4/5 md:w-90 pl-1/5 md:pl-1/10 flex justify-center'>
            <ul className="bg-light rounded-b-full w-3/5 xl:w-2/5 flex flex-wrap justify-center">
                <li className='text-dark mt-2 font-nunitoblack text-xl md:text-2xl'>ADMIN</li>
            </ul>
            </div>
            <div className='flex-1 mt-2 mr-4 flex justify-end'>
                <button onClick={handleLogout}>
                    <LogoutIcon className="fill-dark min-w-[1.5rem] w-6 h-6 opacity-60 hover:opacity-100 duration-300"/>
                </button>
            </div>
        </nav>
    )
}
