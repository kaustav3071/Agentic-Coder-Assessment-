import { useMemo } from 'react';
import { getInitials, getAvatarColor, statusConfig, priorityConfig } from '../utils/helpers';
import { teamMembers } from '../data/seedData';

export default function WorkloadTab({ tasks, campaigns }) {
  const campMap = useMemo(() => Object.fromEntries(campaigns.map(c => [c.id, c])), [campaigns]);

  const workload = useMemo(() => {
    const map = {};
    teamMembers.forEach(m => { map[m] = { name: m, tasks: [], todo: 0, inProgress: 0, done: 0, high: 0 }; });
    tasks.forEach(t => {
      if (!map[t.assignee]) map[t.assignee] = { name: t.assignee, tasks: [], todo: 0, inProgress: 0, done: 0, high: 0 };
      const w = map[t.assignee];
      w.tasks.push(t);
      if (t.status === 'todo') w.todo++;
      else if (t.status === 'in-progress') w.inProgress++;
      else if (t.status === 'done') w.done++;
      if (t.priority === 'high') w.high++;
    });
    return Object.values(map).sort((a, b) => b.tasks.length - a.tasks.length);
  }, [tasks]);

  const maxTasks = Math.max(...workload.map(w => w.tasks.length), 1);

  return (
    <div className="animate-fade-in">
      {/* Summary bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { l: 'Team Members', v: workload.filter(w => w.tasks.length > 0).length, i: '👥' },
          { l: 'Open Tasks', v: tasks.filter(t => t.status !== 'done').length, i: '📌' },
          { l: 'In Progress', v: tasks.filter(t => t.status === 'in-progress').length, i: '⚡' },
          { l: 'High Priority', v: tasks.filter(t => t.priority === 'high' && t.status !== 'done').length, i: '🔴' },
        ].map(s => (
          <div key={s.l} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-1"><span className="text-lg">{s.i}</span><span className="text-xs text-gray-500 font-medium uppercase tracking-wider">{s.l}</span></div>
            <div className="text-2xl font-bold text-gray-900">{s.v}</div>
          </div>
        ))}
      </div>

      {/* Workload cards */}
      <div className="grid gap-3 md:grid-cols-2">
        {workload.map(w => {
          const total = w.tasks.length;
          const active = total - w.done;
          const loadPct = total > 0 ? Math.round((active / maxTasks) * 100) : 0;
          const isOverloaded = active > 4;
          const isWarning = active >= 3 && active <= 4;
          const barColor = isOverloaded ? 'bg-red-500' : isWarning ? 'bg-yellow-500' : 'bg-green-500';
          const activeTasks = w.tasks.filter(t => t.status !== 'done');

          return (
            <div key={w.name} className={`bg-white border rounded-xl p-5 shadow-sm ${isOverloaded ? 'border-red-300 bg-red-50/30' : 'border-gray-200'}`} id={`workload-${w.name.replace(/\s/g, '-')}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-full ${getAvatarColor(w.name)} flex items-center justify-center text-sm font-bold shadow-sm`}>
                  {getInitials(w.name)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-gray-900 font-semibold text-sm">{w.name}</h3>
                    {isOverloaded && <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-100 text-red-700 border border-red-200">Heavy Load</span>}
                  </div>
                  <div className="text-xs text-gray-500">{total} total · {active} active · {w.done} done</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">{active}</div>
                  <div className="text-[10px] text-gray-500 uppercase">Active</div>
                </div>
              </div>

              {/* Load bar */}
              <div className="mb-3">
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full animate-progress ${barColor}`} style={{ width: `${loadPct}%` }} />
                </div>
              </div>

              {/* Status breakdown */}
              <div className="flex gap-2 mb-3">
                {[{ k: 'todo', v: w.todo, l: 'To Do' }, { k: 'in-progress', v: w.inProgress, l: 'In Progress' }, { k: 'done', v: w.done, l: 'Done' }].map(s => {
                  const sc = statusConfig[s.k];
                  return (
                    <div key={s.k} className={`flex-1 rounded-lg px-2 py-1.5 text-center ${sc.bg} border ${sc.border}`}>
                      <div className={`text-sm font-bold ${sc.text}`}>{s.v}</div>
                      <div className="text-[10px] text-gray-500">{s.l}</div>
                    </div>
                  );
                })}
              </div>

              {/* Active task list */}
              {activeTasks.length > 0 && (
                <div className="space-y-1">
                  {activeTasks.slice(0, 4).map(t => {
                    const pc = priorityConfig[t.priority];
                    const camp = campMap[t.campaignId];
                    return (
                      <div key={t.id} className="flex items-center gap-2 text-xs py-1 px-2 rounded hover:bg-gray-50">
                        <span className="text-sm">{pc.icon}</span>
                        <span className="text-gray-700 truncate flex-1">{t.title}</span>
                        <span className="text-gray-500 truncate max-w-[100px]">{camp?.name?.split(' ').slice(0, 2).join(' ')}</span>
                      </div>
                    );
                  })}
                  {activeTasks.length > 4 && <div className="text-xs text-gray-500 text-center py-1">+{activeTasks.length - 4} more</div>}
                </div>
              )}
              {total === 0 && <div className="text-xs text-gray-500 text-center py-2">No tasks assigned</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
