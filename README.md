# PowerWatch - Electrical Hazard Reporting System

A complete role-based web application for reporting electrical hazards to Marinduque Electric Cooperative.

## Features ⚡

### For Residents
- **User Registration & Login** with secure authentication
- **Report Hazards** with title, location, description, and photo upload
- **View My Reports** - Track all submitted hazard reports
- **Real-time Status Updates** - See report status (Pending, In Progress, Resolved)
- **Responsive Design** - Works on desktop and mobile

### For Admins
- **Dashboard Statistics** - Total, pending, in-progress, and resolved reports
- **View All Reports** - See all hazard reports from residents
- **Filter Reports** - Filter by status (All, Pending, In Progress, Resolved)
- **Update Status** - Change report status directly from dashboard
- **Report Details** - View reporter info, location, description, and photos

## Tech Stack 🛠️

**Backend:**
- Node.js & Express.js
- MongoDB with Mongoose
- JWT for authentication
- Multer for file uploads
- Bcryptjs for password hashing

**Frontend:**
- React with React Router
- Axios for API calls
- CSS3 with responsive design

## Installation & Setup

### Prerequisites
- Node.js (v14+)
- MongoDB instance (local or cloud)
- npm or yarn

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the server directory:
```
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_here
BASE_URI=/api/v1
```

4. Start the server:
```bash
npm run dev
```

The server will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to the client directory:
```bash
cd ../client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (or another available port)

## Database Schema

### User Model
```javascript
{
  name: String,
  email: String,
  password: String (hashed),
  role: String (resident | admin)
}
```

### HazardReport Model
```javascript
{
  title: String,
  description: String,
  location: String,
  image: String (file path),
  status: String (Pending | In Progress | Resolved),
  reportedBy: ObjectId (ref: User),
  createdAt: Date
}
```

## API Endpoints

### Authentication
- **POST** `/api/auth/register` - Register new user
  - Body: `{name, email, password, role}`
  
- **POST** `/api/auth/login` - Login user
  - Body: `{email, password}`
  - Returns: `{token, user}`

### Reports (Requires Authentication)
- **POST** `/api/reports` - Create new report (FormData with image)
  - Headers: `Authorization: Bearer {token}`
  - Body: `{title, location, description, image}`

- **GET** `/api/reports` - Get reports
  - Headers: `Authorization: Bearer {token}`
  - Residents get their reports, Admins get all reports

- **PUT** `/api/reports/:id/status` - Update report status (Admin only)
  - Headers: `Authorization: Bearer {token}`
  - Body: `{status}`

## User Roles

### Resident
- Can register and login
- Can submit hazard reports with photo
- Can only view their own reports
- Can see report status updates

### Admin
- Can login as admin
- Can view all hazard reports
- Can filter reports by status
- Can update report status
- Can view reporter details

## Usage Guide

### Creating an Account

1. Go to the home page
2. Click "Register"
3. Fill in your details:
   - Full Name
   - Email
   - Password
   - Account Type (select "Resident" for regular users)
4. Click "Register"
5. Login with your credentials

### Submitting a Hazard Report

1. Login to your account
2. Click "Report Hazard" or navigate to `/report`
3. Fill in the form:
   - **Hazard Title**: e.g., "Fallen Electric Post"
   - **Location**: Provide specific location details
   - **Description**: Detailed description of the hazard
   - **Photo**: (Optional) Upload a photo of the hazard
4. Click "Submit Report"

### Viewing Your Reports (Resident)

1. Login to your account
2. Click "My Reports" or navigate to `/dashboard`
3. View all your submitted reports with their status
4. Each report card shows:
   - Title, location, description
   - Current status (Pending/In Progress/Resolved)
   - Uploaded photo (if any)

### Using Admin Dashboard

1. Login as an admin account
2. You'll be redirected to the admin dashboard
3. View statistics and all submitted reports
4. Use the filter buttons to view reports by status
5. Click the status dropdown to update a report's status

## File Upload

- Supported formats: JPEG, JPG, PNG, GIF
- Maximum file size: 10MB
- Files are stored in `/server/uploads` directory
- Images are served at `http://localhost:3000/uploads/filename`

## Security Features

- **Password Hashing**: Bcryptjs with 10 salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Authorization**: Middleware to protect routes
- **File Validation**: Only image files allowed
- **CORS Enabled**: Secure cross-origin requests

## Project Structure

```
powerwatch-system/
├── server/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── reportController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   └── HazardReport.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── reportRoutes.js
│   ├── uploads/
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ReportHazard.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── routes/
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── styles/
│   │   │   ├── style.css
│   │   │   ├── navbar.css
│   │   │   ├── auth.css
│   │   │   ├── home.css
│   │   │   ├── report.css
│   │   │   ├── dashboard.css
│   │   │   └── admin.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
```

## Troubleshooting

### Port Already in Use
If port 3000 is already in use:
1. Update the `PORT` in `.env`
2. Update the `API_URL` in `client/src/services/api.js`

### Database Connection Error
1. Verify MongoDB connection string in `.env`
2. Ensure MongoDB is running
3. Check if database is accessible

### File Upload Issues
1. Ensure `/server/uploads` directory exists
2. Check file size (max 10MB)
3. Verify file format (JPEG, JPG, PNG, GIF only)

### CORS Errors
- Backend CORS is already configured
- Ensure frontend is running on a different port than backend

## Future Enhancements

- [ ] Email notifications for report updates
- [ ] Hazard severity levels
- [ ] Geolocation integration
- [ ] Report commenting/discussion
- [ ] Admin analytics and charts
- [ ] Mobile app
- [ ] Real-time notifications

## License

This project is licensed under the MIT License.

## Support

For issues or questions, please contact the development team.

---

**Created for Marinduque Electric Cooperative**  
**PowerWatch - Keep Communities Safe From Electrical Hazards** ⚡
# PowerWacth
