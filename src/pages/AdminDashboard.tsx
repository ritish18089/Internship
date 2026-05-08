import { useState, useEffect } from 'react';
import { 
  ClipboardList, 
  CheckCircle2,
  Clock,
  Users,
  Filter,
  LayoutDashboard,
  LogOut,
  ChevronRight,
  Trash2,
  Calendar,
  BarChart3,
  Search,
  X,
  RotateCcw
} from 'lucide-react';
import { motion } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from 'recharts';
import { ServiceRequest, ServiceStatus } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { cn } from '../lib/utils';
import { Logo } from '../components/Logo';
import { api } from '../lib/api';

interface AdminDashboardProps {
  onLogout: () => void;
}

export const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'requests' | 'slots' | 'analytics'>('dashboard');
  const [statusFilter, setStatusFilter] = useState<ServiceStatus | 'ALL'>('ALL');
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [slots, setSlots] = useState<any[]>([]);
  const [newSlot, setNewSlot] = useState({ date: new Date().toISOString().split('T')[0], time: '09:00 AM', capacity: 5 });
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchModel, setSearchModel] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchRequests();
    fetchSlots();
    fetchAnalytics();
  }, [filterDate]); // Keep filterDate as a dependency for slots if needed, but requests now have their own filters

  const fetchAnalytics = async () => {
    try {
      const response = await api.get('/admin/analytics');
      setAnalyticsData(response.data);
    } catch (err) {
      console.error('Failed to fetch analytics', err);
    }
  };


  const fetchSlots = async () => {
    try {
      const response = await api.get('/services/slots?date=' + filterDate);
      setSlots(response.data);
    } catch (err) {
      console.error('Failed to fetch slots', err);
    }
  };

  const handleCreateSlot = async () => {
    if (!newSlot.date || !newSlot.time) return;
    try {
      await api.post('/services/slots', newSlot);
      fetchSlots();
      alert('Slot added successfully');
    } catch (err) {
      alert('Failed to add slot');
    }
  };

  const deleteSlot = async (id: number) => {
    try {
      await api.delete(`/services/slots/${id}`);
      setSlots(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      alert('Failed to delete slot');
    }
  };

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'ALL') params.append('status', statusFilter);
      if (searchModel) params.append('carModel', searchModel);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await api.get('/services/all?' + params.toString());
      setRequests(response.data);
    } catch (err) {
      console.error('Failed to fetch requests', err);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setStatusFilter('ALL');
    setSearchModel('');
    setStartDate('');
    setEndDate('');
    // The useEffect won't trigger if I just clear these unless I call fetchRequests
    // Actually, I'll add a trigger or just call it
  };
  
  useEffect(() => {
    fetchRequests();
  }, [statusFilter]); // statusFilter still triggers immediately

  const updateStatus = async (id: number, newStatus: ServiceStatus, cost?: number) => {
    try {
      await api.put(`/services/${id}/status`, { status: newStatus, cost: cost });
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus, cost: cost ?? r.cost } : r));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const deleteRequest = async (id: number) => {
    if (confirm('Are you sure you want to delete this specific service record?')) {
      try {
        await api.delete(`/services/${id}`);
        setRequests(prev => prev.filter(r => r.id !== id));
      } catch (err) {
        alert('Failed to delete service record');
      }
    }
  };

  const filteredRequests = requests; // Filtering is now done on server side

  const SidebarItem = ({ id, icon: Icon, label }: { id: typeof activeTab, icon: any, label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={cn(
        "w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all group",
        activeTab === id 
          ? "bg-accent text-black font-black shadow-[0_0_30px_rgba(217,255,63,0.3)]" 
          : "text-slate-500 hover:text-white hover:bg-white/[0.03]"

      )}
    >
      <div className="flex items-center space-x-4">
        <Icon className={cn("w-5 h-5", activeTab === id ? "text-black" : "text-slate-500 group-hover:text-accent")} />
        <span className="uppercase tracking-widest text-xs font-black italic">{label}</span>
      </div>
      {activeTab === id && <ChevronRight className="w-4 h-4" />}
    </button>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-transparent relative overflow-hidden">
      {/* Sidebar */}
      <aside className="w-80 border-r border-white/5 bg-[#08090c] p-8 hidden lg:flex flex-col relative z-20">
        <div className="mb-16">
          <Logo size="md" />
        </div>

        <nav className="flex-1 space-y-3">
          <SidebarItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
          <SidebarItem id="requests" icon={ClipboardList} label="Service Requests" />
          <SidebarItem id="slots" icon={Calendar} label="Service Slots" />
          <SidebarItem id="analytics" icon={BarChart3} label="Analytics" />
        </nav>

        <button 
          onClick={onLogout}
          className="mt-auto flex items-center space-x-4 px-6 py-4 text-slate-500 hover:text-red-500 transition-colors group"
        >
          <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span className="uppercase tracking-widest text-xs font-black italic">Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 lg:p-12 relative z-10 overflow-y-auto">
        {/* Top Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-8">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight italic uppercase">
              {activeTab === 'dashboard' ? 'Administrator Dashboard' : activeTab === 'analytics' ? 'Performance Analytics' : 'Service Operations'}
            </h1>
            <p className="text-slate-500 font-medium mt-2">Welcome back, Administrator</p>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center shadow-[0_0_15px_rgba(217,255,63,0.3)]">
              <span className="text-black font-black italic">AD</span>
            </div>
          </div>
        </div>

        {activeTab === 'dashboard' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { label: 'Active Requests', value: requests.filter(r => r.status === 'PENDING' || r.status === 'IN_PROGRESS').length, icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
                { label: 'Completed Services', value: requests.filter(r => r.status === 'COMPLETED').length, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
                { label: 'Platform Health', value: '98%', icon: LayoutDashboard, color: 'text-blue-400', bg: 'bg-blue-400/10' },
              ].map((stat, i) => (
                <div key={i} className="glass-card p-8 group glass-card-hover">
                  <div className="flex items-center justify-between mb-8">
                    <div className={cn("p-5 rounded-2xl transition-transform group-hover:scale-110", stat.bg)}>
                      <stat.icon className={cn("w-7 h-7", stat.color)} />
                    </div>
                    <span className="text-5xl font-black text-white tracking-tighter italic text-glow-accent">{stat.value}</span>
                  </div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{stat.label}</p>
                </div>

              ))}
            </div>

            <div className="glass-card p-8">
              <h3 className="text-lg font-black text-white uppercase italic tracking-tight mb-8">Latest Requests</h3>
              <div className="space-y-4">
                {requests.slice(0, 5).map(req => (
                  <div key={req.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                        <ClipboardList className="w-5 h-5 text-slate-400" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{req.serviceType}</p>
                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{req.requestDate} • {req.user?.name}</p>
                      </div>
                    </div>
                    <StatusBadge status={req.status} />
                  </div>
                ))}
                {requests.length === 0 && <p className="text-slate-500 text-center py-4">No requests found.</p>}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'slots' && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-12">
            <div className="glass-card p-10">
              <h3 className="text-xl font-black text-white uppercase italic tracking-tight mb-8">Define Available Slots</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Date</label>
                  <input 
                    type="date" 
                    className="input-field" 
                    value={newSlot.date}
                    onChange={e => setNewSlot({...newSlot, date: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Time Slot</label>
                  <select 
                    className="input-field"
                    value={newSlot.time}
                    onChange={e => setNewSlot({...newSlot, time: e.target.value})}
                  >
                    {['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'].map(t => (
                      <option key={t} value={t} className="bg-[#08090c] text-white">{t}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Capacity (Cars)</label>
                  <input 
                    type="number" 
                    className="input-field" 
                    value={newSlot.capacity}
                    onChange={e => setNewSlot({...newSlot, capacity: parseInt(e.target.value)})}
                  />
                </div>
                <button onClick={handleCreateSlot} className="btn-primary py-4">Add Slot</button>
              </div>
            </div>

            <div className="glass-card overflow-hidden">
              <div className="p-8 border-b border-white/10 flex items-center justify-between">
                <h2 className="text-xl font-black text-white italic uppercase tracking-tight">Existing Slots</h2>
                <div className="flex items-center space-x-4">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Viewing Date:</span>
                  <input 
                    type="date" 
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-accent font-black outline-none focus:ring-1 focus:ring-accent/50 cursor-pointer"
                    value={filterDate}
                    onChange={e => setFilterDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-slate-500 text-[10px] uppercase font-black tracking-[0.2em] border-b border-white/10">
                      <th className="px-10 py-6 font-black">Date</th>
                      <th className="px-10 py-6 font-black">Time</th>
                      <th className="px-10 py-6 font-black">Capacity</th>
                      <th className="px-10 py-6 font-black">Booked</th>
                      <th className="px-10 py-6 font-black text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {slots.map(slot => (
                      <tr key={slot.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-10 py-8 text-sm font-bold text-white italic">{slot.date}</td>
                        <td className="px-10 py-8 text-sm text-accent font-black italic">{slot.time}</td>
                        <td className="px-10 py-8 text-sm text-slate-400 font-mono tracking-widest">{slot.capacity} Cars Max</td>
                        <td className="px-10 py-8">
                          <span className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-black uppercase italic tracking-tighter",
                            slot.bookedCount >= slot.capacity ? "bg-red-500/20 text-red-500" : "bg-emerald-500/20 text-emerald-500"
                          )}>
                            {slot.bookedCount || 0} Booked
                          </span>
                        </td>
                        <td className="px-10 py-8 text-right">
                          <button onClick={() => deleteSlot(slot.id)} className="p-3 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {slots.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-10 py-12 text-center text-slate-600 text-xs font-black uppercase tracking-widest italic">
                          No slots defined for this period
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'requests' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card overflow-hidden">
            <div className="p-8 border-b border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <h2 className="text-xl font-black text-white italic uppercase tracking-tight">Service Requests</h2>
              
              <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-end">
                {/* Car Model Search */}
                <div className="space-y-1.5 min-w-[200px]">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Car Model</label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                    <input 
                      type="text"
                      placeholder="Search model..."
                      value={searchModel}
                      onChange={(e) => setSearchModel(e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white font-bold focus:ring-2 focus:ring-accent/50 outline-none transition-all placeholder:text-slate-600"
                    />
                  </div>
                </div>

                {/* Status Filter */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Status</label>
                  <div className="relative">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
                    <select 
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as any)}
                      className="bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-10 py-3 text-sm text-white font-bold focus:ring-2 focus:ring-accent/50 outline-none appearance-none cursor-pointer transition-all"
                    >
                      <option value="ALL" className="bg-[#08090c] text-white">All Statuses</option>
                      <option value="PENDING" className="bg-[#08090c] text-white">Pending</option>
                      <option value="IN_PROGRESS" className="bg-[#08090c] text-white">In Progress</option>
                      <option value="COMPLETED" className="bg-[#08090c] text-white">Completed</option>
                      <option value="CANCELLED" className="bg-[#08090c] text-white">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Date Range */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Date From</label>
                  <input 
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-bold focus:ring-2 focus:ring-accent/50 outline-none transition-all [color-scheme:dark]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Date To</label>
                  <input 
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-bold focus:ring-2 focus:ring-accent/50 outline-none transition-all [color-scheme:dark]"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button 
                    onClick={fetchRequests}
                    className="bg-accent text-black font-black uppercase italic text-[10px] px-6 py-3 rounded-xl shadow-[0_0_20px_rgba(217,255,63,0.2)] hover:shadow-[0_0_30px_rgba(217,255,63,0.4)] transition-all flex items-center gap-2"
                  >
                    <Search className="w-3.5 h-3.5" />
                    Apply
                  </button>
                  <button 
                    onClick={() => {
                      clearFilters();
                      setTimeout(fetchRequests, 10);
                    }}
                    className="bg-white/5 border border-white/10 text-slate-400 font-black uppercase italic text-[10px] px-4 py-3 rounded-xl hover:bg-white/10 hover:text-white transition-all flex items-center gap-2"
                    title="Clear All Filters"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-500 text-[10px] uppercase font-black tracking-[0.2em] border-b border-white/10">
                    <th className="px-10 py-6 font-black">Customer</th>
                    <th className="px-10 py-6 font-black">Vehicle</th>
                    <th className="px-10 py-6 font-black">Service Type</th>
                    <th className="px-10 py-6 font-black">Date</th>
                    <th className="px-10 py-6 font-black">Status</th>
                    <th className="px-10 py-6 font-black text-right">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredRequests.map(req => (
                    <tr key={req.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-10 py-8">
                        <div className="text-sm font-bold text-white group-hover:text-accent transition-colors">{req.user?.name}</div>
                        <div className="text-[10px] text-slate-500 font-medium mt-1">{req.user?.email}</div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="text-sm text-slate-300 font-bold">{req.car?.brand} {req.car?.model}</div>
                        <div className="text-[10px] text-slate-500 font-mono tracking-widest">{req.car?.number}</div>
                      </td>
                      <td className="px-10 py-8 text-sm text-slate-300 font-bold tracking-tight">
                        {req.serviceType}
                        {req.cost && <div className="text-[10px] text-accent font-black mt-1 italic">₹{req.cost.toLocaleString()}</div>}
                      </td>
                      <td className="px-10 py-8">
                        <div className="text-sm text-slate-500 font-mono italic">{req.bookingDate}</div>
                        <div className="text-[10px] text-accent font-black uppercase italic tracking-widest mt-1">{req.bookingTime}</div>
                      </td>
                      <td className="px-10 py-8">
                        <StatusBadge status={req.status} />
                      </td>
                      <td className="px-10 py-8 text-right">
                        <div className="flex items-center justify-end space-x-2">
                            <select 
                              value={req.status}
                              onChange={(e) => updateStatus(req.id!, e.target.value as ServiceStatus, req.cost)}
                              className="bg-white/5 border border-white/10 text-[10px] font-black uppercase text-white rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-accent/50 cursor-pointer transition-all hover:bg-white/10"
                            >
                              <option value="PENDING" className="bg-[#08090c] text-white">Pending</option>
                              <option value="IN_PROGRESS" className="bg-[#08090c] text-white">In Progress</option>
                              <option value="COMPLETED" className="bg-[#08090c] text-white">Completed</option>
                              <option value="CANCELLED" className="bg-[#08090c] text-white">Cancelled</option>
                            </select>
                          <button 
                            onClick={() => deleteRequest(req.id!)}
                            className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                            title="Delete Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredRequests.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-10 py-12 text-center text-slate-600 text-xs font-black uppercase tracking-widest italic">
                        No service requests found matching your filter
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}


        {activeTab === 'analytics' && analyticsData && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
            {/* Analytics Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { label: 'Total Volume', value: analyticsData.totalServices, icon: ClipboardList, color: 'text-accent', bg: 'bg-accent/10' },
                { label: 'Avg per Month', value: (analyticsData.totalServices / 6).toFixed(1), icon: Calendar, color: 'text-blue-400', bg: 'bg-blue-400/10' },
                { label: 'Completion Rate', value: analyticsData.totalServices > 0 ? Math.round((analyticsData.completedServices / analyticsData.totalServices) * 100) + '%' : '0%', icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
              ].map((stat, i) => (
                <div key={i} className="glass-card p-8 group glass-card-hover">
                  <div className="flex items-center justify-between mb-8">
                    <div className={cn("p-5 rounded-2xl transition-transform group-hover:scale-110", stat.bg)}>
                      <stat.icon className={cn("w-7 h-7", stat.color)} />
                    </div>
                    <span className="text-5xl font-black text-white tracking-tighter italic text-glow-accent">{stat.value}</span>
                  </div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Volume Chart */}
              <div className="glass-card p-8">
                <h3 className="text-lg font-black text-white uppercase italic tracking-tight mb-8">Monthly Service Volume</h3>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsData.monthlyStats}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                      <XAxis 
                        dataKey="month" 
                        stroke="#64748b" 
                        fontSize={10} 
                        fontWeight="900" 
                        tickLine={false} 
                        axisLine={false} 
                      />
                      <YAxis 
                        stroke="#64748b" 
                        fontSize={10} 
                        fontWeight="900" 
                        tickLine={false} 
                        axisLine={false} 
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#08090c', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px' }}
                        itemStyle={{ color: '#d9ff3f', fontWeight: 'bold' }}
                      />
                      <Bar 
                        dataKey="count" 
                        fill="#d9ff3f" 
                        radius={[6, 6, 0, 0]} 
                        barSize={30}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Service Distribution */}
              <div className="glass-card p-8">
                <h3 className="text-lg font-black text-white uppercase italic tracking-tight mb-8">Service Type Distribution</h3>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analyticsData.serviceTypeStats}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="count"
                        nameKey="type"
                      >
                        {analyticsData.serviceTypeStats.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={[
                            '#d9ff3f', // Accent
                            '#34d399', // Emerald
                            '#60a5fa', // Blue
                            '#f472b6', // Pink
                            '#fbbf24', // Amber
                            '#818cf8', // Indigo
                          ][index % 6]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#08090c', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px' }}
                        itemStyle={{ color: '#fff', fontSize: '12px' }}
                      />
                      <Legend 
                        verticalAlign="bottom" 
                        height={36} 
                        formatter={(value) => <span className="text-[10px] font-black text-slate-500 uppercase italic ml-2">{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Top Requested Services List */}
            <div className="glass-card p-8">
               <h3 className="text-lg font-black text-white uppercase italic tracking-tight mb-8">Service Demand Ranking</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {analyticsData.serviceTypeStats.slice(0, 8).map((item: any, i: number) => (
                    <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                       <span className="text-[10px] font-black text-white uppercase italic truncate max-w-[150px]">{item.type}</span>
                       <span className="text-accent font-black italic">{item.count}</span>
                    </div>
                  ))}
               </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};
