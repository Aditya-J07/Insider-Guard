import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, ShieldAlert, Activity, MapPin, Monitor } from 'lucide-react';

export default function UserProfile() {
  const { username } = useParams();
  const [logs, setLogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/view-logs").then(res => {
      setLogs(res.data.filter(l => l.username === username).reverse());
    });
  }, [username]);

  const latest = logs[0] || {};

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <button onClick={() => navigate('/')} className="group flex items-center gap-2 text-[11px] text-blue-500 font-black uppercase hover:text-blue-700 transition-colors">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
      </button>
      
      <div className="bg-white border rounded-xl p-8 flex justify-between items-center shadow-sm relative overflow-hidden">
        <div className="flex gap-8 items-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-slate-50">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`} alt="avatar" />
            </div>
            <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-4 border-white rounded-full shadow-sm" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tight">{username}</h1>
            <div className="flex gap-6 mt-4">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase">
                <Monitor size={14} /> {latest.hostname || 'Unknown Host'}
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase">
                <MapPin size={14} /> {latest.ip_address}
              </div>
            </div>
          </div>
        </div>
        <div className={`px-10 py-4 rounded-xl text-center text-white shadow-xl transform hover:scale-105 transition-transform ${latest.risk_score >= 180 ? 'bg-red-600' : 'bg-[#86b059]'}`}>
            <p className="text-[10px] uppercase font-black opacity-80 tracking-widest mb-1">Risk Score</p>
            <p className="text-5xl font-black italic">{latest.risk_score || 0}</p>
        </div>
      </div>

      <div className="bg-white border rounded-xl p-8 relative shadow-sm">
        <div className="absolute top-0 left-0 w-2 h-full bg-[#86b059]" />
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-sm font-black uppercase text-slate-500 flex items-center gap-2 tracking-widest">
            <ShieldAlert size={20} className="text-[#86b059]" /> Behavior Analytics Detailed Summary
          </h3>
          <span className="text-[11px] font-bold text-slate-400 uppercase">{logs.length} Total Events</span>
        </div>
        <div className="space-y-4">
          {logs.map((log, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group">
              <div className="flex gap-5 items-center">
                <div className={`p-2 rounded-md ${log.risk_score >= 100 ? 'bg-red-50 text-red-500' : 'bg-slate-100 text-slate-400'}`}>
                  <Activity size={18} />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-slate-800 uppercase group-hover:text-blue-600 transition-colors">{log.action}</p>
                  <p className="text-[10px] text-gray-400 font-mono italic tracking-tighter">{log.resource}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[14px] font-black text-orange-600">+{log.risk_score}</span>
                <p className="text-[9px] text-gray-300 font-bold uppercase mt-1">Points</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}