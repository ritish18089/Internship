import React, { useState, useEffect } from 'react';
import {
  Car as CarIcon,
  Plus,
  History,
  LayoutDashboard,
  LogOut,
  ChevronRight,
  Settings,
  PlusCircle,
  Clock,
  CheckCircle2,
  Trash2,
  User as UserIcon,
  Mail,
  Phone,
  Camera,
  Shield,
  Lock,
  Menu,
  X,
  Edit2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Car, ServiceRequest, Notification } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { cn } from '../lib/utils';
import { Logo } from '../components/Logo';
import { api } from '../lib/api';


interface CustomerPortalProps {
  user: User;
  onLogout: () => void;
}

export const CustomerPortal = ({ user, onLogout }: CustomerPortalProps) => {
  const [cars, setCars] = useState<Car[]>([]);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'cars' | 'garrage' | 'history' | 'profile' | 'settings'>('dashboard');
  const [settingsSubTab, setSettingsSubTab] = useState<'profile' | 'security'>('profile');

  const [showAddCar, setShowAddCar] = useState(false);
  const [showRequest, setShowRequest] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [showEditCar, setShowEditCar] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);

  const SERVICE_COSTS: Record<string, number> = {
    "Full System Diagnostics": 900,
    "Brake System Overhaul": 1200,
    "Performance Tuning": 1500,
    "Suspension Geometry": 1000,
    "Battery Health Check": 500,
    "Fluid Management": 800,
    "Electrical System Check": 750,
    "Other": 500
  };

  // New Car State
  const [newCar, setNewCar] = useState({ brand: '', model: '', number: '' });

  // New Request State
  const [newRequest, setNewRequest] = useState({ 
    carId: '', 
    serviceType: '', 
    bookingDate: '', 
    bookingTime: '09:00 AM',
    cost: 0
  });

  // Profile State
  const [profile, setProfile] = useState({ 
    name: user.name, 
    phone: user.phone || '', 
    email: user.email, 
    password: '',
    oldPassword: '',
    confirmPassword: '',
    profileImage: user.profileImage || '' 
  });

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (newRequest.bookingDate) {
      fetchAvailableSlots(newRequest.bookingDate);
    }
  }, [newRequest.bookingDate]);

  const fetchAvailableSlots = async (date: string) => {
    try {
      const response = await api.get(`/services/slots/available?date=${date}`);
      setAvailableSlots(response.data);
    } catch (err) {
      console.error('Failed to fetch available slots', err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications/my');
      setNotifications(response.data);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [carsRes, requestsRes, notificationsRes] = await Promise.all([
        api.get('/cars'),
        api.get('/services/my'),
        api.get('/notifications/my')
      ]);
      setCars(carsRes.data);
      setRequests(requestsRes.data);
      setNotifications(notificationsRes.data);
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.put('/notifications/mark-all-read');
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Failed to mark all read', err);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Delete all notifications permanently?')) return;
    try {
      await api.delete('/notifications/clear-all');
      setNotifications([]);
    } catch (err) {
      console.error('Failed to clear notifications', err);
    }
  };

  const handleAddCar = async () => {
    if (!newCar.brand || !newCar.model || !newCar.number) return;
    try {
      const response = await api.post('/cars', newCar);
      setCars([...cars, response.data]);
      setNewCar({ brand: '', model: '', number: '' });
      setShowAddCar(false);
    } catch (err) {
      alert('Failed to add vehicle');
    }
  };

  const handleEditClick = (car: Car) => {
    setEditingCar({ ...car });
    setShowEditCar(true);
  };

  const handleUpdateCar = async () => {
    if (!editingCar || !editingCar.brand || !editingCar.model || !editingCar.number) return;
    try {
      const response = await api.put(`/cars/${editingCar.id}`, editingCar);
      setCars(cars.map(c => c.id === editingCar.id ? response.data : c));
      setShowEditCar(false);
      setEditingCar(null);
    } catch (err) {
      console.error('Failed to update vehicle', err);
    }
  };

  const handleRequestService = async () => {
    if (!newRequest.carId || !newRequest.serviceType || !newRequest.bookingDate || !newRequest.bookingTime) {
      alert('Please fill in all booking details');
      return;
    }
    try {
      const response = await api.post('/services', {
        serviceType: newRequest.serviceType,
        car: { id: newRequest.carId },
        bookingDate: newRequest.bookingDate,
        bookingTime: newRequest.bookingTime,
        cost: newRequest.cost
      });
      setRequests([response.data, ...requests]);
      setNewRequest({ carId: '', serviceType: '', bookingDate: '', bookingTime: '09:00 AM', cost: 0 });
      setShowRequest(false);
    } catch (err) {
      alert('Failed to submit request');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, profileImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
  };

  const deleteCar = async (id: number) => {
    if (confirm('Are you sure you want to remove this vehicle?')) {
      try {
        await api.delete(`/cars/${id}`);
        setCars(prev => prev.filter(c => c.id !== id));
        setRequests(prev => prev.filter(r => r.car?.id !== id));
      } catch (err) {
        alert('Failed to delete vehicle');
      }
    }
  };

  const deleteRequest = async (id: string) => {
    if (confirm('Are you sure you want to delete this service record?')) {
      try {
        await api.delete(`/services/${id}`);
        setRequests(prev => prev.filter(r => r.id !== id));
      } catch (err) {
        alert('Failed to delete service record');
      }
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const payload: any = { 
        name: profile.name, 
        phone: profile.phone, 
        email: profile.email,
        profileImage: profile.profileImage 
      };
      if (profile.password) {
        if (!validatePassword(profile.password)) {
          alert('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
          return;
        }
        if (profile.password !== profile.confirmPassword) {
          alert('New passwords do not match!');
          return;
        }
        payload.password = profile.password;
        payload.oldPassword = profile.oldPassword;
      }
      
      const response = await api.put('/users/profile', payload);
      
      // Update session seamlessly
      localStorage.setItem('user', JSON.stringify(response.data));
      alert('Profile updated successfully!');
      setProfile(prev => ({ ...prev, password: '', oldPassword: '', confirmPassword: '' }));
      
      // Force UI sync
      window.location.reload();
    } catch (err: any) {
      alert(err.response?.data || 'Failed to update profile');
    }
  };

  const SidebarItem = ({ id, icon: Icon, label, onClick }: { id?: string, icon: any, label: string, onClick?: () => void }) => (
    <button
      onClick={() => onClick ? onClick() : id && setActiveTab(id as any)}
      className={cn(
        "w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all group",
        id && activeTab === id
          ? "bg-accent text-black font-black shadow-[0_0_20px_rgba(217,255,63,0.2)]"
          : "text-slate-500 hover:text-white hover:bg-white/5"
      )}
    >
      <div className="flex items-center space-x-4">
        <Icon className={cn("w-5 h-5", id && activeTab === id ? "text-black" : "text-slate-500 group-hover:text-accent")} />
        <span className="uppercase tracking-widest text-xs font-black italic">{label}</span>
      </div>
      {id && activeTab === id && <ChevronRight className="w-4 h-4" />}
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
    <div className="flex min-h-screen bg-transparent relative">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-[70] w-80 bg-[#08090c] border-r border-white/5 p-8 flex flex-col transition-transform duration-500 lg:relative lg:translate-x-0 lg:z-20",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between mb-12 lg:block">
          <Logo size="md" />
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 text-slate-500 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <button 
          onClick={() => setActiveTab('profile')}
          className="mb-10 w-full p-6 rounded-[32px] bg-white/[0.01] border border-white/5 flex items-center gap-4 group hover:bg-white/[0.03] transition-all text-left cursor-pointer cyber-glow"
        >

          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-accent to-emerald-500 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/10 bg-[#08090c] flex items-center justify-center">
              {profile.profileImage ? (
                <img src={profile.profileImage} alt="User Profile" className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="w-6 h-6 text-slate-700" />
              )}
            </div>
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-black text-white italic uppercase truncate">{user.name}</p>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest truncate">{user.email}</p>
          </div>
        </button>

        <nav className="flex-1 space-y-3">
          <SidebarItem id="dashboard" icon={LayoutDashboard} label="Dashboard" onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }} />
          <SidebarItem id="cars" icon={CarIcon} label="My Vehicles" onClick={() => { setActiveTab('cars'); setIsSidebarOpen(false); }} />
          <SidebarItem onClick={() => { setShowRequest(true); setIsSidebarOpen(false); }} icon={PlusCircle} label="Request for Service" />
          <SidebarItem id="profile" icon={UserIcon} label="Profile" onClick={() => { setActiveTab('profile'); setIsSidebarOpen(false); }} />
          <SidebarItem id="history" icon={History} label="Service Status" onClick={() => { setActiveTab('history'); setIsSidebarOpen(false); }} />
          <SidebarItem id="settings" icon={Settings} label="Settings" onClick={() => { setActiveTab('settings'); setIsSidebarOpen(false); }} />
        </nav>

          <button
            onClick={onLogout}
            className="mt-auto flex items-center space-x-4 px-6 py-4 text-slate-500 hover:text-red-500 transition-colors group w-full"
          >
            <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span className="uppercase tracking-widest text-xs font-black italic">Logout</span>
          </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 p-6 md:p-8 lg:p-12 relative z-10 overflow-y-auto">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between mb-10 bg-white/[0.02] border border-white/5 p-4 rounded-3xl backdrop-blur-md sticky top-0 z-40">
          <Logo size="sm" />
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-3 bg-accent/10 border border-accent/20 rounded-2xl text-accent hover:bg-accent transition-all hover:text-black"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight italic uppercase">
              {activeTab === 'dashboard' ? 'Overview' : activeTab === 'cars' ? 'Garage' : activeTab === 'history' ? 'Service Status' : (activeTab === 'profile' || activeTab === 'settings') ? 'Customer Account' : 'Overview'}
            </h1>
            <div className="flex items-center gap-4 mt-2">
              <button 
                onClick={() => setActiveTab('profile')}
                className="w-8 h-8 rounded-full overflow-hidden border border-white/10 bg-[#08090c] flex items-center justify-center shrink-0 hover:border-accent/40 transition-all cursor-pointer group"
              >
                {profile.profileImage ? (
                  <img src={profile.profileImage} alt="Mini Profile" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                ) : (
                  <UserIcon className="w-4 h-4 text-slate-700 group-hover:text-accent" />
                )}
              </button>
              <p className="text-slate-500 font-medium text-sm md:text-base">
                Welcome back, {user.name} 
                {user.phone && <span className="hidden sm:inline-block ml-3 text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-full border border-accent/20 font-mono tracking-widest">{user.phone}</span>}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowRequest(true)}
            className="btn-primary flex items-center justify-center space-x-3 w-full md:w-auto"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Request Service</span>
          </button>
        </div>

        {activeTab === 'dashboard' && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-12">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

              {[
                { label: 'My Cars', value: cars.length, icon: CarIcon, color: 'text-accent', bg: 'bg-accent/10' },
                { label: 'Active Requests', value: requests.filter(r => r.status === 'PENDING' || r.status === 'IN_PROGRESS').length, icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
                { label: 'Completed Services', value: requests.filter(r => r.status === 'COMPLETED').length, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
              ].map((stat, i) => (
                <div key={i} className="glass-card p-8 group glass-card-hover">
                  <div className="flex items-center justify-between mb-8">
                    <div className={cn("p-5 rounded-2xl transition-transform group-hover:scale-110", stat.bg)}>
                      <stat.icon className={cn("w-7 h-7", stat.color)} />
                    </div>
                    <span className="text-5xl font-black text-white tracking-tighter italic text-glow-accent">{stat.value}</span>
                  </div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] font-sans">{stat.label}</p>
                </div>

              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="glass-card p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-lg font-black text-white uppercase italic tracking-tight">Active Vehicles</h3>
                  <button onClick={() => setShowAddCar(true)} className="text-accent text-[10px] font-black uppercase tracking-widest hover:underline">Add New</button>
                </div>
                <div className="space-y-4">
                  {cars.slice(0, 3).map(car => (
                    <div key={car.id} className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                          <CarIcon className="w-6 h-6 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{car.brand} {car.model}</p>
                          <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">{car.number}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-600" />
                    </div>
                  ))}
                  {cars.length === 0 && <p className="text-slate-500 text-center py-4">No vehicles found.</p>}
                </div>
              </div>

              <div className="glass-card p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-lg font-black text-white uppercase italic tracking-tight">Recent Service</h3>
                  <button onClick={() => setActiveTab('history')} className="text-accent text-[10px] font-black uppercase tracking-widest hover:underline">View All</button>
                </div>
                <div className="space-y-4">
                  {requests.slice(0, 3).map(req => (
                    <div key={req.id} className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                      <div>
                        <p className="text-sm font-bold text-white">{req.serviceType}</p>
                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">
                          {req.bookingDate} <span className="text-accent/60 mx-1">/</span> {req.bookingTime}
                        </p>
                      </div>
                      <StatusBadge status={req.status} />
                    </div>
                  ))}
                  {requests.length === 0 && <p className="text-slate-500 text-center py-4">No recent services.</p>}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {(activeTab === 'cars' || activeTab === 'garrage') && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tight">My Garage</h2>
              <button onClick={() => setShowAddCar(true)} className="btn-primary py-2.5">Add Vehicle</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {cars.map(car => (
                <div key={car.id} className="glass-card p-8 group hover:border-accent/30 transition-all relative">
                  <div className="absolute top-6 right-6 flex space-x-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleEditClick(car); }}
                      className="p-2 text-accent/50 hover:text-accent hover:bg-accent/10 rounded-xl transition-all"
                      title="Edit Vehicle"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteCar(car.id!); }}
                      className="p-2 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                      title="Remove Vehicle"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                    <CarIcon className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="text-xl font-black text-white italic uppercase tracking-tight mb-2">{car.brand} {car.model}</h3>
                  <p className="text-sm text-slate-500 font-mono tracking-[0.2em] uppercase">{car.number}</p>
                  <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Active Status</span>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card overflow-hidden">
            <div className="p-8 border-b border-white/10">
              <h2 className="text-xl font-black text-white italic uppercase tracking-tight">Service Status</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-500 text-[10px] uppercase font-black tracking-[0.2em] border-b border-white/10">
                    <th className="px-10 py-6 font-black">Service Type</th>
                    <th className="px-10 py-6 font-black">Vehicle</th>
                    <th className="px-10 py-6 font-black">Scheduled Date</th>
                    <th className="px-10 py-6 font-black">Time Slot</th>
                    <th className="px-10 py-6 font-black">Service Cost</th>
                    <th className="px-10 py-6 font-black">Status</th>
                    <th className="px-10 py-6 font-black text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {requests.map(req => (
                    <tr key={req.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-10 py-8 text-sm font-bold text-white">{req.serviceType}</td>
                      <td className="px-10 py-8 text-sm text-slate-400 font-medium">
                        {req.car ? `${req.car.brand} ${req.car.model}` : '—'}
                      </td>
                      <td className="px-10 py-8 text-sm text-slate-500 font-mono italic">{req.bookingDate}</td>
                      <td className="px-10 py-8 text-sm text-accent font-black italic tracking-widest uppercase">{req.bookingTime}</td>
                      <td className="px-10 py-8 text-sm text-white font-black">
                        {req.cost ? `₹${req.cost.toLocaleString()}` : '—'}
                      </td>
                      <td className="px-10 py-8">
                        <StatusBadge status={req.status} />
                      </td>
                      <td className="px-10 py-8 text-right">
                        <button 
                          onClick={() => deleteRequest(req.id)}
                          className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1 space-y-8">
              <div className="glass-card p-10 flex flex-col items-center">
                <div className="relative group mb-10">
                  <div className="absolute -inset-1 bg-gradient-to-r from-accent to-emerald-500 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-white/10 bg-[#08090c] flex items-center justify-center">
                    {profile.profileImage ? (
                      <img src={profile.profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon className="w-20 h-20 text-slate-700" />
                    )}
                    <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <Camera className="w-8 h-8 text-accent mb-2" />
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">Change Photo</span>
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                    </label>
                  </div>
                </div>

                <div className="w-full space-y-6 pt-6 border-t border-white/5">
                  <div className="flex items-center space-x-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                    <div className="p-2.5 rounded-xl bg-accent/10">
                      <Mail className="w-4 h-4 text-accent" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Email Address</p>
                      <p className="text-sm font-bold text-white truncate">{profile.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                    <div className="p-2.5 rounded-xl bg-emerald-500/10">
                      <Phone className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Current Phone Number</p>
                      <p className="text-sm font-bold text-white tracking-widest">{profile.phone || 'Not Set'}</p>
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2 space-y-8">
              <div className="glass-card p-10 h-full flex flex-col">
                <div className="flex items-center justify-between mb-10">
                  <h2 className="text-2xl font-black text-white italic uppercase tracking-tight">System Notifications</h2>
                  <div className="flex items-center space-x-6">
                    {notifications.length > 0 && (
                      <div className="flex items-center space-x-4">
                        {notifications.some(n => !n.isRead) && (
                          <button 
                            onClick={handleMarkAllRead}
                            className="text-[9px] font-black text-slate-500 hover:text-accent uppercase tracking-widest transition-colors"
                          >
                            Mark All as Read
                          </button>
                        )}
                        <button 
                          onClick={handleClearAll}
                          className="text-[9px] font-black text-slate-500 hover:text-red-500 uppercase tracking-widest transition-colors"
                        >
                          Clear All
                        </button>
                      </div>
                    )}
                    <div className="flex items-center space-x-3">
                      <span className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">Live Feed</span>
                      <div className="w-2 h-2 bg-accent rounded-full animate-pulse shadow-[0_0_10px_rgba(217,255,63,0.5)]" />
                    </div>
                  </div>
                </div>

                <div className="flex-1 space-y-4 overflow-y-auto max-h-[600px] pr-4 custom-scrollbar">
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <div key={notif.id} className={cn(
                        "p-8 rounded-3xl border transition-all group relative overflow-hidden",
                        notif.isRead 
                          ? "bg-white/[0.01] border-white/5 opacity-60" 
                          : "bg-white/[0.03] border-white/10 hover:border-accent/20"
                      )}>
                        <div className={cn(
                          "absolute top-0 left-0 w-1 h-full bg-accent transition-opacity",
                          notif.isRead ? "opacity-0" : "opacity-100"
                        )} />
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-xl bg-white/5 group-hover:bg-accent/10 transition-colors">
                              <History className="w-4 h-4 text-slate-400 group-hover:text-accent" />
                            </div>
                            <span className="text-[10px] font-black text-white uppercase italic tracking-tight">Service Update</span>
                          </div>
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            {new Date(notif.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed font-medium">
                          {notif.message}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center py-24">
                      <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                        <Clock className="w-10 h-10 text-slate-800" />
                      </div>
                      <p className="text-slate-500 font-black uppercase tracking-[0.2em] text-xs italic">No messages from administrative center</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-12">
            {/* Sub Tabs */}
            <div className="flex items-center space-x-8 border-b border-white/5 pb-6">
              {[
                { id: 'profile', label: 'Profile Settings', icon: UserIcon },
                { id: 'security', label: 'Security Settings', icon: Shield }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSettingsSubTab(tab.id as any)}
                  className={cn(
                    "flex items-center space-x-3 px-6 py-3 rounded-2xl transition-all relative group",
                    settingsSubTab === tab.id
                      ? "text-accent bg-accent/5 backdrop-blur-md"
                      : "text-slate-500 hover:text-white"
                  )}
                >
                  <tab.icon className={cn("w-4 h-4", settingsSubTab === tab.id ? "text-accent" : "text-slate-500 group-hover:text-white")} />
                  <span className="uppercase tracking-widest text-[10px] font-black italic">{tab.label}</span>
                  {settingsSubTab === tab.id && (
                    <motion.div layoutId="subtab-active" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
                  )}
                </button>
              ))}
            </div>

            <div className="max-w-4xl">
              {settingsSubTab === 'profile' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-10 space-y-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-8">
                      <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-accent to-emerald-500 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                        <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-white/10 bg-[#08090c] flex items-center justify-center">
                          {profile.profileImage ? (
                            <img src={profile.profileImage} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                            <UserIcon className="w-10 h-10 text-slate-700" />
                          )}
                          <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <Camera className="w-5 h-5 text-accent mb-1" />
                            <span className="text-[8px] font-black text-white uppercase tracking-widest">Update</span>
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                          </label>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-white italic uppercase tracking-tight">Account Information</h3>
                        <p className="text-slate-500 text-xs mt-1">Manage your public profile and contact details</p>
                      </div>
                    </div>
                    <UserIcon className="w-8 h-8 text-white/10" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Full Name</label>
                      <input
                        className="input-field"
                        value={profile.name}
                        onChange={e => setProfile({ ...profile, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Current Phone Number</label>
                      <input
                        className="input-field"
                        placeholder="e.g. +1 234 567 890"
                        value={profile.phone}
                        onChange={e => setProfile({ ...profile, phone: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Email Address</label>
                    <input
                      className="input-field"
                      value={profile.email}
                      onChange={e => setProfile({ ...profile, email: e.target.value })}
                    />
                  </div>
                  
                  <div className="pt-6 border-t border-white/5">
                    <button onClick={handleUpdateProfile} className="btn-primary px-12">Update Profile</button>
                  </div>
                </motion.div>
              )}

              {settingsSubTab === 'security' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-10 space-y-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-black text-white italic uppercase tracking-tight">Login Credentials</h3>
                      <p className="text-slate-500 text-xs mt-1">Update your password to keep your account secure</p>
                    </div>
                    <Lock className="w-8 h-8 text-white/10" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Current Password</label>
                      <input
                        type="password"
                        placeholder="Enter current password"
                        className="input-field"
                        value={profile.oldPassword}
                        onChange={e => setProfile({ ...profile, oldPassword: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">New Password</label>
                      <input
                        type="password"
                        placeholder="Enter new password"
                        className="input-field"
                        value={profile.password}
                        onChange={e => setProfile({ ...profile, password: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2 max-w-md">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Confirm New Password</label>
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      className="input-field"
                      value={profile.confirmPassword}
                      onChange={e => setProfile({ ...profile, confirmPassword: e.target.value })}
                    />
                    {profile.password && profile.confirmPassword && profile.password !== profile.confirmPassword && (
                      <p className="text-[9px] text-red-500 mt-2 font-bold italic tracking-widest uppercase">Passwords do not match!</p>
                    )}
                    <p className="text-[9px] text-slate-600 mt-2 italic">* Required only if changing password</p>
                  </div>

                  <div className="pt-6 border-t border-white/5">
                    <button onClick={handleUpdateProfile} className="btn-primary px-12">Save Security Settings</button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      {showAddCar && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card p-10 w-full max-w-md border-accent/20">
            <h3 className="text-2xl font-black text-white italic mb-8 uppercase tracking-tight">Add New Vehicle</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Brand</label>
                <input
                  className="input-field"
                  placeholder="e.g. Toyota"
                  value={newCar.brand}
                  onChange={e => setNewCar({ ...newCar, brand: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Model</label>
                <input
                  className="input-field"
                  placeholder="e.g. Camry"
                  value={newCar.model}
                  onChange={e => setNewCar({ ...newCar, model: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Number Plate</label>
                <input
                  className="input-field font-mono"
                  placeholder="ABC-1234"
                  value={newCar.number}
                  onChange={e => setNewCar({ ...newCar, number: e.target.value })}
                />
              </div>
              <div className="flex space-x-4 pt-6">
                <button onClick={() => setShowAddCar(false)} className="flex-1 py-4 bg-white/5 text-slate-400 font-bold rounded-2xl hover:bg-white/10 transition-colors border border-white/10 uppercase tracking-widest text-[10px]">Cancel</button>
                <button onClick={handleAddCar} className="flex-1 btn-primary">Add Car</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {showRequest && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card p-10 w-full max-w-lg border-accent/20">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-white italic uppercase tracking-tight">Request Service</h3>
              <div className="p-2 rounded-xl bg-accent/10">
                <PlusCircle className="w-5 h-5 text-accent" />
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">1. Select Vehicle</label>
                <select
                  className="input-field appearance-none"
                  value={newRequest.carId}
                  onChange={e => setNewRequest({ ...newRequest, carId: e.target.value })}
                >
                  <option value="" className="bg-[#08090c] text-slate-400">Choose a car from your garage...</option>
                  {cars.map(c => <option key={c.id} value={c.id} className="bg-[#08090c] text-white">{c.brand} {c.model} ({c.number})</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">2. Type of Service</label>
                <select
                  className="input-field appearance-none"
                  value={newRequest.serviceType}
                  onChange={e => {
                    const type = e.target.value;
                    setNewRequest({ 
                      ...newRequest, 
                      serviceType: type,
                      cost: SERVICE_COSTS[type] || 0
                    });
                  }}
                >
                  <option value="" className="bg-[#08090c] text-slate-400">What does your car need?</option>
                  {Object.entries(SERVICE_COSTS).map(([type, cost]) => (
                    <option key={type} value={type} className="bg-[#08090c] text-white">
                      {type} (₹{cost})
                    </option>
                  ))}
                </select>
              </div>

              {newRequest.serviceType && (
                <div className="p-4 rounded-2xl bg-accent/5 border border-accent/10 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                      <span className="text-accent font-black text-xs italic">₹</span>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estimated Cost</span>
                  </div>
                  <span className="text-xl font-black text-accent italic">₹{newRequest.cost}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">3. Booking Date</label>
                  <input
                    type="date"
                    className="input-field"
                    min={new Date().toISOString().split('T')[0]}
                    value={newRequest.bookingDate}
                    onChange={e => setNewRequest({ ...newRequest, bookingDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">4. Booking Time</label>
                  <select
                    className="input-field appearance-none"
                    value={newRequest.bookingTime}
                    onChange={e => setNewRequest({ ...newRequest, bookingTime: e.target.value })}
                  >
                    <option value="" className="bg-[#08090c]">Select Time</option>
                    {availableSlots.map(slot => (
                      <option 
                        key={slot.time} 
                        value={slot.time} 
                        disabled={!slot.available}
                        className="bg-[#08090c] text-white"
                      >
                        {slot.time} {!slot.available ? '(Fully Booked)' : `(${slot.remaining} slots left)`}
                      </option>
                    ))}
                    {availableSlots.length === 0 && <option value="" disabled className="bg-[#08090c]">No slots available for this date</option>}
                  </select>
                </div>
              </div>

              <div className="flex space-x-4 pt-6">
                <button onClick={() => setShowRequest(false)} className="flex-1 py-4 bg-white/5 text-slate-400 font-bold rounded-2xl hover:bg-white/10 transition-colors border border-white/10 uppercase tracking-widest text-[10px]">Back</button>
                <button onClick={handleRequestService} className="flex-1 btn-primary shadow-[0_0_20px_rgba(217,255,63,0.3)]">Confirm Booking</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {showEditCar && editingCar && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card p-10 w-full max-w-md border-accent/20">
            <h3 className="text-2xl font-black text-white italic mb-8 uppercase tracking-tight">Edit Vehicle</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Brand</label>
                <input
                  className="input-field"
                  placeholder="e.g. Toyota"
                  value={editingCar.brand}
                  onChange={e => setEditingCar({ ...editingCar, brand: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Model</label>
                <input
                  className="input-field"
                  placeholder="e.g. Camry"
                  value={editingCar.model}
                  onChange={e => setEditingCar({ ...editingCar, model: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Number Plate</label>
                <input
                  className="input-field font-mono"
                  placeholder="ABC-1234"
                  value={editingCar.number}
                  onChange={e => setEditingCar({ ...editingCar, number: e.target.value })}
                />
              </div>
              <div className="flex space-x-4 pt-6">
                <button onClick={() => { setShowEditCar(false); setEditingCar(null); }} className="flex-1 py-4 bg-white/5 text-slate-400 font-bold rounded-2xl hover:bg-white/10 transition-colors border border-white/10 uppercase tracking-widest text-[10px]">Cancel</button>
                <button onClick={handleUpdateCar} className="flex-1 btn-primary">Update Car</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
