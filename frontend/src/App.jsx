import { useState } from 'react'
import './App.css'
import FaceScan from './TestingTemp/FaceScan'
import FaceScanFlow from './TestingTemp/FaceScanFlow'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* <FaceScan /> */}
      <FaceScanFlow />
    </>
  )
}

export default App
