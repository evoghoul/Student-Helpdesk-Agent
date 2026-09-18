"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchAllTickets, updateTicketStatus } from '@/actions/admin';
import { getAnalyticsData } from '@/actions/analytics';
import { getAllBroadcasts, toggleBroadcastStatus, deleteBroadcast, createBroadcast } from '@/actions/broadcasts';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { 
  LogOut, 
  ShieldCheck, 
  Search, 
  Filter, 
  MessageSquareWarning, 
  Users, 
  CheckCircle2,
  Clock,
  XCircle,
  MoreVertical,
  Activity,
  Calendar,
  PackageSearch,
  BarChart3,
  Radio,
  Plus,
  Trash2
} from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

interface Grievance {
  id: string;
  description: string;
  status: string;
  timestamp: string;
  withdrawal_reason: string | null;
}

interface ClubApp {
  id: number;
  club_id: string;
  student_name: string;
  status: string;
  timestamp: string;
  withdrawal_reason: string | null;
}

interface BookingItem {
  id: number;
  facility_id: number;
  student_id: string;
  date: string;
  start_time: string;
  end_time: string;
  purpose: string;
  status: string;
}

interface LostFoundItem {
  id: number;
  student_id: string;
  type: string;
  title: string;
  description: string;
  tags: string;
  contact_info: string;
  status: string;
  date_posted: string;
  image_url: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<any>(null);
  
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [clubApps, setClubApps] = useState<ClubApp[]>([]);
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [lostAndFound, setLostAndFound] = useState<LostFoundItem[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [broadcasts, setBroadcasts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'grievances' | 'clubs' | 'bookings' | 'lost_found' | 'analytics' | 'broadcasts'>('grievances');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [newBroadcastMsg, setNewBroadcastMsg] = useState('');
  const [newBroadcastType, setNewBroadcastType] = useState('info');

  useEffect(() => {
    // Check authentication
    const session = localStorage.getItem('adminSession');
    if (!session) {
      router.push('/admin/login');
      return;
    }
    try {
      setAdminUser(JSON.parse(session));
      loadData();
    } catch (e) {
      router.push('/admin/login');
    }
  }, [router]);

  const loadData = async () => {
    setLoading(true);
    const res = await fetchAllTickets();
    if (res.success) {
      setGrievances((res.grievances as Grievance[]) || []);
      setClubApps((res.clubApps as ClubApp[]) || []);
      setBookings((res.bookings as BookingItem[]) || []);
      setLostAndFound((res.lostAndFound as LostFoundItem[]) || []);
    }
    
    const analyticsRes = await getAnalyticsData();
    if (analyticsRes.success) {
      setAnalytics(analyticsRes.data);
    }
    
    const broadcastsRes = await getAllBroadcasts();
    if (broadcastsRes.success) {
      setBroadcasts(broadcastsRes.broadcasts || []);
    }
    
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    router.push('/admin/login');
  };

  const handleStatusUpdate = async (id: string | number, type: 'grievance' | 'club', newStatus: string) => {
    const res = await updateTicketStatus(id.toString(), type, newStatus);
    if (res.success) {
      loadData(); // Refresh the list
    } else {
      alert(res.error || 'Failed to update status');
    }
  };

  const handleCreateBroadcast = async () => {
    if (!newBroadcastMsg.trim()) return;
    const res = await createBroadcast(newBroadcastMsg, newBroadcastType);
    if (res.success) {
      setNewBroadcastMsg('');
      loadData();
    }
  };

  const handleToggleBroadcast = async (id: number, currentStatus: number) => {
    await toggleBroadcastStatus(id, !currentStatus);
    loadData();
  };

  const handleDeleteBroadcast = async (id: number) => {
    await deleteBroadcast(id);
    loadData();
  };

  const getStatusBadgeColor = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('resolved') || s.includes('approved') || s.includes('confirmed') || s.includes('claimed')) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (s.includes('withdrawn') || s.includes('rejected') || s.includes('cancelled')) return 'bg-rose-100 text-rose-700 border-rose-200';
    if (s.includes('investigation') || s.includes('forwarded') || s.includes('open') || s.includes('pending')) return 'bg-amber-100 text-amber-700 border-amber-200';
    return 'bg-blue-100 text-blue-700 border-blue-200';
  };

