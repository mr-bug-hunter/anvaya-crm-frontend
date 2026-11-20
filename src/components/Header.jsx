import "./Header.css"
import { Link } from "react-router-dom"

const Header = ()=>{
    return(
        <>
        <header>
            <div className="header">
                <a href="/" >
                    <h1 className="logo">
                    Anvaya CRM
                </h1>
                </a>
            </div>
        </header>
        </>
    )
}

export default Header