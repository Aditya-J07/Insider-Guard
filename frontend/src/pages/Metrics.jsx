import React from 'react';
import { BarChart3, Activity, ShieldCheck, Zap, TrendingUp, AlertCircle, Clock } from 'lucide-react';

export default function Metrics({ logs, agents }) {
  const totalRisks = logs.reduce((acc, log) => acc + (log.risk_score || 0), 0);
  const criticalThreats = logs.filter(l => l.risk_score >= 180).length;
  const onlineAgents = Object.values(agents).filter(status => status === 'ONLINE').length;
  const avgRisk = logs.length > 0 ? (totalRisks / logs.length).toFixed(1) : 0;

  const MetricTile = ({ title, value, subtext, icon: Icon, color }) => (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 rounded-lg ${color} bg-opacity-10`}><Icon className={color.replace('bg-', 'text-')} size={20} /></div>
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Live Sync</span>
      </div>
      <h3 className="text-3xl font-black text-slate-800 tracking-tighter italic">{value}</h3>
      <p className="text-[11px] font-bold text-slate-500 uppercase mt-1">{title}</p>
      <p className="text-[9px] text-gray-400 mt-2 flex items-center gap-1 uppercase font-black"><TrendingUp size={10} className="text-green-500" /> {subtext}</p>
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter flex items-center gap-3"><BarChart3 className="text-[#86b059]" /> SIEM Performance Metrics</h2>
          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-1">Global Analytics Engine • Monitoring Active</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricTile title="Total Risk Points" value={totalRisks} subtext="System Wide" icon={Zap} color="bg-yellow-500" />
        <MetricTile title="High-Risk Events" value={criticalThreats} subtext="Score >= 180" icon={AlertCircle} color="bg-red-500" />
        <MetricTile title="Avg. Risk / Log" value={avgRisk} subtext="Behavioral Baseline" icon={Activity} color="bg-blue-500" />
        <MetricTile title="Health Agents" value={`${onlineAgents}/${Object.keys(agents).length}`} subtext="Verified Heartbeats" icon={ShieldCheck} color="bg-[#86b059]" />
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 bg-white border rounded-xl p-8 shadow-sm">
          <h3 className="text-xs font-black uppercase text-slate-500 tracking-widest flex items-center gap-2 mb-8"><Clock size={16} className="text-[#86b059]" /> Risk Mitigation Timeline</h3>
          <div className="h-64 flex items-end justify-between gap-2 px-4 border-b border-l border-slate-100">
            {[45, 60, 25, 90, 45, 30, 100, 70, 85, 40, 55, 95].map((val, i) => (
              <div key={i} className={`w-full rounded-t-sm transition-all duration-500 ${val > 80 ? 'bg-red-500' : 'bg-[#86b059]'}`} style={{ height: `${val}%` }} />
            ))}
          </div>
          <div className="flex justify-between mt-4 text-[9px] font-black text-gray-300 uppercase tracking-widest"><span>00:00</span><span>Now</span></div>
        </div>

        <div className="col-span-12 lg:col-span-4 bg-slate-900 rounded-xl p-6 text-white shadow-xl">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-6">Security Engine Health</p>
          <div className="space-y-4 text-[11px]">
            <div className="flex justify-between"><span>Database Conn.</span><span className="text-green-400 font-black">ACTIVE</span></div>
            <div className="flex justify-between"><span>FastAPI Watchdog</span><span className="text-green-400 font-black">POLLING</span></div>
            <div className="flex justify-between"><span>Heartbeat Timeout</span><span className="font-mono">15s</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}