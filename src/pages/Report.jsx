import { useEffect, useState } from "react"
import axios from "axios"
import {Pie, Bar} from "react-chartjs-2"
import "chart.js/auto"
import "./Report.css"
import { Link } from "react-router-dom"

const Report = ()=>{

    const [piplineData, setPipelineData] = useState({})
    const [agentData, setAgentData] = useState({})
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        const fetchReport = async ()=>{
            try{
                //pie chart
                const pipelineRes = await axios.get("https://anvaya-crm-backend-lyart.vercel.app/report/pipeline")
                setPipelineData(pipelineRes.data)
                //Bar chart
                const agentRes = await axios.get("https://anvaya-crm-backend-lyart.vercel.app/report/closed-by-agent")
                setAgentData(agentRes.data)
                setLoading(false)
            }catch(error){
                console.log("Error in fetching Report...", error)
                setLoading(false)
            }
        }
        fetchReport()
    }, [])

    if(loading)return <h2>Loading Reports....</h2>

    const pieChartData = {
        labels: Object.keys(piplineData), //obj key means is like strings
        datasets:[{
            label: "Total Leads",
            data: Object.values(piplineData), //obj values is like number
            backgroundColor: ["#A294F9", "#F5EFFF", "#8C7AE6", "#C5BAFF", "#E5D9F2"],
            borderWidth:1
        }]
    }

    const barChartData = {
        labels: Object.keys(agentData),
        datasets: [{
            label: "Leads Closed",
            data: Object.values(agentData),
            backgroundColor: "#A294F9",
            borderRadius: 5,
            maxBarThickness: 40
        }]
    }

    return(
        <div className="reports-container">
            <Link to="/" className="back-link"> ← Back to Dashboard</Link>
            <h2>Anvaya CRM Reports</h2>

            <div className="charts-grid">

                <div className="chart-card">
                <h3>Lead Status Distribution</h3>
                <div className="chart-wrapper">
                    <Pie data={pieChartData}/>
                </div>
                </div>

                <div className="chart-card">
                    <h3>Leads Closed by Sales Agent</h3>
                    <div className="chart-wrapper">
                        <Bar data={barChartData} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Report