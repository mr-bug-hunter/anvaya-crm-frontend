import { useEffect, useState } from "react"
import "./AgentView.css"
import axios from "axios"
import { Link } from "react-router-dom"

const AgentView = ()=>{

    const [leads, setLeads] = useState([])
    const [agents, setAgents] = useState([])
    const [loading, setLoading] = useState(true)

    const [filterStatus, setFilterStatus] = useState("")
    const [filterPriority, setFilterPriority] = useState("")
    const [sortBy, setSortBy] = useState("")


    useEffect(()=> {
        const fetchData = async ()=>{
            try{
                const leadsRes = await axios.get("http://localhost:5000/leads")
                setLeads(leadsRes.data)

                const agentsRes = await axios.get("http://localhost:5000/agents")
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

    if(filterStatus){
        processLeads = processLeads.filter(lead => lead.status === filterStatus)
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
                <h2>Leads by Sales Agent</h2>
            </div>
            
            <div className="status-filters">

                <select value={filterStatus} onChange={(e)=> setFilterStatus(e.target.value)}>
                    <option value="">All Status</option>
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Proposal Sent">Proposal Sent</option>
                    <option value="Closed">Closed</option>
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
                {agents.map(agentItem=> {
                    const leadsForAgent = processLeads.filter(lead => lead.salesAgent && lead.salesAgent._id === agentItem._id)
                    return(
                        <div key={agentItem._id} className="status-column">
                            <div className="column-header">
                                <h3>{agentItem.name}</h3>
                                <span>{leadsForAgent.length}</span>
                            </div>
                            
                            <div className="column-body">
                                {leadsForAgent.length === 0 ? (
                                    <p className="empty-text">No leads here.</p>
                                ): (
                                    leadsForAgent.map(lead => (
                                    <div key={lead._id} className="card">
                                        <h4>{lead.name}</h4>
                                        <p><strong>Status:</strong> {lead.status} </p>
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

export default AgentView