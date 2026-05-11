// Shared UI helpers and status config

export const statusConfig = {
  // Campaign statuses
  planning: { label: 'Planning', bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200', dot: 'bg-gray-400' },
  'in-progress': { label: 'In Progress', bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' },
  review: { label: 'Review', bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
  delivered: { label: 'Delivered', bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200', dot: 'bg-green-500' },
  // Task statuses
  todo: { label: 'To Do', bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200', dot: 'bg-gray-400' },
  done: { label: 'Done', bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200', dot: 'bg-green-500' },
};

export const priorityConfig = {
  high: { label: 'High', bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', icon: '🔴' },
  medium: { label: 'Medium', bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200', icon: '🟡' },
  low: { label: 'Low', bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200', icon: '⚪' },
};

export function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function daysUntil(dateStr) {
  if (!dateStr) return null;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(dateStr + 'T00:00:00');
  return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
}

export function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

// Deterministic color from name
const avatarColors = [
  'bg-blue-100 text-blue-700',
  'bg-emerald-100 text-emerald-700',
  'bg-rose-100 text-rose-700',
  'bg-amber-100 text-amber-700',
  'bg-cyan-100 text-cyan-700',
  'bg-violet-100 text-violet-700',
  'bg-lime-100 text-lime-700',
  'bg-red-100 text-red-700',
];

export function getAvatarColor(name) {
  if (!name) return avatarColors[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
}
