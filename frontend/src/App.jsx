import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import FaceScan from './TestingTemp/FaceScan'
// import FaceScanFlow from './TestingTemp/FaceScanFlow'
// import ExitUi from './FaceScanFlowTemp/ExitUi'
import AttendancePage from './pages/AttendancePage'
import HomePage from './pages/HomePage'
import AdminDashboard  from './pages/AdminDashboard'

function App() {

  return (
    <Router>
         <Routes>
           {/* <Route path="/" element={<AttendancePage />} />*/}
            <Route path="/" element={<AttendancePage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/home" element={<HomePage />} />
         </Routes>
    </Router>
  )
}

export default App

    // <>
    //   {/* <FaceScan /> */}
    //   {/* <FaceScanFlow />*/}
    //   {/* <ExitUi />*/}
    //   <AttendancePage />
    // </>