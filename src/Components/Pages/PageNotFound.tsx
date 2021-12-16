import { Link } from 'react-router-dom'

interface Props {
    
}

export const PageNotFound = (props: Props) => {
    return (
        <div>
            PAGE NOT FOUND

            <Link to="/">GO BACK</Link>
        </div>
    )
}
