import { useState, useMemo } from 'react';
import { statusConfig, formatDate, daysUntil, getInitials, getAvatarColor } from '../utils/helpers';
import { generateId } from '../data/store';
import { teamMembers, clients } from '../data/seedData';
import Modal, { FormField, inputClass, selectClass, btnPrimary, btnSecondary, btnDanger } from './Modal';

function CampaignForm({ campaign, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: campaign?.name || '', client: campaign?.client || clients[0],
    owner: campaign?.owner || teamMembers[0], status: campaign?.status || 'planning',
    deadline: campaign?.deadline || '', progress: campaign?.progress || 0,
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  return (
    <form onSubmit={e => { e.preventDefault(); onSave({ ...form, progress: Number(form.progress) }); }}>
      <FormField label="Campaign Name" id="f-cn"><input id="f-cn" className={inputClass} value={form.name} onChange={e => set('name', e.target.value)} required placeholder="e.g. Summer Launch" /></FormField>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Client" id="f-cc"><select id="f-cc" className={selectClass} value={form.client} onChange={e => set('client', e.target.value)}>{clients.map(c => <option key={c}>{c}</option>)}</select></FormField>
        <FormField label="Owner" id="f-co"><select id="f-co" className={selectClass} value={form.owner} onChange={e => set('owner', e.target.value)}>{teamMembers.map(m => <option key={m}>{m}</option>)}</select></FormField>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Status" id="f-cs"><select id="f-cs" className={selectClass} value={form.status} onChange={e => set('status', e.target.value)}>
          <option value="planning">Planning</option><option value="in-progress">In Progress</option><option value="review">Review</option><option value="delivered">Delivered</option>
        </select></FormField>
        <FormField label="Deadline" id="f-cd"><input id="f-cd" type="date" className={inputClass} value={form.deadline} onChange={e => set('deadline', e.target.value)} required /></FormField>
      </div>
      <FormField label={`Progress: ${form.progress}%`} id="f-cp">
        <input id="f-cp" type="range" min="0" max="100" value={form.progress} onChange={e => set('progress', e.target.value)} className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-600" />
      </FormField>
      <div className="flex justify-end gap-2 mt-5">
        <button type="button" className={btnSecondary} onClick={onCancel}>Cancel</button>
        <button type="submit" className={btnPrimary} id="save-campaign-btn">{campaign ? 'Update' : 'Create'} Campaign</button>
      </div>
    </form>
  );
}

export default function CampaignsTab({ campaigns, tasks, onUpdateCampaigns }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const filtered = useMemo(() => campaigns.filter(c => {
    const q = search.toLowerCase();
    const matchQ = !q || c.name.toLowerCase().includes(q) || c.client.toLowerCase().includes(q) || c.owner.toLowerCase().includes(q);
    return matchQ && (statusFilter === 'all' || c.status === statusFilter);
  }), [campaigns, search, statusFilter]);

  const stats = useMemo(() => ({
    total: campaigns.length, active: campaigns.filter(c => c.status === 'in-progress').length,
    planning: campaigns.filter(c => c.status === 'planning').length, completed: campaigns.filter(c => c.status === 'delivered').length,
  }), [campaigns]);

  function handleSave(data) {
    if (editing) onUpdateCampaigns(campaigns.map(c => c.id === editing.id ? { ...c, ...data } : c));
    else onUpdateCampaigns([...campaigns, { id: generateId('camp'), ...data }]);
    setModalOpen(false);
  }

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[{ l: 'Total', v: stats.total, i: '📊' },
          { l: 'In Progress', v: stats.active, i: '🚀' },
          { l: 'Planning', v: stats.planning, i: '📝' },
          { l: 'Delivered', v: stats.completed, i: '✅' },
        ].map(s => (
          <div key={s.l} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-1"><span className="text-lg">{s.i}</span><span className="text-xs text-gray-500 font-medium uppercase tracking-wider">{s.l}</span></div>
            <div className="text-2xl font-bold text-gray-900">{s.v}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input id="campaign-search" type="text" placeholder="Search campaigns…" value={search} onChange={e => setSearch(e.target.value)} className={`${inputClass} pl-9`} />
        </div>
        <select id="campaign-status-filter" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className={`${selectClass} w-auto min-w-[140px]`}>
          <option value="all">All Statuses</option><option value="in-progress">In Progress</option><option value="planning">Planning</option><option value="review">Review</option><option value="delivered">Delivered</option>
        </select>
        <button id="add-campaign-btn" onClick={() => { setEditing(null); setModalOpen(true); }} className={btnPrimary}>+ New Campaign</button>
      </div>

      <div className="grid gap-3">
        {filtered.length === 0 && <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-sm"><div className="text-4xl mb-3">🔍</div><p className="text-gray-500">No campaigns found.</p></div>}
        {filtered.map((c, idx) => {
          const sc = statusConfig[c.status] || statusConfig['in-progress'];
          const ct = tasks.filter(t => t.campaignId === c.id);
          const done = ct.filter(t => t.status === 'done').length;
          const days = daysUntil(c.deadline);
          const overdue = days !== null && days < 0 && c.status !== 'completed';
          return (
            <div key={c.id} className="bg-white hover:bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm cursor-pointer group transition-colors" onClick={() => { setEditing(c); setModalOpen(true); }} id={`campaign-card-${c.id}`}>
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <h3 className="text-gray-900 font-semibold truncate group-hover:text-blue-600">{c.name}</h3>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${sc.bg} ${sc.text} border ${sc.border}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />{sc.label}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                    <span>🏢 {c.client}</span>
                    <span className="flex items-center gap-1">
                      <div className={`w-5 h-5 rounded-full ${getAvatarColor(c.owner)} flex items-center justify-center text-[9px] font-bold`}>{getInitials(c.owner)}</div>
                      {c.owner}
                    </span>
                    <span className={overdue ? 'text-red-500' : ''}>📅 {formatDate(c.deadline)}{overdue && ` (${Math.abs(days)}d overdue)`}{days !== null && days >= 0 && days <= 7 && c.status !== 'completed' && ` (${days}d left)`}</span>
                    <span>📋 {done}/{ct.length} tasks</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-32">
                    <div className="flex justify-between text-xs mb-1"><span className="text-gray-500">Progress</span><span className="text-gray-900 font-medium">{c.progress}%</span></div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full rounded-full bg-blue-500 animate-progress" style={{ width: `${c.progress}%` }} /></div>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50" onClick={e => { e.stopPropagation(); setDeleteId(c.id); }} id={`del-camp-${c.id}`}>🗑️</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Campaign' : 'New Campaign'}>
        <CampaignForm campaign={editing} onSave={handleSave} onCancel={() => setModalOpen(false)} />
      </Modal>
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Campaign?">
        <p className="text-gray-500 text-sm mb-5">This will permanently delete this campaign and all associated tasks.</p>
        <div className="flex justify-end gap-2">
          <button className={btnSecondary} onClick={() => setDeleteId(null)}>Cancel</button>
          <button className={btnDanger} onClick={() => { onUpdateCampaigns(campaigns.filter(x => x.id !== deleteId), true); setDeleteId(null); }} id="confirm-del-camp">Delete</button>
        </div>
      </Modal>
    </div>
  );
}
