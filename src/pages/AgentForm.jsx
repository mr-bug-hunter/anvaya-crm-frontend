import "./AgentForm.css"
import { useState } from "react"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

const AgentForm = ()=>{

    const [name , setName] = useState("")
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) =>{
        e.preventDefault()
        setLoading(true)
        try{
            await axios.post("https://anvaya-crm-backend-lyart.vercel.app/agents", {name, email})
            toast.success("Agent added successfully!")
            navigate("/agents")
        }catch(error){
            console.log(error)
            setLoading(false)
        }
    }

    if(loading) return <h2>Creating Agent...</h2>
    
    return(
        <div className="agent-form-container shadow">
            <Link to="/agents" className="back-link"> ← Back to Agents</Link>
            <h2>Add New Agent </h2>
            <form onSubmit={handleSubmit}>
                <input 
                type="text" 
                placeholder="Name" 
                value={name}
                onChange={(e)=> setName(e.target.value)} 
                required
                />
            <input 
                type="email" 
                placeholder="Email"
                value={email}
                onChange={(e)=> setEmail(e.target.value)} 
                required
                />
                <button type="submit">Create Agent</button>
            </form>
            
        </div>
    )
}

export default AgentForm