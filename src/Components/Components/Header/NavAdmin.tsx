import { NavLink  } from 'react-router-dom'

interface Props {
    
}

export const NavAdmin = (props: Props) => {
    return (
        <nav>
            <ul className="flex flex-wrap w-4/5 justify-between m-auto pt-4 mb-12">
                <li>
                    <NavLink  to="/account">HOME</NavLink >
                </li>
                <li>
                    <NavLink  to ="/admin">ADMIN</NavLink >
                </li>
            </ul>
        </nav>
    )
}
