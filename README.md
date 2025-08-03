# Lifeware Collective

A modern React application for Thalassemia support, donor search, and AI health guidance.

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the project root:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_KEY=your_supabase_anon_key
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

## 🔧 Supabase Setup

### 1. Create a Supabase Project
- Go to [supabase.com](https://supabase.com)
- Create a new project
- Note your project URL and anon key

### 2. Create the Donors Table
Run this SQL in your Supabase SQL editor:

```sql
CREATE TABLE donors (
  id BIGSERIAL PRIMARY KEY,
  full_name TEXT NOT NULL,
  blood_type TEXT NOT NULL,
  age INTEGER,
  location TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  last_donation_date DATE,
  availability TEXT DEFAULT 'available',
  additional_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (optional)
ALTER TABLE donors ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (for demo purposes)
CREATE POLICY "Allow all operations" ON donors FOR ALL USING (true);
```

### 3. Configure Environment Variables
Add your Supabase credentials to the `.env` file:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_KEY=your-anon-key-here
```

## 🛠️ Troubleshooting

### Blank Screen Issues
If you see a blank screen:

1. **Check the browser console** for error messages
2. **Verify environment variables** are set correctly
3. **Ensure Supabase project** is properly configured
4. **Check network connectivity** to Supabase

### Common Issues

#### "Supabase not configured" warning
- Make sure your `.env` file exists and has the correct variables
- Restart the development server after adding environment variables

#### API errors
- Verify your Supabase project is active
- Check that the `donors` table exists
- Ensure your anon key has the correct permissions

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   ├── ErrorBoundary.jsx
│   ├── NavBar.jsx
│   └── SetupGuide.jsx
├── pages/              # Page components
│   ├── HomePage.jsx
│   ├── ChatbotPage.jsx
│   ├── DonorSearchPage.jsx
│   └── RegisterDonorPage.jsx
├── services/           # API and external services
│   ├── api.js         # Main API functions
│   └── supabase.js    # Supabase client configuration
└── styles/            # Global styles
    └── global.css
```

## 🎨 Features

- **Modern UI/UX** with glossy design and smooth animations
- **Real-time donor search** with Supabase integration
- **AI Health Assistant** powered by OpenAI
- **Responsive design** for all devices
- **Error handling** with graceful fallbacks
- **Loading states** and user feedback

## 🔒 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Yes |
| `VITE_SUPABASE_KEY` | Your Supabase anon key | Yes |

## 📝 Development

- **Framework:** React 19 with Vite
- **Styling:** CSS with custom properties
- **Database:** Supabase (PostgreSQL)
- **AI:** OpenAI GPT-3.5-turbo
- **Routing:** React Router DOM

## 🚀 Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy to your preferred platform (Vercel, Netlify, etc.)

3. Set environment variables in your deployment platform

## 📄 License

This project is licensed under the MIT License.
