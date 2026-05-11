import { useState, useCallback, useEffect } from 'react';
import { getCampaigns, getTasks, saveCampaigns, saveTasks } from './data/store';
import CampaignsTab from './components/CampaignsTab';
import TasksTab from './components/TasksTab';
import WorkloadTab from './components/WorkloadTab';
import ClientViewTab from './components/ClientViewTab';
import BriefGeneratorTab from './components/BriefGeneratorTab';

const tabs = [
  { id: 'campaigns', label: 'Campaigns', icon: '🚀' },
  { id: 'tasks', label: 'Tasks', icon: '✅' },
  { id: 'workload', label: 'Workload', icon: '📊' },
  { id: 'clients', label: 'Client View', icon: '🏢' },
  { id: 'brief', label: 'Brief Generator', icon: '🧠' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('campaigns');
  const [campaigns, setCampaigns] = useState(() => getCampaigns());
  const [tasks, setTasks] = useState(() => getTasks());

  const handleUpdateCampaigns = useCallback((updated, deleteTasks = false) => {
    setCampaigns(updated);
    saveCampaigns(updated);
    if (deleteTasks) {
      const campIds = new Set(updated.map(c => c.id));
      const filteredTasks = tasks.filter(t => campIds.has(t.campaignId));
      setTasks(filteredTasks);
      saveTasks(filteredTasks);
    }
  }, [tasks]);

  const handleUpdateTasks = useCallback((updated) => {
    setTasks(updated);
    saveTasks(updated);
  }, []);

  const handleReset = () => {
    localStorage.removeItem('campaignflow_campaigns');
    localStorage.removeItem('campaignflow_tasks');
    setCampaigns(getCampaigns());
    setTasks(getTasks());
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                C
              </div>
              <div>
                <h1 className="text-base font-bold text-gray-900 leading-tight" id="app-title">CampaignFlow</h1>
                <p className="text-[10px] text-gray-500 leading-tight">Project Management</p>
              </div>
            </div>

            {/* Nav Tabs */}
            <nav className="hidden sm:flex items-center gap-6 h-full -mb-px" id="main-nav">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  id={`tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 py-4 text-sm font-medium transition-all border-b-2 ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="text-sm">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>

            {/* Reset button */}
            <button
              onClick={handleReset}
              className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100 transition-colors"
              id="reset-data-btn"
              title="Reset to seed data"
            >
              ↻ Reset
            </button>
          </div>

          {/* Mobile tabs */}
          <div className="sm:hidden flex gap-4 overflow-x-auto -mb-px" id="mobile-nav">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1 py-3 text-xs font-medium whitespace-nowrap transition-all border-b-2 ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <span>{tab.icon}</span>{tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'campaigns' && (
          <CampaignsTab campaigns={campaigns} tasks={tasks} onUpdateCampaigns={handleUpdateCampaigns} />
        )}
        {activeTab === 'tasks' && (
          <TasksTab tasks={tasks} campaigns={campaigns} onUpdateTasks={handleUpdateTasks} />
        )}
        {activeTab === 'workload' && (
          <WorkloadTab tasks={tasks} campaigns={campaigns} />
        )}
        {activeTab === 'clients' && (
          <ClientViewTab campaigns={campaigns} tasks={tasks} />
        )}
        {activeTab === 'brief' && (
          <BriefGeneratorTab campaigns={campaigns} tasks={tasks} onUpdateTasks={handleUpdateTasks} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-4 mt-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between text-xs text-gray-500">
          <span>CampaignFlow · Marketing Agency PMS</span>
          <span>Data stored in localStorage</span>
        </div>
      </footer>
    </div>
  );
}
