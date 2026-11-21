import { useEffect, useState } from "react"
import "./LeadForm.css"
import axios from "axios"
import {Link, useNavigate } from "react-router-dom"
import {toast} from "react-toastify"

const LeadForm = ()=>{
    const [name, setName] = useState("")
    const [source, setSource] = useState("Website")
    const [salesAgent, setSalesAgent] = useState("")
    const [leadStatus, setLeadStatus] = useState("New")
    const [priority, setPriority] = useState("Medium")
    const [timeToClose, setTimeToClose] = useState("")
    const [tags, setTags] = useState("")

    const [agents, setAgents] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    

    useEffect(()=>{
        const fetchAgents = async ()=>{
            setLoading(true)
            try{
                const response = await axios.get("https://anvaya-crm-backend-lyart.vercel.app/agents") // ye agents backend se fetch karega
                setAgents(response.data)
                setLoading(false)
            }catch(error){
                console.log("Error in fetching Agents.....", error)
                setLoading(false) 
            }
        }
        fetchAgents()
    }, []) // empty array taki ek bar chale

    const handleSubmit = async (e)=>{
        e.preventDefault()
        try{
            const formData = {
                name,
                source,
                salesAgent,
                status: leadStatus,
                priority,
                timeToClose: Number(timeToClose),
                tags: tags.split(",")
            }
            await axios.post("https://anvaya-crm-backend-lyart.vercel.app/leads", formData)
            toast.success("Lead created successfully!")
            navigate("/leads")
        }catch(error){
            console.log("Error in fetching Lead Form...please wait", error)
            toast.info("failed to create Leads")
        }
    }


    if(loading)return <h2>Loading Lead Form...</h2>
    return (
        <div className="lead-form-container">
            <Link to="/leads" className="back-link"> ← Back to Leads</Link>
            <h2>Add New Lead</h2>
            <div>
                <form onSubmit={handleSubmit}>
                <label>Name: 
                <input 
                    type="text" 
                    placeholder="Name"
                    value={name}
                    onChange={(e)=> setName(e.target.value)}
                    required
                    /> 
                </label>
                <label>Lead Source: 
                    <select value={source} onChange={(e)=> setSource(e.target.value)}>
                        <option value="Website">Website</option>
                        <option value="Referral">Referral</option>
                        <option value="Cold Call">Cold Call</option>
                        <option value="Advertisement">Advertisement</option>
                        <option value="Email">Email</option>
                        <option value="Other">Other</option>
                    </select>
                </label>

                <label > Sale Agent: 
                    <select value={salesAgent} onChange={(e)=> setSalesAgent(e.target.value)} required>
                        <option value="">Select Agent</option>
                        {agents.map((agent)=>(
                            <option key={agent._id} value={agent._id}>
                                {agent.name}
                            </option>
                        ))}
                    </select>
                </label>
                <label >Lead Status: 
                    <select  value={leadStatus} onChange={(e)=> setLeadStatus(e.target.value)}>
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Qualified">Qualified</option>
                        <option value="Proposal Sent">Proposal Sent</option>
                        <option value="Closed">Closed</option>
                    </select>
                </label>
                <label >Priority: 
                    <select value={priority} onChange={(e)=> setPriority(e.target.value)}>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                </label>
                <label>Time to Close (Day's): 
                    <input 
                        type="number"
                        placeholder="number's"
                        value={timeToClose}
                        onChange={(e)=> setTimeToClose(e.target.value)}
                        required
                        />
                </label>
                <label>Tags: 
                    <input 
                        type="text"
                        placeholder="High Value, Follow-up"
                        value={tags} 
                        onChange={(e)=> setTags(e.target.value)}
                        
                    />
                </label>
                <button type="submit">Create Lead</button>
            </form>
            </div>
            

            
            
        </div>
    )
}

export default LeadForm