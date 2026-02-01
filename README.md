             🚗 CAR BRAND TRACKER SYSTEM 🚗              █


A full-stack system where:
- 👨‍💼 Admins create and manage car brands
- 👤 Users select brands and record kilometers traveled
- 📊 Track usage and history per car brand


------------------------------------------------------------
🛠 TECH STACK
------------------------------------------------------------

Backend:
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication

Frontend:
- React
- TypeScript
- Vite
- Axios
- Tailwind CSS (optional)

------------------------------------------------------------
🔐 USER ROLES
------------------------------------------------------------

ADMIN:
- Create car brands
- View all users
- Monitor kilometers per brand

USER:
- View available car brands
- Select a brand
- Add kilometers traveled
- View personal travel history

------------------------------------------------------------
⚙️ ENVIRONMENT VARIABLES (Backend)
------------------------------------------------------------

Create a `.env` file inside `/backend`:

MONGO_URI=your_mongodb_connection_string  ,  
JWT_SECRET=your_secret_key  , 
PORT=5000

------------------------------------------------------------
🚀 GETTING STARTED
------------------------------------------------------------

1️⃣ Clone the repository:
git clone https://github.com/Y-elv/car-brand-tracker.git 

2️⃣ Backend setup:
cd backend
npm install
npm run dev

3️⃣ Frontend setup:
cd ../frontend
npm install
npm run dev

------------------------------------------------------------
📡 API OVERVIEW
------------------------------------------------------------

POST   /api/auth/register        -> Register user
POST   /api/auth/login           -> Login user
POST   /api/brands               -> Create car brand (Admin)
GET    /api/brands               -> Get all brands
POST   /api/kilometers           -> Add kilometers (User)

------------------------------------------------------------
📌 FUTURE IMPROVEMENTS
------------------------------------------------------------

- Email notifications
- Admin dashboard analytics
- Role-based UI guards
- Deployment with Docker
- CI/CD pipeline



------------------------------------------------------------
⭐ SUPPORT
------------------------------------------------------------

If you like this project:
- Star the repository ⭐
- Fork it 🍴
- Contribute 🚀

