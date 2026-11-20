import { useEffect, useState } from "react"
import "./StatusView.css"
import axios from "axios"
import { Link } from "react-router-dom"

const StatusView = ()=>{

    const [leads, setLeads] = useState([])
    const [agents, setAgents] = useState([])
    const [loading, setLoading] = useState(true)

    const [filterAgent, setFilterAgent] = useState("")
    const [filterPriority, setFilterPriority] = useState("")
    const [sortBy, setSortBy] = useState("")

    const status = ["New", "Contacted", "Qualified", "Proposal Sent", "Closed"]

    useEffect(()=> {
        const fetchData = async ()=>{
            try{
                const leadsRes = await axios.get("https://anvaya-crm-frontend-snowy.vercel.app/leads")
                setLeads(leadsRes.data)

                const agentsRes = await axios.get("https://anvaya-crm-frontend-snowy.vercel.app/agents")
                setAgents(agentsRes.data)
                setLoading(false)
            }catch(error){
                console.log("Error in fetching Status...", error)
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if(loading) return <h2>Loading Status Board... </h2>

    let processLeads = [...leads]

    if(filterAgent){
        processLeads = processLeads.filter(lead => lead.salesAgent && lead.salesAgent._id === filterAgent)
    }
    if(filterPriority){
        processLeads = processLeads.filter(lead => lead.priority === filterPriority)
    }

    if(sortBy === "timeToClose"){
        processLeads.sort((a, b) => a.timeToClose - b.timeToClose)
    } else if (sortBy === "priority"){
        const level = {High: 3, Medium: 2, Low: 1}
        processLeads.sort((a, b)=> level[b.priority] - level[a.priority])
    }

    return(
        <div className="status-view-container">
            <Link to="/leads" className="back-link"> ← Back to Leads</Link>
            <div className="status-header">
                <h2>Leads by Status</h2>
            </div>
            
            <div className="status-filters">
                <select value={filterAgent} onChange={(e)=> setFilterAgent(e.target.value)}>
                    <option value="">All Agents</option>
                    {agents.map(agent => (
                        <option key={agent._id} value={agent._id}>{agent.name}</option>
                    ))}
                </select>

                <select value={filterPriority} onChange={(e)=> setFilterPriority(e.target.value)}>
                    <option value="">All Priorities</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                </select>

                <select value={sortBy} onChange={(e)=> setSortBy(e.target.value)}>
                    <option value="">Sort By</option>
                    <option value="timeToClose">Time to Close</option>
                    <option value="priority">Priority</option>
                </select>
            </div>

            <div className="status-board">
                {status.map(statusBoard=> {
                    const leadsStatus = processLeads.filter(lead => lead.status === statusBoard)
                    return(
                        <div key={statusBoard} className="status-column">
                            <div className="column-header">
                                <h3>{statusBoard}</h3>
                                <span>{leadsStatus.length}</span>
                            </div>
                            
                            <div className="column-body">
                                {leadsStatus.length === 0 ? (
                                    <p className="empty-text">No leads here.</p>
                                ): (
                                    leadsStatus.map(lead => (
                                    <div key={lead._id} className="card">
                                        <h4>{lead.name}</h4>
                                        <p><strong>Agent:</strong> {lead.salesAgent ? lead.salesAgent.name : "Unassigned"} </p>
                                        <p> <strong>Priority: </strong>
                                            <span className={`priority-${lead.priority.toLowerCase()}`}>
                                                {lead.priority} 
                                                </span>
                                            </p>
                                    </div>
                                ))
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default StatusView