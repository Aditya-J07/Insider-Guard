import React from 'react';
import { Play, Activity, ShieldCheck, Zap, Lock, AlertTriangle } from 'lucide-react';

export default function Playbooks() {
  const playbooks = [
    {
      title: "Honeytoken Decoy Trap",
      trigger: "HONEYTOKEN_TRAP_TRIGGERED",
      severity: "CRITICAL",
      action: "Immediate IP/User Block",
      desc: "Instantly sets risk score to 999 and adds user to the blocked list if a decoy file is accessed.",
      icon: Lock,
      color: "text-red-600"
    },
    {
      title: "Ransomware / Sabotage Block",
      trigger: "DELETE_THRESHOLD (10 Files)",
      severity: "HIGH",
      action: "Automated Account Lockout",
      desc: "Monitors file deletion velocity within a 60-second window to detect potential insider sabotage.",
      icon: AlertTriangle,
      color: "text-orange-500"
    },
    {
      title: "Exfiltration Velocity Check",
      trigger: "VELOCITY_THRESHOLD (4 Actions)",
      severity: "MEDIUM",
      action: "Risk Score Escalation (+100)",
      desc: "Detects rapid file modifications or creations indicative of bulk data exfiltration.",
      icon: Activity,
      color: "text-yellow-500"
    },
    {
      title: "Agent Sabotage Watchdog",
      trigger: "SABOTAGE_TIMEOUT (15s)",
      severity: "HIGH",
      action: "Asset Status: OFFLINE",
      desc: "Automatically marks an asset as sabotaged if the Python agent heartbeat is lost.",
      icon: ShieldCheck,
      color: "text-[#86b059]"
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="border-b pb-6">
        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter flex items-center gap-3">
          <Zap className="text-[#86b059]" /> Automated Security Playbooks
        </h2>
        <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-1">
          SOAR Engine • Active Logic Orchestration
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {playbooks.map((play, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-1.5 h-full ${play.color.replace('text-', 'bg-')}`} />
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-lg bg-gray-50 ${play.color}`}>
                <play.icon size={24} />
              </div>
              <span className={`text-[9px] font-black px-2 py-0.5 rounded border ${play.color} border-current opacity-70`}>
                {play.severity}
              </span>
            </div>
            
            <h3 className="text-sm font-black text-slate-800 uppercase mb-2 group-hover:text-blue-600 transition-colors">
              {play.title}
            </h3>
            <p className="text-[11px] text-gray-500 leading-relaxed mb-4">
              {play.desc}
            </p>
            
            <div className="pt-4 border-t border-gray-50 space-y-2">
              <div className="flex justify-between text-[10px]">
                <span className="font-black text-gray-400 uppercase tracking-widest">Trigger Condition</span>
                <span className="font-mono font-bold text-slate-700 bg-slate-100 px-1.5 rounded">{play.trigger}</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="font-black text-gray-400 uppercase tracking-widest">Response Action</span>
                <span className="font-bold text-[#86b059]">{play.action}</span>
              </div>
            </div>

            <button className="mt-6 w-full py-2 bg-gray-50 rounded text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-[#86b059] hover:text-white transition-all flex items-center justify-center gap-2">
              <Play size={12} /> Test Simulation
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}