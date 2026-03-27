import React from 'react';
import { BookOpen, Shield, Zap, AlertTriangle } from 'lucide-react';

const Playbooks = () => {
    const playbooks = [
        { title: "Unauthorized Exfiltration", severity: "Critical", icon: Zap, color: "text-red-500" },
        { title: "Credential Phishing", severity: "High", icon: Shield, color: "text-orange-500" },
        { title: "Ransomware Detection", severity: "Critical", icon: AlertTriangle, color: "text-red-600" },
        { title: "Policy Violation", severity: "Low", icon: BookOpen, color: "text-blue-500" },
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-700">
            <div className="flex items-center gap-3 mb-8">
                <div className="bg-[#86b059] p-2 rounded-lg text-white">
                    <BookOpen size={24} />
                </div>
                <div>
                    <h1 className="text-2xl font-black italic text-slate-800 tracking-tight">Security Playbooks</h1>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Incident Response Workflows</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {playbooks.map((p, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                        <p className={`text-[10px] font-black uppercase tracking-tighter mb-4 ${p.color}`}>{p.severity}</p>
                        <h3 className="font-bold text-slate-700 mb-6 flex items-center justify-between">
                            {p.title}
                            <p.icon size={18} className="opacity-20 group-hover:opacity-100 transition-opacity" />
                        </h3>
                        <button className="text-[10px] font-black uppercase tracking-widest bg-gray-50 text-gray-500 px-3 py-1.5 rounded hover:bg-[#86b059] hover:text-white transition-colors">Launch Workflow</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Playbooks;
