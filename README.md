# Medical Contract Builder

A comprehensive contract-building website for medical website development, featuring both frontend and backend integration with document upload capabilities and a compelling medical-themed design.

## Features

### 🏥 Medical Industry Focus
- Specialized for medical website development contracts
- HIPAA compliance considerations
- Medical industry-specific project types (EHR, Telemedicine, Medical Apps)
- Healthcare professional and contractor collaboration

### 📋 Contract Management
- Create and manage development contracts
- Real-time contract status tracking
- Milestone-based project management
- Client-contractor communication system
- Document upload and management (DL front/back)

### 🔐 Security & Authentication
- Secure user authentication with JWT
- Role-based access control (Client/Contractor/Admin)
- Password protection and user management
- Secure document storage

### 📱 Modern UI/UX
- Responsive design for all devices
- Medical-themed color scheme and branding
- Intuitive user interface
- Real-time notifications and feedback

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Multer** for file uploads
- **Express Validator** for input validation
- **Helmet** for security
- **Rate Limiting** for API protection

### Frontend
- **React 18** with functional components
- **React Router** for navigation
- **Styled Components** for styling
- **Axios** for API communication
- **React Hook Form** for form management
- **Framer Motion** for animations
- **Lucide React** for icons

## Project Structure

```
medical-contract-builder/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   └── App.js
│   └── package.json
├── server/                 # Node.js backend
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── middleware/        # Custom middleware
│   └── index.js
└── package.json           # Root package.json
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd medical-contract-builder
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install all dependencies (root, server, client)
npm run install-all
```

### 3. Environment Setup

Create a `.env` file in the `server` directory:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/medical-contracts
JWT_SECRET=your_jwt_secret_key_here
CLIENT_URL=http://localhost:3000
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760
```

### 4. Database Setup
Make sure MongoDB is running on your system. The application will automatically create the necessary collections.

### 5. Start the Application

#### Development Mode (Both Frontend & Backend)
```bash
npm run dev
```

#### Start Backend Only
```bash
npm run server
```

#### Start Frontend Only
```bash
npm run client
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Contracts
- `GET /api/contracts` - Get all contracts
- `GET /api/contracts/:id` - Get specific contract
- `POST /api/contracts` - Create new contract
- `PUT /api/contracts/:id` - Update contract
- `DELETE /api/contracts/:id` - Delete contract
- `POST /api/contracts/:id/status` - Update contract status
- `POST /api/contracts/:id/message` - Add contract message

### Documents
- `POST /api/documents/upload` - Upload document
- `GET /api/documents/:id` - Get document details
- `GET /api/documents/:id/download` - Download document
- `DELETE /api/documents/:id` - Delete document
- `PUT /api/documents/:id/verify` - Verify document

## Key Features

### Contract Creation
- Comprehensive contract forms with medical-specific fields
- Project type selection (Medical Website, EHR, Telemedicine, etc.)
- Budget and timeline management
- Milestone tracking
- Requirements specification
- Terms and conditions

### Document Management
- Secure document upload (DL front/back)
- File type validation (images, PDFs)
- Document verification system
- Download and delete capabilities

### User Management
- Role-based access (Client/Contractor)
- Profile management
- Secure authentication
- Password management

### Communication
- Real-time messaging between parties
- Contract status updates
- Notification system

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- File upload security
- Rate limiting
- CORS protection
- Helmet security headers

## Deployment

### Backend Deployment
1. Set up MongoDB database (MongoDB Atlas recommended)
2. Configure environment variables
3. Deploy to platforms like Heroku, Railway, or AWS

### Frontend Deployment
1. Build the React application: `npm run build`
2. Deploy to platforms like Vercel, Netlify, or AWS S3

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.

---

**Medical Contract Builder** - Streamlining medical development contract management with security, efficiency, and user-friendly design.
