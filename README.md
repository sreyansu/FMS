# Next.js Feedback Collection System

A complete full-stack feedback collection system built with Next.js 14+ App Router, featuring user authentication, admin dashboard, analytics, and MongoDB integration.

## 🚀 Features

- **Secure Authentication**: NextAuth.js with credentials provider and JWT
- **User Management**: Role-based access (User/Admin)
- **Feedback Forms**: Customizable forms with validation (React Hook Form + Zod)
- **Admin Dashboard**: Complete analytics with charts, filters, and data export
- **Database**: MongoDB with Mongoose ODM
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS
- **Real-time Notifications**: Toast notifications for user feedback
- **Data Export**: CSV export functionality for admins

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js
- **Database**: MongoDB (Mongoose)
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod validation
- **Notifications**: React Hot Toast
- **Icons**: Lucide React

## 📁 Project Structure

```
feedback-system/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   └── feedback/
│   │   ├── dashboard/
│   │   ├── feedback/
│   │   ├── login/
│   │   └── signup/
│   ├── components/
│   ├── lib/
│   ├── models/
│   └── utils/
├── public/
└── styles/
```

## ⚙️ Environment Setup

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd feedback-system
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/feedback-system
   
   # NextAuth Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-nextauth-secret-key
   
   # JWT Secret
   JWT_SECRET=your-jwt-secret-key
   
   # Application Environment
   NODE_ENV=development
   ```

4. **Set up MongoDB**:
   - Create a MongoDB Atlas account
   - Create a new cluster
   - Get your connection string
   - Replace the MONGODB_URI in your `.env.local`

## 🚀 Getting Started

1. **Run the development server**:
   ```bash
   npm run dev
   ```

2. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

3. **Create an admin account**:
   - Sign up with any credentials
   - The first user will automatically be assigned admin role

## 🔐 User Roles

- **User**: Can sign up, log in, and submit feedback
- **Admin**: Can view all feedback, manage entries, export data, and access analytics

## 📊 Admin Features

- View all feedback in a sortable table
- Filter feedback by rating, date, or search terms
- Export feedback data to CSV
- Analytics dashboard with charts showing:
  - Rating distribution
  - Feedback volume over time
  - Average ratings

## 🌐 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Railway
1. Install Railway CLI
2. `railway login`
3. `railway init`
4. Set environment variables: `railway variables:set KEY=value`
5. `railway up`

### Render
1. Connect your GitHub repo
2. Set build command: `npm run build`
3. Set start command: `npm start`
4. Add environment variables
5. Deploy

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
