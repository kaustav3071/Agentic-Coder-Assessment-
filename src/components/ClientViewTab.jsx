import { useState, useMemo } from 'react';
import { statusConfig, priorityConfig, formatDate, daysUntil, getInitials, getAvatarColor } from '../utils/helpers';
import { clients } from '../data/seedData';

export default function ClientViewTab({ campaigns, tasks }) {
  const [selectedClient, setSelectedClient] = useState('all');

  const clientData = useMemo(() => {
    const map = {};
    campaigns.forEach(c => {
      if (!map[c.client]) map[c.client] = { name: c.client, campaigns: [], tasks: [] };
      map[c.client].campaigns.push(c);
    });
    tasks.forEach(t => {
      const camp = campaigns.find(c => c.id === t.campaignId);
      if (camp && map[camp.client]) map[camp.client].tasks.push(t);
    });
    return Object.values(map).sort((a, b) => b.campaigns.length - a.campaigns.length);
  }, [campaigns, tasks]);

  const activeClients = selectedClient === 'all' ? clientData : clientData.filter(c => c.name === selectedClient);

  return (
    <div className="animate-fade-in">
      {/* Client selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => setSelectedClient('all')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedClient === 'all' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'}`} id="client-filter-all">All Clients</button>
        {clientData.map(cd => (
          <button key={cd.name} onClick={() => setSelectedClient(cd.name)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedClient === cd.name ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'}`} id={`client-filter-${cd.name.replace(/\s/g, '-')}`}>
            {cd.name} <span className="text-gray-400 ml-1">({cd.campaigns.length})</span>
          </button>
        ))}
      </div>

      {/* Client sections */}
      <div className="space-y-6">
        {activeClients.map(cd => {
          const totalTasks = cd.tasks.length;
          const doneTasks = cd.tasks.filter(t => t.status === 'done').length;
          const overallProgress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
          const activeCamps = cd.campaigns.filter(c => c.status === 'in-progress').length;
          const avgProgress = cd.campaigns.length > 0 ? Math.round(cd.campaigns.reduce((s, c) => s + c.progress, 0) / cd.campaigns.length) : 0;

          return (
            <div key={cd.name} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm" id={`client-section-${cd.name.replace(/\s/g, '-')}`}>
              {/* Client header */}
              <div className="p-5 bg-gray-50 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-gray-900 mb-1">{cd.name}</h2>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                      <span>{cd.campaigns.length} campaign{cd.campaigns.length !== 1 ? 's' : ''}</span>
                      <span>{activeCamps} active</span>
                      <span>{totalTasks} tasks</span>
                      <span>{doneTasks} completed</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="relative w-14 h-14">
                        <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                          <circle cx="28" cy="28" r="24" fill="none" stroke="#f3f4f6" strokeWidth="4" />
                          <circle cx="28" cy="28" r="24" fill="none" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" strokeDasharray={`${avgProgress * 1.508} 150.8`} />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-900">{avgProgress}%</div>
                      </div>
                      <div className="text-[10px] text-gray-500 mt-0.5">Avg Progress</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Campaign cards within client */}
              <div className="p-4 space-y-3">
                {cd.campaigns.map(camp => {
                  const sc = statusConfig[camp.status] || statusConfig['in-progress'];
                  const campTasks = cd.tasks.filter(t => t.campaignId === camp.id);
                  const campDone = campTasks.filter(t => t.status === 'done').length;
                  const days = daysUntil(camp.deadline);
                  const overdue = days !== null && days < 0 && camp.status !== 'delivered';

                  return (
                    <div key={camp.id} className="rounded-xl bg-white border border-gray-100 shadow-sm p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-sm font-semibold text-gray-900">{camp.name}</h3>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${sc.bg} ${sc.text} border ${sc.border}`}>{sc.label}</span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <div className={`w-4 h-4 rounded-full ${getAvatarColor(camp.owner)} flex items-center justify-center text-[8px] font-bold`}>{getInitials(camp.owner)}</div>
                              {camp.owner}
                            </span>
                            <span className={overdue ? 'text-red-500' : ''}>📅 {formatDate(camp.deadline)}{overdue && ' ⚠️'}</span>
                          </div>
                        </div>
                        <div className="w-28">
                          <div className="flex justify-between text-xs mb-1"><span className="text-gray-500">Progress</span><span className="text-gray-900 font-medium">{camp.progress}%</span></div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full rounded-full bg-blue-500 animate-progress" style={{ width: `${camp.progress}%` }} /></div>
                        </div>
                      </div>

                      {/* Task summary */}
                      {campTasks.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {campTasks.map(t => {
                            const tsc = statusConfig[t.status] || statusConfig.todo;
                            const pc = priorityConfig[t.priority];
                            return (
                              <div key={t.id} className={`px-2 py-1 rounded-lg text-[10px] ${tsc.bg} border ${tsc.border} ${tsc.text} flex items-center gap-1`}>
                                <span>{pc?.icon}</span>
                                <span className="truncate max-w-[120px]">{t.title}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