  const getStatusIcon = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('resolved') || s.includes('approved')) return <CheckCircle2 className="w-3.5 h-3.5 mr-1" />;
    if (s.includes('withdrawn') || s.includes('rejected')) return <XCircle className="w-3.5 h-3.5 mr-1" />;
    if (s.includes('investigation') || s.includes('forwarded')) return <Activity className="w-3.5 h-3.5 mr-1" />;
    return <Clock className="w-3.5 h-3.5 mr-1" />;
  };

  if (!adminUser) return null; // Prevent flash of unauthorized content

  const filteredGrievances = grievances.filter(g => 
    g.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    g.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredClubApps = clubApps.filter(c => 
    c.student_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.club_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBookings = bookings.filter(b => 
    b.student_id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.purpose.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredLostAndFound = lostAndFound.filter(l => 
    l.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    l.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.student_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center shadow-sm">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg leading-tight text-slate-900">Nodal Officer Portal</h1>
                <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">Command Center</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="hidden sm:flex items-center gap-2 text-sm text-slate-600 font-medium">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  {adminUser.name.charAt(0)}
                </div>
                <div>
                  <div className="text-slate-900">{adminUser.name}</div>
                  <div className="text-xs text-slate-500">{adminUser.role}</div>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                title="Sign out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center shrink-0">
              <MessageSquareWarning className="w-6 h-6 text-rose-600" />
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900">{grievances.length}</div>
              <div className="text-sm font-medium text-slate-500">Grievances</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
              <Users className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900">{clubApps.length}</div>
              <div className="text-sm font-medium text-slate-500">Club Apps</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900">{bookings.length}</div>
              <div className="text-sm font-medium text-slate-500">Bookings</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
              <PackageSearch className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900">{lostAndFound.length}</div>
              <div className="text-sm font-medium text-slate-500">Lost/Found</div>
            </div>
          </div>
        </div>

        {/* Control Bar */}
        <div className="bg-white p-4 rounded-t-2xl border border-slate-200 border-b-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setActiveTab('grievances')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === 'grievances' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Grievances
            </button>
            <button
              onClick={() => setActiveTab('clubs')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === 'clubs' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Club Apps
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === 'bookings' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Bookings
            </button>
            <button
              onClick={() => setActiveTab('lost_found')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === 'lost_found' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Lost & Found
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${
                activeTab === 'analytics' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <BarChart3 className="w-4 h-4" /> Analytics
            </button>
            <button
              onClick={() => setActiveTab('broadcasts')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${
                activeTab === 'broadcasts' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Radio className="w-4 h-4" /> Broadcasts
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by ID, name, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white border border-slate-200 rounded-b-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  <th className="px-6 py-4">Tracking ID / User</th>
                  <th className="px-6 py-4">Details</th>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Current Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                      <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-3"></div>
                      Loading data...
                    </td>
                  </tr>
                ) : activeTab === 'analytics' ? (
                  <tr>
                    <td colSpan={5} className="p-6">
                      {analytics && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="bg-white p-4 rounded-xl border border-slate-200">
                            <h3 className="text-lg font-semibold mb-4">Grievance Status Distribution</h3>
                            <div className="h-64">
                              <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                  <Pie
                                    data={analytics.grievances}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label
                                  >
                                    {analytics.grievances.map((entry: any, index: number) => (
                                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                  </Pie>
                                  <RechartsTooltip />
                                  <Legend />
                                </PieChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                          
                          <div className="bg-white p-4 rounded-xl border border-slate-200">
                            <h3 className="text-lg font-semibold mb-4">Facility Bookings</h3>
                            <div className="h-64">
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={analytics.bookings}>
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis dataKey="name" />
                                  <YAxis />
                                  <RechartsTooltip />
                                  <Bar dataKey="value" fill="#3b82f6" />
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ) : activeTab === 'broadcasts' ? (
                  <tr>
                    <td colSpan={5} className="p-6 bg-slate-50/50">
                      <div className="max-w-4xl mx-auto space-y-6">
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex gap-4 items-center">
                          <input 
                            type="text" 
                            className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Enter urgent broadcast message..."
                            value={newBroadcastMsg}
                            onChange={e => setNewBroadcastMsg(e.target.value)}
                          />
                          <select 
                            className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            value={newBroadcastType}
                            onChange={e => setNewBroadcastType(e.target.value)}
                          >
                            <option value="info">Info</option>
                            <option value="warning">Warning</option>
                            <option value="emergency">Emergency</option>
                          </select>
                          <button 
                            onClick={handleCreateBroadcast}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                          >
                            <Plus className="w-4 h-4" /> Push Alert
                          </button>
                        </div>
                        
                        <div className="space-y-3">
                          <h3 className="font-semibold text-slate-900">Broadcast History</h3>
                          {broadcasts.length === 0 ? (
                            <p className="text-sm text-slate-500">No broadcasts found.</p>
                          ) : broadcasts.map((b: any) => (
                            <div key={b.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                    b.type === 'emergency' ? 'bg-red-100 text-red-700' : 
                                    b.type === 'warning' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                                  }`}>
                                    {b.type.toUpperCase()}
                                  </span>
                                  <span className="text-xs text-slate-500">{new Date(b.timestamp).toLocaleString()}</span>
                                </div>
                                <p className="text-sm text-slate-800 font-medium">{b.message}</p>
                              </div>
                              <div className="flex items-center gap-3">
                                <label className="flex items-center cursor-pointer">
                                  <div className="relative">
                                    <input type="checkbox" className="sr-only" checked={b.is_active === 1} onChange={() => handleToggleBroadcast(b.id, b.is_active)} />
                                    <div className={`block w-10 h-6 rounded-full transition-colors ${b.is_active ? 'bg-blue-600' : 'bg-slate-300'}`}></div>
                                    <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${b.is_active ? 'transform translate-x-4' : ''}`}></div>
                                  </div>
                                  <div className="ml-2 text-xs font-medium text-slate-600">
                                    {b.is_active ? 'Active' : 'Inactive'}
                                  </div>
                                </label>
                                <button onClick={() => handleDeleteBroadcast(b.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : activeTab === 'grievances' ? (
                  filteredGrievances.length > 0 ? filteredGrievances.map(g => (
                    <tr key={g.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 align-top">
                        <span className="font-mono font-medium text-slate-700 bg-slate-100 px-2 py-1 rounded-md text-xs">{g.id}</span>
                      </td>
                      <td className="px-6 py-4 align-top max-w-md">
                        <p className="text-slate-800 line-clamp-2">{g.description}</p>
                        {g.withdrawal_reason && (
                          <div className="mt-2 text-xs bg-rose-50 border border-rose-100 text-rose-700 px-2.5 py-1.5 rounded-md">
                            <strong>Withdrawal Reason:</strong> {g.withdrawal_reason}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 align-top text-slate-500 whitespace-nowrap">
                        {new Date(g.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 align-top whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeColor(g.status)}`}>
                          {getStatusIcon(g.status)}
                          {g.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 align-top text-right">
                        <select 
                          disabled={g.status === 'Withdrawn'}
                          className="text-xs bg-white border border-slate-200 rounded-md px-2 py-1.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:bg-slate-50"
                          value={g.status}
                          onChange={(e) => handleStatusUpdate(g.id, 'grievance', e.target.value)}
                        >
                          <option value="Received & Secured">Received & Secured</option>
                          <option value="Under Investigation">Under Investigation</option>
                          <option value="Action Taken">Action Taken</option>
                          <option value="Resolved">Resolved</option>
                          <option value="Rejected">Rejected</option>
                          <option value="Withdrawn" disabled>Withdrawn</option>
                        </select>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500">No grievances found.</td></tr>
                  )
                ) : activeTab === 'clubs' ? (
                  filteredClubApps.length > 0 ? filteredClubApps.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 align-top">
                        <div className="font-semibold text-slate-900">{c.student_name}</div>
                        <div className="text-xs text-slate-500 mt-1 font-mono">App #{c.id}</div>
                      </td>
                      <td className="px-6 py-4 align-top">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 font-medium text-xs border border-indigo-100">
                          {c.club_id}
                        </span>
                        {c.withdrawal_reason && (
                          <div className="mt-2 text-xs bg-rose-50 border border-rose-100 text-rose-700 px-2.5 py-1.5 rounded-md">
                            <strong>Withdrawal Reason:</strong> {c.withdrawal_reason}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 align-top text-slate-500 whitespace-nowrap">
                        {new Date(c.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 align-top whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeColor(c.status)}`}>
                          {getStatusIcon(c.status)}
                          {c.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 align-top text-right">
                        <select 
                          disabled={c.status === 'Withdrawn'}
                          className="text-xs bg-white border border-slate-200 rounded-md px-2 py-1.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:bg-slate-50"
                          value={c.status}
                          onChange={(e) => handleStatusUpdate(c.id, 'club', e.target.value)}
                        >
                          <option value="Application Forwarded">Application Forwarded</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Approved">Approved</option>
                          <option value="Rejected">Rejected</option>
                          <option value="Waitlisted">Waitlisted</option>
                          <option value="Withdrawn" disabled>Withdrawn</option>
                        </select>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500">No club applications found.</td></tr>
                  )
                ) : activeTab === 'bookings' ? (
                  filteredBookings.length > 0 ? filteredBookings.map(b => (
                    <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 align-top">
                        <div className="font-semibold text-slate-900">{b.student_id}</div>
                        <div className="text-xs text-slate-500 mt-1 font-mono">Booking #{b.id}</div>
                      </td>
                      <td className="px-6 py-4 align-top">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 font-medium text-xs border border-amber-100">
                          Facility #{b.facility_id}
                        </span>
                        <div className="mt-2 text-xs text-slate-700">
                          <strong>Purpose:</strong> {b.purpose}
                        </div>
                      </td>
                      <td className="px-6 py-4 align-top text-slate-500 whitespace-nowrap text-xs">
                        <div><strong>Date:</strong> {b.date}</div>
                        <div>{b.start_time} - {b.end_time}</div>
                      </td>
                      <td className="px-6 py-4 align-top whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeColor(b.status)}`}>
                          {getStatusIcon(b.status)}
                          {b.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 align-top text-right">
                        <select 
                          className="text-xs bg-white border border-slate-200 rounded-md px-2 py-1.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={b.status}
                          onChange={(e) => handleStatusUpdate(b.id, 'booking' as any, e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500">No bookings found.</td></tr>
                  )
                ) : (
                  filteredLostAndFound.length > 0 ? filteredLostAndFound.map(l => (
                    <tr key={l.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 align-top">
                        <div className="font-semibold text-slate-900">{l.student_id}</div>
                        <div className="text-xs text-slate-500 mt-1 font-mono">Post #{l.id} ({l.type.toUpperCase()})</div>
                      </td>
                      <td className="px-6 py-4 align-top">
                        <div className="font-semibold text-slate-800 text-sm">{l.title}</div>
                        <p className="text-xs text-slate-600 line-clamp-2 mt-1">{l.description}</p>
                      </td>
                      <td className="px-6 py-4 align-top text-slate-500 whitespace-nowrap text-xs">
                        {new Date(l.date_posted).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 align-top whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeColor(l.status)}`}>
                          {getStatusIcon(l.status)}
                          {l.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 align-top text-right">
                        <select 
                          className="text-xs bg-white border border-slate-200 rounded-md px-2 py-1.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={l.status}
                          onChange={(e) => handleStatusUpdate(l.id, 'lost_found' as any, e.target.value)}
                        >
                          <option value="open">Open</option>
                          <option value="claimed">Claimed</option>
                          <option value="resolved">Resolved</option>
                        </select>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500">No lost and found items.</td></tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
