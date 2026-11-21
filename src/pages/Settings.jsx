import "./Settings.css"
import { useEffect, useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"

const Settings = ()=>{
    const [leads, setLeads] = useState([])
    const [agents, setAgents] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        const fetchData = async ()=>{
            try{
            const leadRes = await axios.get("https://anvaya-crm-backend-lyart.vercel.app/leads")
            setLeads(leadRes.data)

            const agentRes = await axios.get("https://anvaya-crm-backend-lyart.vercel.app/agents")
            setAgents(agentRes.data)
            setLoading(false)
        }catch(error){
            console.log("Error in fetching settings...", error)
            setLoading(false)
        }
        }
        fetchData()
        
    }, [])

    const handleDeleteLead = async(id)=>{
        const confirmDelete = window.confirm("Do you want to delete this lead!")
        if(!confirmDelete) return;
        try{
            await axios.delete(`https://anvaya-crm-backend-lyart.vercel.app/leads/${id}`)
            setLeads(leads.filter(lead => lead._id !== id))
            alert("Lead deleted successfully!")
        }catch(error){
            console.log("Error in deleting lead", error)
        }
    }

    const handleDeleteAgent = async (id)=>{
        const confirmAgentDelete = window.confirm("Do you want to delete Agent!")
        if(!confirmAgentDelete) return;
        try{
            await axios.delete(`https://anvaya-crm-backend-lyart.vercel.app/agents/${id}`)
            setAgents(leads.filter(agent => agent._id !== id))
            alert("Agent deleted successfully!")
        }catch(error){
            console.log("Error in deleting Agent", error)
        }
    }
    return(
        <div className="settings-container">
            <Link to="/" className="back-link"> ← Back to Dashboard</Link>
            <h2 className="manager">Leads Manager</h2>

            <div className="settings-section">
                <h3>Manage Leads</h3>
                <table className="settings-table">
                    <thead>
                        <tr>
                            <th>Lead Name</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leads.map(lead => (
                            <tr key={lead._id}>
                                <td>{lead.name}</td>
                                <td>{lead.status}</td>
                                <td>
                                    <button 
                                    onClick={()=> handleDeleteLead(lead._id)} 
                                    className="delete-btn" >
                                        Delete
                                        </button>
                                </td>
                                
                            </tr>
                            
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="settings-section">
                <h3>Manage Agents</h3>
                <table className="settings-table">
                    <thead>
                        <tr>
                            <th>Agent Name</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {agents.map(agent => (
                            <tr key={agent._id}>
                                <td>{agent.name}</td>
                                <td>
                                    <button 
                                    onClick={()=> handleDeleteAgent(agent._id)} 
                                    className="delete-btn" >
                                        Delete
                                        </button>
                                </td>
                                
                            </tr>
                            
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    )
}

export default Settings