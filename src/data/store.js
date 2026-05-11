import { seedCampaigns, seedTasks } from './seedData';

const CAMPAIGNS_KEY = 'campaignflow_campaigns';
const TASKS_KEY = 'campaignflow_tasks';

function loadFromStorage(key, seedData) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn(`Failed to parse ${key} from localStorage`, e);
  }
  localStorage.setItem(key, JSON.stringify(seedData));
  return seedData;
}

function saveToStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// --- Campaigns ---
export function getCampaigns() {
  return loadFromStorage(CAMPAIGNS_KEY, seedCampaigns);
}

export function saveCampaigns(campaigns) {
  saveToStorage(CAMPAIGNS_KEY, campaigns);
}

export function addCampaign(campaign) {
  const campaigns = getCampaigns();
  campaigns.push(campaign);
  saveCampaigns(campaigns);
  return campaigns;
}

export function updateCampaign(id, updates) {
  const campaigns = getCampaigns().map(c =>
    c.id === id ? { ...c, ...updates } : c
  );
  saveCampaigns(campaigns);
  return campaigns;
}

export function deleteCampaign(id) {
  const campaigns = getCampaigns().filter(c => c.id !== id);
  saveCampaigns(campaigns);
  // Also delete associated tasks
  const tasks = getTasks().filter(t => t.campaignId !== id);
  saveTasks(tasks);
  return campaigns;
}

// --- Tasks ---
export function getTasks() {
  return loadFromStorage(TASKS_KEY, seedTasks);
}

export function saveTasks(tasks) {
  saveToStorage(TASKS_KEY, tasks);
}

export function addTask(task) {
  const tasks = getTasks();
  tasks.push(task);
  saveTasks(tasks);
  return tasks;
}

export function updateTask(id, updates) {
  const tasks = getTasks().map(t =>
    t.id === id ? { ...t, ...updates } : t
  );
  saveTasks(tasks);
  return tasks;
}

export function deleteTask(id) {
  const tasks = getTasks().filter(t => t.id !== id);
  saveTasks(tasks);
  return tasks;
}

// --- Reset ---
export function resetAllData() {
  localStorage.removeItem(CAMPAIGNS_KEY);
  localStorage.removeItem(TASKS_KEY);
  return {
    campaigns: getCampaigns(),
    tasks: getTasks(),
  };
}

// --- Helpers ---
export function generateId(prefix = 'item') {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}
