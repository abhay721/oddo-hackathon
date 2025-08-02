# CivicTrack

Empower citizens to easily report local issues such as road damage, garbage, and water leaks.  
Seamlessly track the resolution of these issues and foster effortless engagement within your local community.

## Features

- Report issues (title, description, photos, category, location, anonymous/verified)
- View issues within a 1/3/5 km radius of your location
- Filter issues by status and category
- Issue status tracking and notification
- Flag spam or irrelevant reports
- Admin moderation and analytics (extendable)

## Getting Started

### Backend

1. Requires MongoDB running locally (or update `server.js` for remote).
2. Install dependencies:
    ```bash
    cd backend
    npm install express mongoose cors
    node server.js
    ```

### Frontend

1. Open `frontend/index.html` in your browser (use Live Server for local API calls).

## Extend

- Add authentication for verified users/admin
- Use real map API (Google Maps, Leaflet)
- Store images in cloud and save URLs
- Admin dashboard for analytics, banning users

---