import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function ChainedSelects({ onChange }) {
  const [departments, setDepartments] = useState([])
  const [batches, setBatches] = useState([])
  const [classGroups, setClassGroups] = useState([])

  const [deptId, setDeptId] = useState('')
  const [batchId, setBatchId] = useState('')
  const [classGroupId, setClassGroupId] = useState('')

  useEffect(() => {
    axios.get('/api/departments/').then(r => setDepartments(r.data)).catch(() => setDepartments([]))
  }, [])

  useEffect(() => {
    if (!deptId) {
      setBatches([])
      setBatchId('')
      return
    }
    // fetch batches related to department
    axios.get(`/api/departments/${deptId}/batches/`).then(r => setBatches(r.data)).catch(() => setBatches([]))
    setBatchId('')
    setClassGroups([])
    setClassGroupId('')
  }, [deptId])

  useEffect(() => {
    if (!batchId) {
      setClassGroups([])
      setClassGroupId('')
      return
    }
    axios.get(`/api/batches/${batchId}/classgroups/`).then(r => setClassGroups(r.data)).catch(() => setClassGroups([]))
    setClassGroupId('')
  }, [batchId])

  useEffect(() => {
    if (onChange) onChange({ deptId, batchId, classGroupId })
  }, [deptId, batchId, classGroupId])

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <select value={deptId} onChange={e => setDeptId(e.target.value)}>
        <option value="">Select department</option>
        {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
      </select>

      <select value={batchId} onChange={e => setBatchId(e.target.value)} disabled={!batches.length}>
        <option value="">Select batch</option>
        {batches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
      </select>

      <select value={classGroupId} onChange={e => setClassGroupId(e.target.value)} disabled={!classGroups.length}>
        <option value="">Select class</option>
        {classGroups.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
    </div>
  )
}
