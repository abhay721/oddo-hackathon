<<<<<<< HEAD
# oddo-hackathon
4 members team
=======
# CivicTrack

Empower citizens to report and resolve local issues such as road damage, garbage, water leaks, and more.

## Features

- **Authentication:** Register, login, JWT tokens, admin role.
- **Report Issues:** Title, description, category, location (auto/GPS/manual), photos (cloud upload), anonymous/verified.
- **View Issues:** Map (Leaflet), filter by status/category/distance, only issues within 1-5km.
- **Status Tracking:** Status logs, notifications, flag spam.
- **Admin Dashboard:** Analytics, ban users.
- **Modern Responsive UI**

## Setup

1. Start MongoDB.
2. Fill in your Cloudinary keys in `backend/routes/issues.js`.
3. In `backend/`, run:
    ```bash
    npm install express mongoose cors bcrypt jsonwebtoken multer cloudinary
    node server.js
    ```
4. In `frontend/`, open `index.html` (use Live Server for local API calls).

## Deploy

- See README section above for deployment instructions (Render, Vercel, Netlify, MongoDB Atlas, etc.)

## Extend

- Add email notifications.
- Improve geospatial filtering.
- Add password reset.
- Enhance accessibility & mobile experience.

---
>>>>>>> c5d871d (Add CivicTrack frontend and backend)
