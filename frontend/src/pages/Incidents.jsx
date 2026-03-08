import React from 'react';
import { ShieldAlert, AlertTriangle } from 'lucide-react';

export default function Incidents({ logs }) {
  const getSeverity = (score) => {
    if (score >= 180) return { label: "CRITICAL", color: "bg-[#d32f2f]", text: "text-[#d32f2f]" };
    if (score >= 100) return { label: "HIGH", color: "bg-orange-500", text: "text-orange-500" };
    if (score >= 50) return { label: "MEDIUM", color: "bg-yellow-500", text: "text-yellow-600" };
    return { label: "LOW", color: "bg-blue-500", text: "text-blue-600" };
  };

  const criticalCount = logs.filter(l => l.risk_score >= 180).length;

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <ShieldAlert className="text-[#86b059] w-12 h-12" strokeWidth={1.5} />
          <div>
            <h2 className="text-[28px] font-black text-[#1b2b4d] uppercase tracking-tighter leading-none">
              Incident Response Queue
            </h2>
            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-1.5">
              Real-time SIEM Log Analysis • {logs.length} Total Events
            </p>
          </div>
        </div>
        <div>
          <span className="bg-[#fff0f0] text-[#d32f2f] px-3 py-1.5 rounded text-[11px] font-black border border-[#ffcdd2] tracking-wider uppercase">
            {criticalCount} Critical Incidents
          </span>
        </div>
      </div>

      <hr className="border-t-2 border-slate-400/40 mb-8" />

      <div className="bg-white border text-center border-gray-200 rounded-xl shadow-[0_2px_10px_rgb(0,0,0,0.04)] overflow-hidden min-h-[400px] flex flex-col">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr className="text-[11px] font-black text-[#64748b] uppercase tracking-widest border-b border-gray-200">
              <th className="p-5 font-black">Priority</th>
              <th className="p-5 font-black">Incident ID</th>
              <th className="p-5 font-black">Subject</th>
              <th className="p-5 font-black">Activity Details</th>
              <th className="p-5 font-black">Risk Score</th>
              <th className="p-5 font-black">Detected At</th>
            </tr>
          </thead>
          {logs.length > 0 && (
            <tbody className="text-[11px] text-slate-700 font-medium">
              {logs.slice().reverse().map((log, i) => {
                const severity = getSeverity(log.risk_score);
                return (
                  <tr key={i} className="hover:bg-slate-50 transition-colors border-b border-gray-50">
                    <td className="p-5 text-center">
                      <span className={`${severity.color} text-white px-2.5 py-1 rounded-[3px] font-black text-[9px] shadow-sm`}>
                        {severity.label}
                      </span>
                    </td>
                    <td className="p-5 font-mono text-gray-400 text-center">
                      #INC-{log.id ? log.id.slice(-6).toUpperCase() : `100${i}`}
                    </td>
                    <td className="p-5 font-bold text-slate-800 uppercase text-center">
                      {log.username}
                    </td>
                    <td className="p-5 font-black text-slate-700 uppercase tracking-tight text-center">
                      {log.action}
                      <div className="text-[9px] text-gray-400 font-mono italic mt-0.5">
                        {log.resource || "N/A"}
                      </div>
                    </td>
                    <td className={`p-5 font-black text-[13px] ${severity.text} text-center`}>
                      +{log.risk_score}
                    </td>
                    <td className="p-5 text-gray-400 font-bold uppercase text-center">
                      {log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : 'LIVE'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          )}
        </table>
        
        {logs.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center space-y-4 p-20">
            <AlertTriangle className="text-gray-200 w-16 h-16" strokeWidth={1.5} />
            <p className="text-[13px] font-black text-gray-300 uppercase tracking-widest italic">
              Awaiting data from agents...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}