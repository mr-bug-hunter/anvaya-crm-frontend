import { useEffect, useState } from "react"
import "./AgentList.css"
import { Link } from "react-router-dom"
import axios from "axios"

const AgentList = ()=>{

    const [loading, setLoading] = useState(true)
    const [agents, setAgents] = useState([])
    

    useEffect(()=>{
        const fetchAgents = async ()=>{
            setLoading(true)
            try{
                const response = await axios.get("https://anvaya-crm-frontend-snowy.vercel.app/agents");
                setAgents(response.data)
                setLoading(false)
            }catch(error){
                console.log("Error in fetching Agent...", error)
            }
        }
        fetchAgents()
    }, [])

    if(loading) return <h2>Loading Agents...</h2>
    return(
        <div className="agent-list-container">
            <div className="agent-header">
                <h2>All Sales Agents</h2>
                <Link to="/agents/add">+ Add New Agent</Link>
            </div>
            
            <table className="agent-table">
                <thead>
                    <tr>
                        <th>Agent Name</th>
                        <th>Email</th>
                        <th>Date Added</th>
                    </tr>
                </thead>
                <tbody>
                    {agents.length === 0 ? (
                        <tr>
                            <td  style={{textAlign: "center"}}>No agents found</td>
                        </tr>
                    ): (
                        agents.map((agent)=>(
                            <tr key={agent._id}>
                                <td>{agent.name}</td>
                                <td>{agent.email}</td>
                                <td>{new Date(agent.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default AgentList