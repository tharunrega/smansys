# SMANSYS - School Management System

A comprehensive full-stack school management system with role-based access control, student management, and advanced analytics.

![SMANSYS Dashboard](https://via.placeholder.com/1200x600?text=SMANSYS+Dashboard)

## 🚀 Features

- **Role-Based Access Control**: Admin, Manager, and Teacher roles with different permissions
- **Student Management**: Complete student lifecycle management with detailed profiles
- **Modern Dashboard**: Real-time analytics, metrics, and data visualization
- **Responsive Design**: Mobile-first approach with smooth animations using Framer Motion
- **Advanced Filtering**: Dynamic filters for student data with search functionality
- **Secure Authentication**: JWT-based authentication with session management
- **User Management**: Comprehensive user profiles with avatar support

## 📊 Dashboard Features

- **Performance Metrics**: Key metrics at a glance for quick insights
- **Enrollment Analytics**: Visual representation of student enrollment data
- **Class Distribution**: Charts showing student distribution across classes
- **Recent Activities**: Activity log for monitoring system updates
- **Quick Access**: Shortcuts to commonly used features

## 🧑‍🎓 Student Management

- **Student Profiles**: Comprehensive student information management
- **Class Assignment**: Assign students to classes and sections
- **Attendance Tracking**: Record and monitor student attendance
- **Academic Performance**: Track grades and academic progress
- **Parent Communication**: Tools for parent-teacher communication

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** with custom design system
- **Framer Motion** for smooth animations
- **Zustand** for state management
- **React Query** for data fetching
- **Axios** for API communication
- **Chart.js** for data visualization
- **Lucide React** for icons

### Backend
- **Node.js** with **Fastify** framework
- **TypeScript** for type safety
- **MongoDB** for database
- **JWT** for authentication
- **Zod** for data validation
- **Mongoose** for ODM
- **Multer** for file uploads

## 📁 Project Structure

```
smansys/
├── backend/              # Backend server
│   ├── src/
│   │   ├── config/       # Configuration files
│   │   ├── middleware/   # Custom middleware
│   │   ├── models/       # Mongoose models
│   │   ├── routes/       # API routes
│   │   └── server.ts     # Main server file
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/             # Next.js frontend
│   ├── app/              # Next.js app router pages
│   │   ├── (auth)/       # Authentication pages
│   │   ├── dashboard/    # Dashboard page
│   │   ├── students/     # Student management
│   │   ├── teachers/     # Teacher management
│   │   ├── finance/      # Finance management
│   │   ├── profile/      # User profile
│   │   └── settings/     # App settings
│   ├── components/       # Reusable components
│   │   ├── charts/       # Chart components
│   │   ├── layout/       # Layout components
│   │   └── ui/           # UI components
│   ├── lib/              # Utility functions and API clients
│   ├── public/           # Static assets
│   └── package.json
│
└── package.json          # Root package.json for scripts
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/smansys.git
   cd smansys
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```
   Edit the `.env` files with your configuration

4. **Start the development servers**
   ```bash
   npm run dev
   ```
   This will start both the backend (http://localhost:5001) and frontend (http://localhost:3000) servers.

### Building for Production

```bash
npm run build
```

### Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001/api
- **API Documentation**: http://localhost:5001/docs

## � Authentication & Authorization

The system implements role-based access control with three main roles:

1. **Admin**: Full access to all features and settings
2. **Manager**: Access to student management and reports
3. **User/Teacher**: Limited access based on assigned permissions

### Demo Accounts

The system comes with pre-configured demo accounts:

```javascript
// Admin user
{
  "email": "admin@example.com",
  "password": "password",
  "role": "admin"
}

// Manager user
{
  "email": "manager@example.com",
  "password": "password",
  "role": "manager"
}

// Regular user
{
  "email": "user@example.com",
  "password": "password",
  "role": "user"
}
```

JWT tokens are used for authentication with secure HTTP-only cookies.

## � Responsive Design

The application is designed with a mobile-first approach, ensuring a seamless experience across devices:

- **Desktop**: Full dashboard with expanded features
- **Tablet**: Optimized layout for medium screens
- **Mobile**: Condensed views with essential functionality

## 🧪 Testing

Run tests for both frontend and backend:

```bash
# Run backend tests
cd backend && npm test

# Run frontend tests
cd frontend && npm test
```

## 🚀 Deployment

The application can be deployed on various platforms:

- **Frontend**: Vercel, Netlify, or any static hosting
- **Backend**: Render, Heroku, or any Node.js hosting
- **Database**: MongoDB Atlas (recommended for production)

## 🔄 API Documentation

API documentation is available at:
- Development: http://localhost:5001/docs
- Production: https://your-api-url.com/docs

## � License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## � Acknowledgements

- [Next.js](https://nextjs.org/)
- [Fastify](https://www.fastify.io/)
- [MongoDB](https://www.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)

---

Built with ❤️ by [Your Name](https://github.com/yourusername)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code examples

## 🎯 Roadmap

- [ ] GraphQL API support
- [ ] Real-time notifications
- [ ] File management system
- [ ] Advanced reporting
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Mobile app (React Native)

---

**Built with ❤️ for modern school management** 