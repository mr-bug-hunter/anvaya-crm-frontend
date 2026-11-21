import { useEffect, useState } from "react"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import "./Dashboard.css";

const Dashboard = () => {
    const [stats, setStats] = useState({}) // Data save karne ke liye
    const [recentLeads, setRecentLeads] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const statsRes = await axios.get("https://anvaya-crm-backend-lyart.vercel.app/report/pipeline")
                setStats(statsRes.data)

                const leadsRes = await axios.get("https://anvaya-crm-backend-lyart.vercel.app/leads")
                setRecentLeads(leadsRes.data.slice(0, 3)) //only first 3 leads
                setLoading(false)
            } catch (error) {
                console.log("Error in fetching dashboard...", error)
                setLoading(false)
            }
        }
        fetchStats()
    }, [])

    if(loading)return <h2>Loading Dashboard...</h2>
    
    return(
<div className="dashboard-container">
    <h1>Avanya CRM Dashboard</h1>
   
   <div className="dash-section">
        <h3>Recent Leads</h3>
    <div className="recent-leads">
        {recentLeads.length === 0 ? <p>No leads found.</p> : (
            recentLeads.map(lead => (
                <div key={lead._id} className="recent-lead-card" onClick={() => navigate(`/leads/${lead._id}`)} >
                    <h4>{lead.name}</h4>
                    <p>Status: {lead.status}</p>
                </div>
            ) )
        ) }
    </div>
    </div>

    <div className="dash-section">
        <h3>Leads Status Overview</h3>
        <ul className="status-list">
            <li onClick={()=> navigate(`/leads?status=New`)}>
                New: <strong>{stats["New"] || 0} </strong>Leads
            </li>
            <li onClick={() => navigate(`/leads?status=Contacted`)}>
                Contacted: <strong>{stats["Contacted"] || 0} </strong>Leads
            </li>
            <li onClick={() => navigate(`/leads?status=Qualified`)}>
                Qualified: <strong>{stats["Qualified"] || 0 } </strong>Leads
            </li>
            <li onClick={()=> navigate(`/leads?status=Proposal Sent`)}>
                Proposal Sent: <strong>{stats["Proposal Sent"] || 0 } </strong> Leads
            </li>
            <li onClick={()=> navigate(`/leads?status=Closed`)}>
                Closed: <strong>{stats["Closed"] || 0 } </strong>Leads
            </li>
        </ul>
    </div>

    <div className="dash-section">
        <h3>Quick Filter</h3>
        <div className="quick-actions">
            <button onClick={()=> navigate("/leads?status=New")} className="filter-btn">Filter: New</button>
        </div>
        <button onClick={()=> navigate("/leads?status=Contacted")} className="filter-btn">Filter: Contacted</button>
    </div>
</div>
    )
}

export default Dashboard