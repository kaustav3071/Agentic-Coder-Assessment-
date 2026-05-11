// Realistic seed data for a marketing agency

export const teamMembers = [
  'Sarah Chen', 'Marcus Rivera', 'Priya Sharma', 'Jake Morrison',
  'Aisha Patel', 'David Kim', 'Emma Thompson', 'Carlos Mendez',
  'Natalie Wong', 'Ryan O\'Brien'
];

export const clients = [
  'TechNova Inc.', 'GreenLeaf Organics', 'Apex Fitness', 'Luminary Beauty',
  'UrbanBite Foods', 'CloudSync Solutions', 'Velvet & Vine', 'PeakTrail Gear'
];

export const seedCampaigns = [
  {
    id: 'camp-001',
    name: 'TechNova Product Launch 2026',
    client: 'TechNova Inc.',
    owner: 'Sarah Chen',
    status: 'in-progress',
    deadline: '2026-06-15',
    progress: 68,
  },
  {
    id: 'camp-002',
    name: 'GreenLeaf Summer Campaign',
    client: 'GreenLeaf Organics',
    owner: 'Marcus Rivera',
    status: 'in-progress',
    deadline: '2026-07-01',
    progress: 42,
  },
  {
    id: 'camp-003',
    name: 'Apex Fitness Rebrand',
    client: 'Apex Fitness',
    owner: 'Priya Sharma',
    status: 'planning',
    deadline: '2026-08-20',
    progress: 15,
  },
  {
    id: 'camp-004',
    name: 'Luminary Beauty Influencer Push',
    client: 'Luminary Beauty',
    owner: 'Emma Thompson',
    status: 'in-progress',
    deadline: '2026-05-30',
    progress: 85,
  },
  {
    id: 'camp-005',
    name: 'UrbanBite App Launch',
    client: 'UrbanBite Foods',
    owner: 'Jake Morrison',
    status: 'delivered',
    deadline: '2026-04-15',
    progress: 100,
  },
  {
    id: 'camp-006',
    name: 'CloudSync Awareness Series',
    client: 'CloudSync Solutions',
    owner: 'David Kim',
    status: 'in-progress',
    deadline: '2026-06-30',
    progress: 55,
  },
  {
    id: 'camp-007',
    name: 'Velvet & Vine Holiday Collection',
    client: 'Velvet & Vine',
    owner: 'Aisha Patel',
    status: 'planning',
    deadline: '2026-11-01',
    progress: 8,
  },
  {
    id: 'camp-008',
    name: 'PeakTrail Adventure Series',
    client: 'PeakTrail Gear',
    owner: 'Carlos Mendez',
    status: 'review',
    deadline: '2026-09-15',
    progress: 30,
  },
];

