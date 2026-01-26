import React, { useEffect, useState } from 'react'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE;

export default function ChainedSelects({ onChange }) {
  const [allDepartments, setAllDepartments] = useState([])
  const [allBatches, setAllBatches] = useState([])
  const [allClassGroups, setAllClassGroups] = useState([])

  const [deptId, setDeptId] = useState('')
  const [batchId, setBatchId] = useState('')
  const [classGroupId, setClassGroupId] = useState('')

  // Load all options on mount
  useEffect(() => {
    let mounted = true
    
    // Load departments
    axios.get(`${API_BASE}/api/departments/`)
      .then(r => {
        if (!mounted) return
        setAllDepartments((r.data || []).map(d => ({ ...d, id: String(d.id) })))
      })
      .catch(() => setAllDepartments([]))

    // Load all batches (fetch from a dedicated endpoint or aggregate)
    // Assuming you want all batches regardless of department initially
    Promise.all(
      // We'll load batches for each department and merge
      // Or ideally create a /api/batches/ endpoint that returns all
      []
    ).catch(() => {})

    // For now, load all class groups via a new endpoint or aggregate
    // Ideally: axios.get(`${API_BASE}/api/classgroups/`)
    
    return () => { mounted = false }
  }, [])

  // When department changes, filter batches and classes
  useEffect(() => {
    if (!deptId) {
      // No department selected - load all batches and classes
      loadAllBatchesAndClasses()
      return
    }
    
    let mounted = true
    
    // Load batches for selected department
    axios.get(`${API_BASE}/api/departments/${deptId}/batches/`)
      .then(r => {
        if (!mounted) return
        setAllBatches((r.data || []).map(b => ({ ...b, id: String(b.id) })))
      })
      .catch(() => setAllBatches([]))

    // Load classes for selected department
    axios.get(`${API_BASE}/api/departments/${deptId}/classgroups/`)
      .then(r => {
        if (!mounted) return
        setAllClassGroups((r.data || []).map(c => ({ ...c, id: String(c.id) })))
      })
      .catch(() => setAllClassGroups([]))

    return () => { mounted = false }
  }, [deptId])

  // When batch changes, filter classes
  useEffect(() => {
    if (!batchId) {
      // If no batch selected but dept selected, show dept classes
      if (deptId) {
        axios.get(`${API_BASE}/api/departments/${deptId}/classgroups/`)
          .then(r => setAllClassGroups((r.data || []).map(c => ({ ...c, id: String(c.id) }))))
          .catch(() => {})
      }
      return
    }
    
    let mounted = true
    axios.get(`${API_BASE}/api/batches/${batchId}/classgroups/`)
      .then(r => {
        if (!mounted) return
        setAllClassGroups((r.data || []).map(c => ({ ...c, id: String(c.id) })))
      })
      .catch(() => setAllClassGroups([]))
    
    return () => { mounted = false }
  }, [batchId, deptId])

  // Load all batches and classes when no filters applied
  function loadAllBatchesAndClasses() {
    let mounted = true
    
    // Load all batches by fetching from all departments
    axios.get(`${API_BASE}/api/departments/`)
      .then(async (deptRes) => {
        if (!mounted) return
        const depts = deptRes.data || []
        const batchPromises = depts.map(d => 
          axios.get(`${API_BASE}/api/departments/${d.id}/batches/`)
            .then(r => r.data || [])
            .catch(() => [])
        )
        const batchArrays = await Promise.all(batchPromises)
        const uniqueBatches = Array.from(
          new Map(
            batchArrays.flat().map(b => [b.id, { ...b, id: String(b.id) }])
          ).values()
        )
        if (mounted) setAllBatches(uniqueBatches)
      })
      .catch(() => setAllBatches([]))

    // Load all class groups
    axios.get(`${API_BASE}/api/departments/`)
      .then(async (deptRes) => {
        if (!mounted) return
        const depts = deptRes.data || []
        const classPromises = depts.map(d =>
          axios.get(`${API_BASE}/api/departments/${d.id}/classgroups/`)
            .then(r => r.data || [])
            .catch(() => [])
        )
        const classArrays = await Promise.all(classPromises)
        const uniqueClasses = Array.from(
          new Map(
            classArrays.flat().map(c => [c.id, { ...c, id: String(c.id) }])
          ).values()
        )
        if (mounted) setAllClassGroups(uniqueClasses)
      })
      .catch(() => setAllClassGroups([]))
  }

  useEffect(() => {
    if (onChange) onChange({ deptId, batchId, classGroupId })
  }, [deptId, batchId, classGroupId])

  // Filter batches based on selected department
  const filteredBatches = deptId 
    ? allBatches 
    : allBatches

  // Filter classes based on selected department and/or batch
  const filteredClassGroups = allClassGroups

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <select 
        value={deptId} 
        onChange={e => {
          setDeptId(e.target.value)
          // Clear child selections when parent changes
          if (e.target.value) {
            setBatchId('')
            setClassGroupId('')
          }
        }}
      >
        <option value="">All departments</option>
        {allDepartments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
      </select>

      <select 
        value={batchId} 
        onChange={e => {
          setBatchId(e.target.value)
          // Clear class when batch changes
          if (e.target.value) setClassGroupId('')
        }}
      >
        <option value="">All batches</option>
        {filteredBatches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
      </select>

      <select 
        value={classGroupId} 
        onChange={e => setClassGroupId(e.target.value)}
      >
        <option value="">All classes</option>
        {filteredClassGroups.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
    </div>
  )
}