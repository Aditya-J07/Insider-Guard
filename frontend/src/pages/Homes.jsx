import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Monitor, Lock, ShieldAlert, ChevronRight, 
  Users, UserMinus, HardDriveDownload, Globe, Zap 
} from 'lucide-react';

const BentoCard = ({ title, children, icon: Icon, extra }) => (
  <div className="bg-white border border-gray-200 rounded shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full overflow-hidden group">
    <div className="px-3 py-2 border-b bg-gray-50/50 flex justify-between items-center group-hover:bg-gray-100/50 transition-colors">
      <div className="flex items-center gap-2">
        {Icon && <Icon size={14} className="text-gray-400 group-hover:text-[#86b059] transition-colors" />}
        <h2 className="text-[11px] font-black uppercase text-slate-600 tracking-widest">{title}</h2>
      </div>
      <span className="text-[10px] text-blue-500 font-bold cursor-pointer hover:underline uppercase">{extra}</span>
    </div>
    <div className="p-3 flex-grow">{children}</div>
  </div>
);

const UserRow = ({ name, score, role, onClick }) => (
  <div onClick={onClick} className="flex justify-between items-center p-2 hover:bg-blue-50 cursor-pointer rounded transition-all group/row">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-slate-100 border border-white shadow-sm overflow-hidden group-hover/row:border-[#86b059]">
        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`} alt="avatar" />
      </div>
      <div className="flex flex-col">
        <span className="text-[11px] font-bold text-slate-700 group-hover/row:text-blue-600">{name}</span>
        <span className="text-[9px] text-gray-400 italic leading-tight">{role || 'Employee'}</span>
      </div>
    </div>
    <span className="text-[11px] font-black text-orange-600">+{score}</span>
  </div>
);

export default function Home({ logs, agents }) {
  const navigate = useNavigate();

  // Logic tied to main.py state
  const notableUsers = Array.from(new Set(logs.map(l => l.username)))
    .map(u => logs.slice().reverse().find(l => l.username === u))
    .sort((a, b) => b.risk_score - a.risk_score);

  const blockedUsers = logs.filter(l => l.risk_score >= 180); // Matches BLOCK_THRESHOLD

  return (
    <main className="max-w-[1600px] mx-auto p-4 space-y-4">
      
      {/* ROW 1: INCIDENTS */}
      <div className="grid grid-cols-12 gap-4 h-[280px]">
        <div className="col-span-12 lg:col-span-6">
          <BentoCard title="My Incidents" extra="Create Date">
            <div className="h-full flex items-center justify-center text-gray-400 text-xs italic">
              There are no incidents assigned to you.
            </div>
          </BentoCard>
        </div>
        <div className="col-span-12 lg:col-span-6">
          <BentoCard title={`Incidents in My Queues (${blockedUsers.length})`} extra="Create Date">
            <div className="space-y-1 overflow-y-auto max-h-[220px] pr-2">
              {logs.slice(-5).reverse().map((log, i) => (
                <div key={i} onClick={() => navigate(`/profile/${log.username}`)} className="flex justify-between items-center p-2 border-b border-gray-50 hover:bg-gray-50 cursor-pointer">
                  <div>
                    <p className="text-[11px] font-bold text-slate-700 uppercase">{log.action}</p>
                    <p className="text-[9px] text-gray-400">SOC-100{i} • {log.username}</p>
                  </div>
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded text-white ${log.risk_score >= 180 ? 'bg-orange-500' : 'bg-slate-400'}`}>
                    {log.risk_score >= 180 ? 'HIGH' : 'MED'}
                  </span>
                </div>
              ))}
            </div>
          </BentoCard>
        </div>
      </div>

      {/* ROW 2: NOTABLES & ASSETS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <BentoCard title="Notable Users" icon={User} extra="Last day">
          <div className="space-y-1">
            {notableUsers.slice(0, 5).map((u, i) => (
              <UserRow key={i} name={u.username} score={u.risk_score} onClick={() => navigate(`/profile/${u.username}`)} />
            ))}
          </div>
        </BentoCard>

        <BentoCard title="Notable Assets" icon={Monitor} extra="Last day">
          <div className="space-y-3">
            {Object.entries(agents).map(([host, status], i) => (
              <div key={i} className="flex justify-between items-center p-2 rounded bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <Monitor size={14} className="text-gray-300" />
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-tighter">{host}</span>
                </div>
                <div className={`w-2 h-2 rounded-full animate-pulse ${status === 'ONLINE' ? 'bg-green-500' : 'bg-red-500'}`} />
              </div>
            ))}
          </div>
        </BentoCard>

        <BentoCard title="Account Lockouts" icon={Lock} extra="Last day">
          <div className="space-y-2">
            {/* Logic filters users blocked by main.py logic */}
            {notableUsers.filter(u => u.risk_score >= 180).slice(0, 2).map((u, i) => (
              <div key={i} className="flex justify-between items-center p-1">
                <div className="flex items-center gap-2">
                   <div className="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center"><User size={12} className="text-red-400" /></div>
                   <span className="text-[11px] font-bold text-slate-700">{u.username}</span>
                </div>
                <Lock size={12} className="text-red-500" />
              </div>
            ))}
            {notableUsers.filter(u => u.risk_score >= 180).length === 0 && <p className="text-[10px] text-gray-400 italic text-center py-10">No recent lockouts</p>}
          </div>
        </BentoCard>

        <BentoCard title="Service Accounts" extra="Last day">
          <div className="space-y-3">
            {['svc_av_admin', 'svc_sp_admin', 'svc_prod_1'].map((svc, i) => (
              <div key={i} className="flex justify-between items-center text-[11px] font-bold text-slate-700">
                <span>{svc}</span>
                <span className={i === 2 ? "text-green-500" : "text-orange-500"}>{i === 2 ? 0 : 145 - (i * 58)}</span>
              </div>
            ))}
          </div>
        </BentoCard>
      </div>

      {/* ROW 3: EXECUTIVE & LEAVERS (FROM IMAGE_D7D0B8.JPG) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <BentoCard title="Executive Users" icon={Users} extra="Last day">
          <div className="space-y-2">
             {['Andrew Bautista', 'Cecilia Gibson'].map((name, i) => (
               <div key={i} className="flex justify-between items-center opacity-60">
                 <span className="text-[11px] font-bold text-slate-700">{name}</span>
                 <span className="text-[11px] font-black text-gray-300">0</span>
               </div>
             ))}
          </div>
        </BentoCard>

        <BentoCard title="Suspected Leavers" icon={UserMinus} extra="Last day">
          <div className="space-y-2">
             {/* Maps to users with High risk in main.py */}
             {notableUsers.filter(u => u.risk_score > 100).slice(0, 2).map((u, i) => (
               <UserRow key={i} name={u.username} score={u.risk_score} onClick={() => navigate(`/profile/${u.username}`)} />
             ))}
          </div>
        </BentoCard>

        <BentoCard title="Data Exfiltration" icon={HardDriveDownload} extra="Last day">
          <div className="space-y-2">
             {/* Filters logs for 'bulk' actions defined in main.py */}
             {logs.filter(l => l.action.includes('Bulk') || l.risk_score > 150).slice(0, 2).map((l, i) => (
               <UserRow key={i} name={l.username} score={l.risk_score} onClick={() => navigate(`/profile/${l.username}`)} />
             ))}
          </div>
        </BentoCard>

        <BentoCard title="First VPN from Geo" icon={Globe} extra="Last day">
           {/* Displays users hitting the Geo-Intel risk rule in main.py */}
           {logs.filter(l => l.risk_score >= 50).slice(0, 1).map((l, i) => (
              <UserRow key={i} name={l.username} score={l.risk_score} onClick={() => navigate(`/profile/${l.username}`)} />
           ))}
        </BentoCard>
      </div>
    </main>
  );
}