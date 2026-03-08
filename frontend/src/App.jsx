import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Search, Bell, Star, Settings, X } from 'lucide-react';
import Home from './pages/Homes';
import Incidents from './pages/Incidents';
import Metrics from './pages/Metrics';
import Playbooks from './pages/Playbooks';
import UserProfile from './pages/UserProfile';
import { threatService } from './services/api';

const Nav = ({ logs }) => {
  const [isStarred, setIsStarred] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const notifRef = useRef(null);
  const settingsRef = useRef(null);
  const location = useLocation();

  const criticalAlerts = logs.filter(l => l.risk_score >= 180).slice(-5);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) setShowNotifs(false);
      if (settingsRef.current && !settingsRef.current.contains(event.target)) setShowSettings(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-[#86b059] text-white px-6 py-2 flex justify-between items-center shadow-md sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <Link to="/" className="font-bold italic text-lg tracking-tighter">exabeam <span className="font-normal opacity-80 text-sm uppercase ml-1 tracking-widest">Analytics</span></Link>
        <div className="hidden md:flex gap-6 text-[11px] font-black ml-10 tracking-widest uppercase">
          {['HOME', 'INCIDENTS', 'METRICS', 'PLAYBOOKS'].map(tab => (
            <Link key={tab} to={tab === 'HOME' ? '/' : `/${tab.toLowerCase()}`} 
              className={`pb-1 transition-all ${location.pathname === (tab === 'HOME' ? '/' : `/${tab.toLowerCase()}`) ? 'border-b-2 border-white' : 'opacity-70 hover:opacity-100'}`}>
              {tab}
            </Link>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-5">
        <div className="relative group">
          <input type="text" placeholder="Search..." className="bg-[#759a4d] text-[11px] px-3 py-1 rounded-sm w-48 outline-none placeholder-white/60 focus:bg-[#6a8b45] transition-colors" />
          <Search size={14} className="absolute right-2 top-1.5 opacity-60" />
        </div>
        <button onClick={() => setIsStarred(!isStarred)} className={`transition-colors ${isStarred ? 'text-yellow-300' : 'hover:opacity-80'}`}>
          <Star size={18} fill={isStarred ? "currentColor" : "none"} />
        </button>
        <div className="relative" ref={notifRef}>
          <button onClick={() => setShowNotifs(!showNotifs)} className="relative hover:opacity-80">
            <Bell size={18} />
            {criticalAlerts.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-[8px] w-4 h-4 flex items-center justify-center rounded-full border border-[#86b059]">{criticalAlerts.length}</span>}
          </button>
          {showNotifs && (
            <div className="absolute right-0 mt-4 w-72 bg-white shadow-2xl border border-gray-200 rounded-md text-slate-800 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="p-3 border-b bg-gray-50 flex justify-between items-center">
                <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Security Alerts</span>
                <X size={14} className="cursor-pointer text-gray-400" onClick={() => setShowNotifs(false)} />
              </div>
              <div className="max-h-64 overflow-y-auto">
                {criticalAlerts.length === 0 ? <p className="p-6 text-center text-xs text-gray-400 italic">No threats</p> :
                  criticalAlerts.reverse().map((a, i) => (
                    <div key={i} className="p-3 border-b border-gray-50 hover:bg-red-50 cursor-pointer">
                      <p className="text-[10px] font-bold text-red-600 uppercase">{a.action}</p>
                      <p className="text-[9px] text-gray-500">{a.username} reached block threshold</p>
                    </div>
                  ))
                }
              </div>
            </div>
          )}
        </div>
        <div className="relative" ref={settingsRef}>
          <button onClick={() => setShowSettings(!showSettings)} className="hover:rotate-90 transition-transform duration-500"><Settings size={18} /></button>
          {showSettings && (
            <div className="absolute right-0 mt-4 w-56 bg-white shadow-xl border border-gray-200 rounded p-4 text-slate-800 z-50 animate-in fade-in slide-in-from-top-2">
              <h4 className="text-[10px] font-black uppercase text-gray-400 mb-3 border-b pb-1">System Status</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-[11px]"><span>Database</span><span className="text-green-500 font-bold font-mono text-[10px]">ONLINE</span></div>
                <div className="flex justify-between text-[11px]"><span>FastAPI</span><span className="text-green-500 font-bold font-mono text-[10px]">PORT 8000</span></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default function App() {
  const [logs, setLogs] = useState([]);
  const [agents, setAgents] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [logsRes, agentsRes] = await Promise.all([threatService.getLogs(), threatService.getAgentStatus()]);
        setLogs(logsRes.data || []);
        setAgents(agentsRes.data || {});
      } catch (err) { console.error("SIEM Connection Error", err); }
      finally { setLoading(false); }
    };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="flex h-screen items-center justify-center bg-[#f4f7f6] text-[10px] font-black uppercase tracking-widest text-gray-400">Syncing SIEM Database...</div>;

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#f4f7f6]">
        <Nav logs={logs} />
        <Routes>
          <Route path="/" element={<Home logs={logs} agents={agents} />} />
          <Route path="/incidents" element={<Incidents logs={logs} />} />
          <Route path="/metrics" element={<Metrics logs={logs} agents={agents} />} />
          <Route path="/playbooks" element={<Playbooks />} />
          <Route path="/profile/:username" element={<UserProfile />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}