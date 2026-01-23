import React, { useEffect, useState } from 'react'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE;

export default function ChainedSelects({ onChange }) {
  const [departments, setDepartments] = useState([])
  const [batches, setBatches] = useState([])
  const [classGroups, setClassGroups] = useState([])

  const [deptId, setDeptId] = useState('')
  const [batchId, setBatchId] = useState('')
  const [classGroupId, setClassGroupId] = useState('')

  useEffect(() => {
    let mounted = true
    axios.get(`${API_BASE}/api/departments/`)
      .then(r => {
        if (!mounted) return
        // ensure ids are strings for select values
        setDepartments((r.data || []).map(d => ({ ...d, id: String(d.id) })))
      })
      .catch(() => setDepartments([]))
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    if (!deptId) {
      setBatches([])
      setBatchId('')
      return
    }
    let mounted = true
    axios.get(`${API_BASE}/api/departments/${deptId}/batches/`)
      .then(r => {
        if (!mounted) return
        setBatches((r.data || []).map(b => ({ ...b, id: String(b.id) })))
      })
      .catch(() => setBatches([]))
    setBatchId('')
    setClassGroups([])
    setClassGroupId('')
    return () => { mounted = false }
  }, [deptId])

  useEffect(() => {
    if (!batchId) {
      setClassGroups([])
      setClassGroupId('')
      return
    }
    let mounted = true
    axios.get(`${API_BASE}/api/batches/${batchId}/classgroups/`)
      .then(r => {
        if (!mounted) return
        setClassGroups((r.data || []).map(c => ({ ...c, id: String(c.id) })))
      })
      .catch(() => setClassGroups([]))
    setClassGroupId('')
    return () => { mounted = false }
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