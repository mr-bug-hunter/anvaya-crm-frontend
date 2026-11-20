import './App.css'
import { Routes, Route} from "react-router-dom"
import Header from './components/Header'
import Siderbar from './components/Sidebar'
import LeadList from './pages/LeadList'
import LeadForm from './pages/LeadForm'
import AgentForm from './pages/AgentForm'
import AgentList from './pages/AgentList'
import LeadDetails from './pages/LeadDetails'
import Dashboard from "./pages/Dashboard"
import Report from './pages/Report'
import StatusView from './pages/StatusView'
import AgentView from "./pages/AgentView"
import Settings from './pages/Settings'
function App() {
  return (
    
    
    <div className='app-wrapper'>
      <Header/>
      <div className='app-body'>
        <Siderbar />

      <div className='main-content'>
      <div className='page-content'>
      <Routes>
        <Route path='/' element={<Dashboard/>} />
        <Route path='/leads' element={<LeadList/>}/>
        <Route path='/leads/add' element={<LeadForm/>} />
        <Route path='/agents' element={<AgentList />}/>
        <Route path='/agents/add' element={<AgentForm />} />
        <Route path='/leads/:id' element={<LeadDetails/>} />
        <Route path='/reports' element={<Report />} />
        <Route path='/status-view' element={<StatusView/>}/>
        <Route path='/agent-view' element={<AgentView/>} />
        <Route path='/settings' element={<Settings/>} />
      </Routes>
      </div>
    </div>
    </div>
    </div>
  )
}

export default App
