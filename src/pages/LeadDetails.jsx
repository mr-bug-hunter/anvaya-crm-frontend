import { useEffect, useState } from "react"
import "./LeadDetails.css"
import { useParams, Link } from "react-router-dom"
import axios from "axios"

const LeadDetails = ()=>{
    const {id} = useParams()

    const [lead, setLead] = useState({})
    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(true)
    const [newComment, setNewComment] = useState("")
    const [authorId, setAuthorId] = useState("")
    const [isEditing, setIsEditing] = useState(false)
    const [editData, setEditData] = useState({status: "", priority: "", timeToClose: "", salesAgent: ""})

    useEffect(()=>{
        const fetchData = async ()=>{
            setLoading(true)
            try{
                const leadRes = await axios.get(`https://anvaya-crm-backend-lyart.vercel.app/leads/${id}`)
                setLead(leadRes.data)
                setEditData({
                    status: leadRes.data.status,
                    priority: leadRes.data.priority,
                    timeToClose: leadRes.data.timeToClose,
                    salesAgent: leadRes.data.salesAgent ? leadRes.data.salesAgent._id : ""
                })

                const commentsRes = await axios.get(`https://anvaya-crm-backend-lyart.vercel.app/leads/${id}/comments`)
                setComments(commentsRes.data.comment || [])// this send comment from backend "comments"

                const agentRes = await axios.get("https://anvaya-crm-backend-lyart.vercel.app/agents")
                if(agentRes.data.length > 0){
                    setAuthorId(agentRes.data[0]._id) // take the first ID
                }
                setLoading(false)
            }catch(error){
                console.log("Error in fetching Leads Id", error)
                setLoading(false)
            }
        }
        fetchData()
    }, [id])

    const handleUpdate = async ()=>{
        try{
            const res = await axios.patch(`https://anvaya-crm-backend-lyart.vercel.app/leads/${id}`, editData)
            setLead(res.data.updatedLead) //backend pe update
            setIsEditing(false) //edit close
            alert("lead updated successfully!")
        }catch(error){
            console.log("Error updating lead", error)
        }
    }

    const handleAddComment = async (e)=>{
        e.preventDefault()
        if(!newComment) return; 
        try{
            await axios.post(`https://anvaya-crm-backend-lyart.vercel.app/leads/${id}/comments`, {
                commentText: newComment,
                author: authorId
            })
            const commentsRes = await axios.get(`https://anvaya-crm-backend-lyart.vercel.app/leads/${id}/comments`)
            setComments(commentsRes.data.comment)
            setNewComment("")// clear the input
            alert("comment added!")
        }catch(error){
            console.log("Error adding comment", error)
        }
    }

    if(loading) return <h2>Loading Details....</h2>

    return(
        <div className="lead-details-container">
            
            <Link to="/leads" className="back-link"> ← Back to Leads</Link>
            <div>
                {/* lead Information */}
                
                <div className="lead-info">
                    <h2>{lead.name}</h2>    
                    {!isEditing && (
                        <button onClick={()=> setIsEditing(true)} className="edit-btn">Edit Lead Details</button>
                    )}

                    {isEditing ? (
                        <div className="edit-form">
                            <label> Status:
                                <select value={editData.status} onChange={(e) => setEditData({...editData, status:e.target.value}) }>
                                    <option value="New">New</option>
                                    <option value="Contacted">Contacted</option>
                                    <option value="Qualified">Qualified</option>
                                    <option value="Proposal Sent">Proposal Sent</option>
                                    <option value="Closed">Closed</option>
                                </select>
                            </label>
                            <label >Priority:
                                <select value={editData.priority} onChange={(e)=> setEditData({...editData, priority: e.target.value})}>
                                    <option value="High">High</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Low">Low</option>
                                </select>
                            </label>
                            <label >
                                Time to Close (Days):
                                <input 
                                    type="number" 
                                    value={editData.timeToClose}
                                    onChange={(e) => setEditData({...editData, timeToClose: e.target.value})} />
                            </label>
                            <div className="edit-action">
                            <button onClick={handleUpdate} className="save-btn">Save</button>
                            <button onClick={()=> setIsEditing(false)} className="cancel-btn">Cancel</button>
                            </div>
                        </div>
                    ): (
                        <div className="view-details">
                            <p><strong>Sales Agent:</strong> {lead.salesAgent ? lead.salesAgent.name: "Unassigned"}</p>
                            <p><strong>Source:</strong>{lead.source}</p>
                            <p><strong>Status:</strong>{lead.status}</p>
                            <p><strong>Priority:</strong>{lead.priority}</p>
                            <p><strong>Time to Close:</strong>{lead.timeToClose} days</p>
                        </div>
                    )}
                </div>
                
            </div>

            <div className="comments-section">
                <h3>Comments & Updates</h3>
                {/* comment List */}
                {comments.length === 0 ? (
                    <p>No comment yet.</p>
                ): (
                    comments.map((comment)=> (
                        <div key={comment._id} className="comment-box">
                            <p>
                                <strong>{comment.author ? comment.author.name : "Unknown"}</strong>
                                <span style={{fontSize: "12px", color: "gray", marginLeft: "10px"}}>
                                    {new Date(comment.createdAt).toLocaleString()}
                                </span>
                            </p>
                            <p>{comment.commentText}</p>
                        </div>
                    ))
                )}
                {/* add comment form */}
                <form onSubmit={handleAddComment} className="add-comment-form">
                    <input 
                        type="text"
                        placeholder="Add a new comment..."
                        value={newComment}
                        onChange={(e)=> setNewComment(e.target.value)}
                        />
                        <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    )
}

export default LeadDetails