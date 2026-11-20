import "./Sidebar.css"
import {Link} from "react-router-dom"

const Siderbar = ()=>{
    return(
        <div className="sidebar">
            <h2 className="sidebar-h1"> 
               <Link to="/" className="title-link"> 
               Anvaya Dashboard
                <p><i>Manage your leads</i></p>
               </Link>
                
            </h2>
            <ul className="sidebar-menu">
                <li><Link to="/leads">Leads</Link></li>
                <li><Link to="/agents">Agents</Link></li>
                <li><Link to="/reports">Reports</Link></li>
                <li><Link to="/settings">Settings</Link></li>
            </ul>
        </div>
    )
}

export default Siderbar