import React, { useEffect, useState } from 'react'
import { api } from './lib/api.js'

function StatCard({ label, value, sub }) {
  return (
    <div className="card p-5">
      <div className="text-[11px] tracking-widest text-zinc-500 uppercase font-semibold">{label}</div>
      <div className="text-[28px] font-semibold mt-2 leading-none">{value}</div>
      <div className="text-[13px] text-zinc-500 mt-2">{sub}</div>
    </div>
  )
}

function Sidebar({ tab, setTab }) {
  const items = [
    { id: 'overview', label: 'Overview' },
    { id: 'bookings', label: 'Bookings' },
    { id: 'clients', label: 'Clients' },
    { id: 'schedule', label: 'Schedule' },
  ]
  return (
    <aside className="w-[240px] shrink-0 hidden md:flex flex-col gap-6 p-6 border-r border-zinc-200 bg-white/60 h-screen sticky top-0">
      <div className="font-bold text-[22px] tracking-tight">FORME</div>
      <nav className="flex flex-col gap-1">
        {items.map((it) => (
          <button
            key={it.id}
            onClick={() => setTab(it.id)}
            className={'text-left px-3 py-2 rounded-full text-[14px] font-medium transition ' + (tab === it.id ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-100')}
          >
            {it.label}
          </button>
        ))}
      </nav>
      <div className="mt-auto text-[12px] text-zinc-400">v1.0 · Docker bundle</div>
    </aside>
  )
}

function BookingTable({ bookings }) {
  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-[14px]">
          <thead className="bg-zinc-50 text-[11px] uppercase tracking-widest text-zinc-500">
            <tr>
              <th className="text-left font-semibold px-4 py-3">Client</th>
              <th className="text-left font-semibold px-4 py-3">Class</th>
              <th className="text-left font-semibold px-4 py-3">Trainer</th>
              <th className="text-left font-semibold px-4 py-3">When</th>
              <th className="text-left font-semibold px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="border-t border-zinc-100 hover:bg-zinc-50/60">
                <td className="px-4 py-3 font-medium">{b.client_name || b.client_id}</td>
                <td className="px-4 py-3">{b.class_name}</td>
                <td className="px-4 py-3 text-zinc-600">{b.trainer}</td>
                <td className="px-4 py-3 text-zinc-600">{b.date} · {b.start_time.slice(0,5)}</td>
                <td className="px-4 py-3">
                  <span className={'inline-flex px-2.5 py-1 rounded-full text-[11px] font-medium ' + (b.status === 'confirmed' ? 'bg-zinc-900 text-white' : 'bg-amber-100 text-amber-800')}>
                    {b.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ScheduleTimeline({ bookings }) {
  const hours = ['06:00','08:00','10:00','12:00','14:00','16:00','18:00','20:00']
  return (
    <div className="card p-6">
      <div className="flex gap-3 overflow-x-auto pb-2">
        {hours.map((h) => (
          <div key={h} className="min-w-[120px]">
            <div className="text-[11px] text-zinc-400 font-medium">{h}</div>
            <div className="mt-3 space-y-2">
              {bookings.filter((b) => b.start_time.startsWith(h.slice(0,2))).map((b) => (
                <div key={b.id} className="rounded-[12px] bg-zinc-900 text-white p-3 text-[12px] leading-tight">
                  <div className="font-semibold">{b.class_name}</div>
                  <div className="opacity-70 mt-1">{b.trainer} · {b.start_time.slice(0,5)}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function NewBookingModal({ open, onClose, onCreate, clients }) {
  const [form, setForm] = useState({ client_id: '', class_name: '', trainer: '', date: '', start_time: '07:00', end_time: '08:00' })
  
  // Reset form when modal opens/closes
  useEffect(() => {
    if (!open) {
      setForm({ client_id: '', class_name: '', trainer: '', date: '', start_time: '07:00', end_time: '08:00' })
    }
  }, [open])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="card w-full max-w-[440px] p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-[18px]">New Booking</h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-900">✕</button>
        </div>
        <div className="mt-5 grid gap-3">
          <select value={form.client_id} onChange={(e) => setForm({ ...form, client_id: e.target.value })} className="w-full rounded-full border border-zinc-200 px-4 py-2.5 text-[14px]">
            <option value="">Select client</option>
            {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input placeholder="Class name" value={form.class_name} onChange={(e) => setForm({ ...form, class_name: e.target.value })} className="w-full rounded-full border border-zinc-200 px-4 py-2.5 text-[14px]" />
          <input placeholder="Trainer" value={form.trainer} onChange={(e) => setForm({ ...form, trainer: e.target.value })} className="w-full rounded-full border border-zinc-200 px-4 py-2.5 text-[14px]" />
          <div className="grid grid-cols-3 gap-2">
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="rounded-full border border-zinc-200 px-3 py-2.5 text-[13px]" />
            <input type="time" value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })} className="rounded-full border border-zinc-200 px-3 py-2.5 text-[13px]" />
            <input type="time" value={form.end_time} onChange={(e) => setForm({ ...form, end_time: e.target.value })} className="rounded-full border border-zinc-200 px-3 py-2.5 text-[13px]" />
          </div>
        </div>
        <button onClick={() => onCreate(form)} className="mt-6 w-full rounded-full bg-zinc-900 text-white py-2.5 text-[14px] font-medium">Create booking</button>
      </div>
    </div>
  )
}

export default function App() {
  const [tab, setTab] = useState('overview')
  const [stats, setStats] = useState(null)
  const [bookings, setBookings] = useState([])
  const [clients, setClients] = useState([])
  const [showNew, setShowNew] = useState(false)

  // FIX 1: Centralized fetch function - sab kuch ek saath laayega
  const fetchAll = async () => {
    try {
      const [s, b, c] = await Promise.all([
        api('/stats'),
        api('/bookings'),
        api('/clients')
      ])
      setStats(s)
      setBookings(b)
      setClients(c)
    } catch (err) {
      console.error('Fetch failed:', err)
    }
  }

  useEffect(() => {
    fetchAll()
  }, [])

  // FIX 2: Booking create ke baad stats + bookings dono instantly update
  const createBooking = async (form) => {
    try {
      // Validation
      if (!form.client_id || !form.class_name || !form.date) {
        alert('Please fill all required fields')
        return
      }
      
      await api('/bookings', { method: 'POST', body: form })
      
      // FIX: Dono ko ek saath fetch karo - bina refresh ke instantly dikhega
      await fetchAll()
      
      setShowNew(false)
    } catch (e) { 
      alert(e.message) 
    }
  }

  return (
    <div className="min-h-screen flex bg-[#fafaf9] text-zinc-900">
      <Sidebar tab={tab} setTab={setTab} />
      <main className="flex-1 min-w-0">
        <div className="glass sticky top-0 z-10 flex items-center justify-between px-6 md:px-8 py-4">
          <div className="text-[13px] text-zinc-500">Dashboard · <span className="text-zinc-900 font-medium">{tab}</span></div>
          <button onClick={() => setShowNew(true)} className="rounded-full bg-zinc-900 text-white px-4 py-2 text-[13px] font-medium">+ New booking</button>
        </div>
        <div className="p-6 md:p-8 max-w-[1200px]">
          {tab === 'overview' && stats && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Total clients" value={stats.totalClients} sub="All memberships" />
                <StatCard label="Today" value={stats.todayBookings} sub="Bookings today" />
                <StatCard label="Confirmed" value={stats.confirmed} sub="Active reservations" />
                <StatCard label="Revenue" value={'$' + stats.revenue} sub="Est. from bookings" />
              </div>
              <div className="mt-6 grid md:grid-cols-[1.2fr_0.8fr] gap-4">
                <div className="card p-6">
                  <div className="font-semibold">Top classes</div>
                  <div className="mt-4 space-y-3">
                    {stats.byClass.map((c) => (
                      <div key={c.class_name} className="flex items-center justify-between text-[14px]">
                        <span>{c.class_name}</span>
                        <span className="text-zinc-500">{c.count} bookings</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="card p-6">
                  <div className="font-semibold">Upcoming</div>
                  <div className="mt-4 space-y-2">
                    {stats.upcoming.map((u) => (
                      <div key={u.id} className="flex justify-between text-[13px] py-2 border-b border-zinc-100 last:border-0">
                        <span className="font-medium">{u.client_name}</span>
                        <span className="text-zinc-500">{u.class_name} · {u.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
          {tab === 'bookings' && <BookingTable bookings={bookings} />}
          {tab === 'schedule' && <ScheduleTimeline bookings={bookings} />}
          {tab === 'clients' && (
            <div className="grid md:grid-cols-3 gap-3">
              {clients.map((c) => (
                <div key={c.id} className="card p-5">
                  <div className="font-semibold">{c.name}</div>
                  <div className="text-[13px] text-zinc-500 mt-1">{c.email}</div>
                  <div className="mt-3 inline-flex px-2.5 py-1 rounded-full bg-zinc-100 text-[11px] font-medium">{c.membership}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <NewBookingModal open={showNew} onClose={() => setShowNew(false)} onCreate={createBooking} clients={clients} />
    </div>
  )
}
