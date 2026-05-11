import { useState, useMemo } from 'react';
import { statusConfig, priorityConfig, formatDate, daysUntil, getInitials, getAvatarColor } from '../utils/helpers';
import { generateId } from '../data/store';
import { teamMembers } from '../data/seedData';
import Modal, { FormField, inputClass, selectClass, btnPrimary, btnSecondary, btnDanger } from './Modal';

function TaskForm({ task, campaigns, onSave, onCancel }) {
  const [form, setForm] = useState({
    campaignId: task?.campaignId || campaigns[0]?.id || '',
    title: task?.title || '', assignee: task?.assignee || teamMembers[0],
    dueDate: task?.dueDate || '', priority: task?.priority || 'medium', status: task?.status || 'todo',
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form); }}>
      <FormField label="Task Title" id="f-tt"><input id="f-tt" className={inputClass} value={form.title} onChange={e => set('title', e.target.value)} required placeholder="e.g. Design landing page" /></FormField>
      <FormField label="Campaign" id="f-tc">
        <select id="f-tc" className={selectClass} value={form.campaignId} onChange={e => set('campaignId', e.target.value)}>
          {campaigns.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </FormField>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Assignee" id="f-ta"><select id="f-ta" className={selectClass} value={form.assignee} onChange={e => set('assignee', e.target.value)}>{teamMembers.map(m => <option key={m}>{m}</option>)}</select></FormField>
        <FormField label="Due Date" id="f-td"><input id="f-td" type="date" className={inputClass} value={form.dueDate} onChange={e => set('dueDate', e.target.value)} required /></FormField>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Priority" id="f-tp"><select id="f-tp" className={selectClass} value={form.priority} onChange={e => set('priority', e.target.value)}>
          <option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option>
        </select></FormField>
        <FormField label="Status" id="f-ts"><select id="f-ts" className={selectClass} value={form.status} onChange={e => set('status', e.target.value)}>
          <option value="todo">To Do</option><option value="in-progress">In Progress</option><option value="done">Done</option><option value="on-hold">On Hold</option>
        </select></FormField>
      </div>
      <div className="flex justify-end gap-2 mt-5">
        <button type="button" className={btnSecondary} onClick={onCancel}>Cancel</button>
        <button type="submit" className={btnPrimary} id="save-task-btn">{task ? 'Update' : 'Create'} Task</button>
      </div>
    </form>
  );
}

export default function TasksTab({ tasks, campaigns, onUpdateTasks }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [campaignFilter, setCampaignFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const campMap = useMemo(() => Object.fromEntries(campaigns.map(c => [c.id, c])), [campaigns]);

  const filtered = useMemo(() => tasks.filter(t => {
    const q = search.toLowerCase();
    const matchQ = !q || t.title.toLowerCase().includes(q) || t.assignee.toLowerCase().includes(q);
    return matchQ && (statusFilter === 'all' || t.status === statusFilter)
      && (priorityFilter === 'all' || t.priority === priorityFilter)
      && (campaignFilter === 'all' || t.campaignId === campaignFilter);
  }), [tasks, search, statusFilter, priorityFilter, campaignFilter]);

  function handleSave(data) {
    if (editing) onUpdateTasks(tasks.map(t => t.id === editing.id ? { ...t, ...data } : t));
    else onUpdateTasks([...tasks, { id: generateId('task'), ...data }]);
    setModalOpen(false);
  }

  function cycleStatus(task) {
    const order = ['todo', 'in-progress', 'done'];
    const next = order[(order.indexOf(task.status) + 1) % order.length];
    onUpdateTasks(tasks.map(t => t.id === task.id ? { ...t, status: next } : t));
  }

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input id="task-search" type="text" placeholder="Search tasks…" value={search} onChange={e => setSearch(e.target.value)} className={`${inputClass} pl-9`} />
        </div>
        <select id="task-campaign-filter" value={campaignFilter} onChange={e => setCampaignFilter(e.target.value)} className={`${selectClass} w-auto min-w-[160px]`}>
          <option value="all">All Campaigns</option>{campaigns.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select id="task-status-filter" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className={`${selectClass} w-auto min-w-[120px]`}>
          <option value="all">All Status</option><option value="todo">To Do</option><option value="in-progress">In Progress</option><option value="done">Done</option><option value="on-hold">On Hold</option>
        </select>
        <select id="task-priority-filter" value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} className={`${selectClass} w-auto min-w-[120px]`}>
          <option value="all">All Priority</option><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option>
        </select>
        <button id="add-task-btn" onClick={() => { setEditing(null); setModalOpen(true); }} className={btnPrimary}>+ New Task</button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Campaign</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Assignee</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Due</th>
                <th className="px-4 py-3 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan="7" className="text-center py-12 text-gray-500">No tasks found.</td></tr>
              )}
              {filtered.map(t => {
                const sc = statusConfig[t.status] || statusConfig.todo;
                const pc = priorityConfig[t.priority] || priorityConfig.medium;
                const camp = campMap[t.campaignId];
                const days = daysUntil(t.dueDate);
                const overdue = days !== null && days < 0 && t.status !== 'done';
                return (
                  <tr key={t.id} className="border-b border-gray-100 hover:bg-gray-50 group cursor-pointer transition-colors" onClick={() => { setEditing(t); setModalOpen(true); }} id={`task-row-${t.id}`}>
                    <td className="px-4 py-3">
                      <button onClick={e => { e.stopPropagation(); cycleStatus(t); }} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${sc.bg} ${sc.text} border ${sc.border} hover:brightness-125`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />{sc.label}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-gray-900 font-medium group-hover:text-blue-600 ${t.status === 'done' ? 'line-through opacity-60' : ''}`}>{t.title}</span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-xs text-gray-500">{camp?.name || '—'}</td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-5 h-5 rounded-full ${getAvatarColor(t.assignee)} flex items-center justify-center text-[9px] font-bold`}>{getInitials(t.assignee)}</div>
                        <span className="text-xs text-gray-700">{t.assignee}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${pc.bg} ${pc.text} border ${pc.border}`}>{pc.icon} {pc.label}</span></td>
                    <td className={`px-4 py-3 text-xs hidden lg:table-cell ${overdue ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                      {formatDate(t.dueDate)}{overdue && ` ⚠️`}
                    </td>
                    <td className="px-4 py-3">
                      <button className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors" onClick={e => { e.stopPropagation(); setDeleteId(t.id); }}>🗑️</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Task' : 'New Task'}>
        <TaskForm task={editing} campaigns={campaigns} onSave={handleSave} onCancel={() => setModalOpen(false)} />
      </Modal>
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Task?">
        <p className="text-gray-500 text-sm mb-5">This task will be permanently deleted.</p>
        <div className="flex justify-end gap-2">
          <button className={btnSecondary} onClick={() => setDeleteId(null)}>Cancel</button>
          <button className={btnDanger} onClick={() => { onUpdateTasks(tasks.filter(t => t.id !== deleteId)); setDeleteId(null); }} id="confirm-del-task">Delete</button>
        </div>
      </Modal>
    </div>
  );
}
