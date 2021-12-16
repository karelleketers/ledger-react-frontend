import { NavLink  } from 'react-router-dom'

interface Props {
    
}

export const NavLoggedOut = (props: Props) => {
    return (
    <nav>
        <ul className="flex flex-wrap w-4/5 justify-between m-auto pt-4 mb-12">
            <li>
                <NavLink  to="/">HOME</NavLink >
            </li>
            <li>
                <NavLink  to="/login">LOGIN</NavLink >
            </li>
            <li>
                <NavLink  to="/register">REGISTER</NavLink >
            </li>
        </ul>
    </nav>
    )
}