export const seedTasks = [
  // TechNova Product Launch
  { id: 'task-001', campaignId: 'camp-001', title: 'Design landing page mockups', assignee: 'Natalie Wong', dueDate: '2026-05-18', priority: 'high', status: 'in-progress' },
  { id: 'task-002', campaignId: 'camp-001', title: 'Write press release copy', assignee: 'Emma Thompson', dueDate: '2026-05-20', priority: 'high', status: 'todo' },
  { id: 'task-003', campaignId: 'camp-001', title: 'Set up email drip campaign', assignee: 'Sarah Chen', dueDate: '2026-05-25', priority: 'medium', status: 'todo' },
  { id: 'task-004', campaignId: 'camp-001', title: 'Create social media content calendar', assignee: 'Marcus Rivera', dueDate: '2026-05-22', priority: 'medium', status: 'done' },
  { id: 'task-005', campaignId: 'camp-001', title: 'Produce product demo video', assignee: 'Jake Morrison', dueDate: '2026-06-01', priority: 'high', status: 'in-progress' },
  { id: 'task-006', campaignId: 'camp-001', title: 'A/B test ad creatives', assignee: 'David Kim', dueDate: '2026-06-05', priority: 'medium', status: 'todo' },

  // GreenLeaf Summer Campaign
  { id: 'task-007', campaignId: 'camp-002', title: 'Photo shoot coordination', assignee: 'Aisha Patel', dueDate: '2026-05-28', priority: 'high', status: 'in-progress' },
  { id: 'task-008', campaignId: 'camp-002', title: 'Influencer outreach list', assignee: 'Emma Thompson', dueDate: '2026-05-15', priority: 'medium', status: 'done' },
  { id: 'task-009', campaignId: 'camp-002', title: 'Design packaging refresh', assignee: 'Natalie Wong', dueDate: '2026-06-10', priority: 'high', status: 'todo' },
  { id: 'task-010', campaignId: 'camp-002', title: 'Write blog series (3 posts)', assignee: 'Ryan O\'Brien', dueDate: '2026-06-15', priority: 'low', status: 'todo' },
  { id: 'task-011', campaignId: 'camp-002', title: 'Setup Google Ads campaigns', assignee: 'David Kim', dueDate: '2026-06-01', priority: 'medium', status: 'todo' },

  // Apex Fitness Rebrand
  { id: 'task-012', campaignId: 'camp-003', title: 'Brand audit & competitive analysis', assignee: 'Priya Sharma', dueDate: '2026-06-01', priority: 'high', status: 'in-progress' },
  { id: 'task-013', campaignId: 'camp-003', title: 'Develop new brand guidelines', assignee: 'Natalie Wong', dueDate: '2026-06-20', priority: 'high', status: 'todo' },
  { id: 'task-014', campaignId: 'camp-003', title: 'Logo concepts (3 directions)', assignee: 'Natalie Wong', dueDate: '2026-06-15', priority: 'high', status: 'todo' },
  { id: 'task-015', campaignId: 'camp-003', title: 'Client presentation deck', assignee: 'Priya Sharma', dueDate: '2026-06-25', priority: 'medium', status: 'todo' },

  // Luminary Beauty Influencer Push
  { id: 'task-016', campaignId: 'camp-004', title: 'Finalize influencer contracts', assignee: 'Emma Thompson', dueDate: '2026-05-12', priority: 'high', status: 'in-progress' },
  { id: 'task-017', campaignId: 'camp-004', title: 'Ship product kits to creators', assignee: 'Carlos Mendez', dueDate: '2026-05-14', priority: 'high', status: 'done' },
  { id: 'task-018', campaignId: 'camp-004', title: 'Monitor & report on creator posts', assignee: 'Aisha Patel', dueDate: '2026-05-28', priority: 'high', status: 'in-progress' },
  { id: 'task-019', campaignId: 'camp-004', title: 'Paid boost top-performing content', assignee: 'David Kim', dueDate: '2026-05-25', priority: 'medium', status: 'todo' },

  // UrbanBite App Launch (completed)
  { id: 'task-020', campaignId: 'camp-005', title: 'App store listing optimization', assignee: 'Jake Morrison', dueDate: '2026-04-01', priority: 'high', status: 'done' },
  { id: 'task-021', campaignId: 'camp-005', title: 'Launch day social blitz', assignee: 'Marcus Rivera', dueDate: '2026-04-15', priority: 'high', status: 'done' },
  { id: 'task-022', campaignId: 'camp-005', title: 'PR media outreach', assignee: 'Emma Thompson', dueDate: '2026-04-10', priority: 'medium', status: 'done' },

  // CloudSync Awareness Series
  { id: 'task-023', campaignId: 'camp-006', title: 'Write whitepaper: Cloud Security', assignee: 'Ryan O\'Brien', dueDate: '2026-05-30', priority: 'high', status: 'in-progress' },
  { id: 'task-024', campaignId: 'camp-006', title: 'Design infographic series', assignee: 'Natalie Wong', dueDate: '2026-06-05', priority: 'medium', status: 'todo' },
  { id: 'task-025', campaignId: 'camp-006', title: 'LinkedIn ad campaign setup', assignee: 'David Kim', dueDate: '2026-06-10', priority: 'medium', status: 'in-progress' },
  { id: 'task-026', campaignId: 'camp-006', title: 'Webinar landing page', assignee: 'Sarah Chen', dueDate: '2026-06-15', priority: 'low', status: 'todo' },

  // Velvet & Vine Holiday Collection
  { id: 'task-027', campaignId: 'camp-007', title: 'Mood board & creative direction', assignee: 'Aisha Patel', dueDate: '2026-07-01', priority: 'medium', status: 'todo' },
  { id: 'task-028', campaignId: 'camp-007', title: 'Holiday gift guide concept', assignee: 'Emma Thompson', dueDate: '2026-07-15', priority: 'low', status: 'todo' },

  // PeakTrail Adventure Series
  { id: 'task-029', campaignId: 'camp-008', title: 'Scout filming locations', assignee: 'Carlos Mendez', dueDate: '2026-06-01', priority: 'medium', status: 'review' },
  { id: 'task-030', campaignId: 'camp-008', title: 'Draft storyboards for video ads', assignee: 'Jake Morrison', dueDate: '2026-06-15', priority: 'medium', status: 'review' },
];
