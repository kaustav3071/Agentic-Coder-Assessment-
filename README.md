# CampaignFlow

CampaignFlow is a professional "Internal Tool" style project management system tailored for marketing agencies. It features a clean light-mode aesthetic, comprehensive campaign & task tracking, and an integrated AI-powered Brief Generator.

## ✨ Features

- **📊 Campaigns & Tasks Tracking:** Manage multiple marketing campaigns, complete with client associations, owners, deadlines, and granular task lists.
- **⚡ AI Brief Generator:** Paste raw client requirements and automatically generate structured, actionable tasks (title, role, priority, estimation) using Groq API and Llama 3 70B.
- **👥 Team Workload View:** Monitor team capacity in real-time with visual indicators for overloaded team members and active task breakdowns.
- **🏢 Client Dashboard:** Group campaigns and tasks by client, complete with overall completion rates and status overviews.
- **🎨 Professional Internal Tool Aesthetic:** A sleek, minimal light-mode UI designed for focus and productivity.
- **💾 Local Storage Persistence:** Zero-backend setup out of the box—all state is securely persisted right in your browser's Local Storage.

## 🚀 Tech Stack

- **Framework:** React 19 + Vite 8
- **Styling:** Tailwind CSS v4
- **AI Integration:** Groq Cloud API (Llama-3-70b-8192)

## 🛠️ Local Development Setup

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/Agentic-Coder-Assessment-.git
cd Agentic-Coder-Assessment-
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory and add your Groq API key (used for the Brief Generator):
```env
VITE_GROQ_API_KEY="gsk_your_groq_api_key_here"
```

### 4. Start the development server
```bash
npm run dev
```

Your app will be running at [http://localhost:5173](http://localhost:5173).

## ☁️ Deployment (Vercel)

Deploying CampaignFlow is incredibly easy and requires zero complex configuration:

1. Push your code to GitHub.
2. Go to [Vercel](https://vercel.com/) and create a new project.
3. Import your GitHub repository.
4. Expand the **Environment Variables** section and add `VITE_GROQ_API_KEY` with your actual API key.
5. Click **Deploy**. Vercel will automatically detect the Vite preset and handle the rest!

## 🧪 Seeding Data
If you ever want to reset the app to the initial demo marketing data (useful for presentations or testing), simply click the **"↻ Reset"** button in the top-right corner of the application navigation bar. This will clear the local storage and repopulate it with the default campaigns and tasks.

---
*Built as a Single-Page Application for modern project management workflows.*
