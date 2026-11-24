import "./LeadList.css"
import { useState, useEffect } from "react"
import axios from "axios"
import { useSearchParams, Link } from "react-router-dom"

const LeadList = ()=>{
    const [leads, setLeads] = useState([])
    const [agents, setAgents] = useState([])
    const [loading, setLoading] = useState(true)

    const [searchParams , setSearchParams] = useSearchParams()
    const currentStatus = searchParams.get("status") || ""
    const currentAgent = searchParams.get("salesAgent") || ""
    const currentSort = searchParams.get("sort") || ""
    const currentSource = searchParams.get("source") || ""
    const currentTags = searchParams.get("tags") || ""


    useEffect(()=>{
        const fetchAgents = async ()=> {
            try{
                const res = await axios.get("https://anvaya-crm-backend-lyart.vercel.app/agents")
                setAgents(res.data)
            }catch(error){
                console.log("Error fetching agents", error)
            }
        }
        fetchAgents()
    }, [])

    useEffect(()=>{
        const fetchLeads = async ()=>{
            setLoading(true)
            try{
                let url = "https://anvaya-crm-backend-lyart.vercel.app/leads?";
                if (currentStatus && currentStatus !== "All Status"){
                    url += `status=${currentStatus}&`
                }
                if (currentAgent && currentAgent !== "All Agents"){
                    url += `salesAgent=${currentAgent}&`
                }

                if(currentSource && currentSource !== "All Sources"){
                    url += `source=${currentSource}&`
                }
                if(currentTags){
                    url += `tags=${currentTags}&`
                }

                const response = await axios.get(url)
                let fetchedLeads = response.data;

                if(currentSort === "timeToClose"){
                    fetchedLeads.sort((a, b)=> a.timeToClose - b.timeToClose)
                }else if (currentSort === "priority"){
                    const weight = {High: 3, Medium: 2, Low: 1}
                    fetchedLeads.sort((a, b)=> weight[b.priority] - weight[a.priority])
                }
                setLeads(fetchedLeads)
                setLoading(false)
            }catch(error){
                console.log("Error in fetching leads... ", error)
                setLoading(false)
            }
        }
        fetchLeads()
    }, [currentStatus, currentAgent, currentSort, currentSource, currentTags])

    const handlefilterChange = (key, value)=> {
        const newParams = new URLSearchParams(searchParams)

        if(value === "All Status" || value === "All Agents" || value === "All Sources" || value === "" ){
            newParams.delete(key)
        }else{
            newParams.set(key, value)
        }
        setSearchParams(newParams)
    }

    if(loading) return <h2>Loading leads...</h2>

    return(
        <>
        <div className="lead-list-container">
            <div className="lead-header">
                <h2>All Leads</h2>
                <Link className="add-btn" to="/leads/add" > + Add New Lead</Link>
            </div>

            <div className="status" style={{marginBottom: "20px", paddingTop: "0px"}}>
                <Link to="/status-view" className="status-btn">View Leads Board</Link>
                <Link to="/agent-view" className="status-btn">View Agents Board</Link>
            </div>

            <div className="filter-section">

                <h3>Source:</h3>
                <select 
                    value={currentSource || "All Source"}
                    onChange={(e) => handlefilterChange("source", e.target.value)}>
                        <option value="All Sources">All Sources</option>
                        <option value="Website">Website</option>
                        <option value="Referral">Referral</option>
                        <option value="Cold Call">Cold Call</option>
                        <option value="Advertisement">Advertisement</option>
                        <option value="Email">Email</option>
                        <option value="Other">Other</option>
                    </select>

                    <h3>Tags:</h3>
                    <select 
                        value={currentTags || ""}
                        onChange={(e) => handlefilterChange("tags", e.target.value)}>
                        <option value="">All Tags</option>
                        <option value="High Value">High Value</option>
                        <option value="Follow-up">Follow-up</option>
                        </select>


                <h3>Status </h3>
                <select value={currentStatus || "All Status"}
                    onChange={(e) => handlefilterChange("status", e.target.value)}
                    >
                    <option value="All Status">All Status</option>
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Proposal Sent">Proposal Sent</option>
                    <option value="Closed">Closed</option>
                </select>

                <h3>Sales Agent:</h3>
                <select 
                    value={currentAgent || "All Agents"} 
                    onChange={(e) => handlefilterChange("salesAgent", e.target.value)}>
                    <option value="All Agents">All Agents</option>
                    {agents.map((agent)=> (
                        <option key={agent._id} value={agent._id}>{agent.name}</option>
                    ))}
                </select>

                <h3>Sort By:</h3>
                <select 
                    value={currentSort || ""} 
                    onChange={(e) => handlefilterChange("sort", e.target.value)}>
                    <option value="">Default</option>
                    <option value="timeToClose">Time to Close</option>
                    <option value="priority">Priority</option>
                </select>
            </div>

            <table className="lead-table">
                <thead>
                    <tr>
                        <th>Company Name</th>
                        <th>Sales Agent</th>
                        <th>Status</th>
                        <th>Priority</th>
                        <th>Time to Close</th>
                    </tr>
                </thead>
                <tbody>
                    {leads.length === 0 ? (
                        <tr>
                            <td colSpan="5" style={{ textAlign: "center"}}>No leads found.</td>
                        </tr>
                    ) : (
                        leads.map((lead)=> (
                            <tr key={lead._id}>
                                <td>
                                    <Link to={`/leads/${lead._id}`} className="lead-link">
                                        {lead.name}
                                    </Link>
                                    
                                    </td>
                                <td>{lead.salesAgent ? lead.salesAgent.name : "Unassigned"}</td>
                                <td>
                                    <span className={`status-badge ${lead.status.toLowerCase().replace(" ", "-")}`}>
                                        {lead.status}
                                    </span>
                                </td>
                                <td>{lead.priority}</td>
                                <td>{lead.timeToClose} days</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
        </>
    )
}

export default LeadList;