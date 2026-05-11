import { useState } from 'react';
import { generateId } from '../data/store';

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama3-70b-8192';
const SYSTEM_PROMPT = `You are a project manager at a marketing agency. Given client requirements, return ONLY a JSON array of tasks. Each task: { "title": string, "assignee_role": string, "priority": "Low"|"Medium"|"High", "estimated_days": number }. No explanation, no markdown, just raw JSON.`;

export default function BriefGeneratorTab({ campaigns, tasks, onUpdateTasks }) {
  const [brief, setBrief] = useState('');
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('cf_groq_key') || import.meta.env.VITE_GROQ_API_KEY || '');
  const [generated, setGenerated] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState(campaigns[0]?.id || '');
  const [addedIds, setAddedIds] = useState(new Set());

  function saveKey(key) {
    setApiKey(key);
    localStorage.setItem('cf_groq_key', key);
  }

  async function handleGenerate() {
    if (!brief.trim()) { setError('Please paste client requirements first.'); return; }
    if (!apiKey.trim()) { setError('Please enter your Groq API key.'); return; }

    setLoading(true);
    setError('');
    setGenerated([]);
    setAddedIds(new Set());

    try {
      const res = await fetch(GROQ_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: brief }
          ],
        }),
      });

      if (!res.ok) {
        const errBody = await res.text();
        throw new Error(`API error ${res.status}: ${errBody}`);
      }

      const data = await res.json();
      const text = data.choices?.[0]?.message?.content || '';

      // Extract JSON array from response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) throw new Error('No JSON array found in response.');

      const parsed = JSON.parse(jsonMatch[0]);
      if (!Array.isArray(parsed)) throw new Error('Response is not an array.');

      setGenerated(parsed.map((t, i) => ({ ...t, _id: `gen-${i}` })));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function handleAddToCampaign(genTask) {
    if (!selectedCampaign) { setError('Select a campaign first.'); return; }

    const newTask = {
      id: generateId('task'),
      campaignId: selectedCampaign,
      title: genTask.title,
      assignee: genTask.assignee_role || 'Unassigned',
      dueDate: new Date(Date.now() + (genTask.estimated_days || 7) * 86400000).toISOString().split('T')[0],
      priority: genTask.priority?.toLowerCase() === 'high' ? 'high' : genTask.priority?.toLowerCase() === 'low' ? 'low' : 'medium',
      status: 'todo',
    };

    onUpdateTasks([...tasks, newTask]);
    setAddedIds(prev => new Set([...prev, genTask._id]));
  }

  function handleAddAll() {
    if (!selectedCampaign) { setError('Select a campaign first.'); return; }
    const remaining = generated.filter(g => !addedIds.has(g._id));
    const newTasks = remaining.map(g => ({
      id: generateId('task'),
      campaignId: selectedCampaign,
      title: g.title,
      assignee: g.assignee_role || 'Unassigned',
      dueDate: new Date(Date.now() + (g.estimated_days || 7) * 86400000).toISOString().split('T')[0],
      priority: g.priority?.toLowerCase() === 'high' ? 'high' : g.priority?.toLowerCase() === 'low' ? 'low' : 'medium',
      status: 'todo',
    }));
    onUpdateTasks([...tasks, ...newTasks]);
    setAddedIds(new Set(generated.map(g => g._id)));
  }

  const priorityStyle = (p) => {
    const pl = (p || '').toLowerCase();
    if (pl === 'high' || pl === 'urgent') return 'bg-red-100 text-red-700 border-red-200';
    if (pl === 'low') return 'bg-gray-100 text-gray-700 border-gray-200';
    return 'bg-yellow-100 text-yellow-700 border-yellow-200';
  };

  return (
    <div className="anim-fade max-w-3xl mx-auto">
      {/* API Key */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 mb-4">
        <label className="block text-xs text-gray-700 font-medium mb-1.5">Groq API Key</label>
        <input
          id="api-key-input"
          type="password"
          placeholder="gsk_..."
          value={apiKey}
          onChange={e => saveKey(e.target.value)}
          className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 transition-all"
        />
        <p className="text-[10px] text-gray-500 mt-1">Stored in localStorage. Never sent anywhere except Groq.</p>
      </div>

      {/* Brief Input */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 mb-4">
        <label className="block text-xs text-gray-700 font-medium mb-1.5">Client Brief / Requirements</label>
        <textarea
          id="brief-textarea"
          rows={6}
          placeholder={`Paste raw client requirements here...\n\nExample: "We need a full social media campaign for our new protein bar launch. Target audience is 18-35 fitness enthusiasts. We need Instagram reels, influencer partnerships, and a landing page. Budget is ₹5L. Launch in 3 weeks."`}
          value={brief}
          onChange={e => setBrief(e.target.value)}
          className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 transition-all leading-relaxed"
        />

        <div className="flex items-center gap-3 mt-3">
          <button
            id="generate-tasks-btn"
            onClick={handleGenerate}
            disabled={loading}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              loading
                ? 'bg-blue-50 text-blue-300 cursor-wait'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm active:scale-[0.98]'
            }`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                Generating…
              </span>
            ) : '✨ Generate Tasks'}
          </button>
          <span className="text-[10px] text-gray-500">Powered by Llama 3 via Groq</span>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 mb-4 text-sm text-red-600 anim-fade" id="brief-error">
          ⚠️ {error}
        </div>
      )}

      {/* Generated Tasks */}
      {generated.length > 0 && (
        <div className="anim-slide">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">
              Generated Tasks <span className="text-gray-500 font-normal">({generated.length})</span>
            </h3>
            <div className="flex items-center gap-2">
              <select
                id="target-campaign-select"
                value={selectedCampaign}
                onChange={e => setSelectedCampaign(e.target.value)}
                className="bg-white border border-gray-300 rounded-lg px-2 py-1.5 text-xs text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 transition-all appearance-none cursor-pointer"
              >
                {campaigns.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <button
                id="add-all-tasks-btn"
                onClick={handleAddAll}
                disabled={addedIds.size === generated.length}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  addedIds.size === generated.length
                    ? 'bg-green-50 text-green-700 border border-green-200 cursor-default'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 active:scale-[0.98]'
                }`}
              >
                {addedIds.size === generated.length ? '✓ All Added' : 'Add All'}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {generated.map((task, idx) => {
              const isAdded = addedIds.has(task._id);
              return (
                <div
                  key={task._id}
                  className={`bg-white rounded-xl p-4 border transition-all ${isAdded ? 'border-green-200 bg-green-50/30' : 'border-gray-200 hover:border-gray-300 shadow-sm'}`}
                  style={{ animationDelay: `${idx * 60}ms` }}
                  id={`gen-task-${idx}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-sm font-medium mb-1.5 ${isAdded ? 'text-green-700' : 'text-gray-900'}`}>
                        {isAdded && '✓ '}{task.title}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="text-gray-500 flex items-center gap-1">
                          👤 {task.assignee_role}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded border text-[10px] font-medium ${priorityStyle(task.priority)}`}>
                          {task.priority}
                        </span>
                        <span className="text-gray-500">
                          ⏱ {task.estimated_days} day{task.estimated_days !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddToCampaign(task)}
                      disabled={isAdded}
                      className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        isAdded
                          ? 'bg-green-50 text-green-700 border border-green-200 cursor-default'
                          : 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 active:scale-[0.97]'
                      }`}
                      id={`add-gen-task-${idx}`}
                    >
                      {isAdded ? '✓ Added' : '+ Add'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && generated.length === 0 && !error && (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-3">🧠</div>
          <p className="text-sm">Paste a client brief above and click <strong className="text-gray-700">Generate Tasks</strong></p>
          <p className="text-xs mt-1">AI will suggest tasks with roles, priorities, and timelines</p>
        </div>
      )}
    </div>
  );
}
