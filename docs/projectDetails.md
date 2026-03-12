# Video Hosting Platform - Technical Documentation

## Overview
A full-stack video hosting and social platform similar to YouTube. It features user authentication, video uploads with Cloudinary integration, real-time-like social interactions (likes, comments, tweets), and subscription management.

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Media Storage**: Cloudinary (via Multer middleware)
- **Authentication**: JSON Web Token (JWT) & Bcryptjs
- **Validation**: Manual & Mongoose Schemas
- **Features**: Aggregation pipelines for complex queries (via `mongoose-aggregate-paginate-v2`).

### Frontend
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI / Shadcn UI
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **API Client**: Axios
- **State/Themes**: Next Themes

---

## Backend Architecture

### Core Models
1. **User**: Handles authentication, profiles (avatar, cover image), and account details.
2. **Video**: Manages video metadata, view counts, and publishing status.
3. **Comment**: Stores user comments on videos.
4. **Like**: Tracks likes for videos, comments, and tweets.
5. **Subscription**: Manages follower-following relationships between users.
6. **Playlist**: Allows users to group videos.
7. **Tweet**: A lightweight social posting feature for users.

### API Routes
- `/api/v1/users`: Auth, profile management, history.
- `/api/v1/videos`: Upload, search, update, delete videos.
- `/api/v1/comments`: Video comment management.
- `/api/v1/likes`: Toggling likes on various entities.
- `/api/v1/subscriptions`: Channel subscription logic.
- `/api/v1/playlists`: Playlist CRUD operations.
- `/api/v1/tweets`: User tweet management.

---

## Frontend Structure

### Key Pages (`app/` directory)
- `/`: Home page (Video feed)
- `/login` & `/register`: Authentication flows.
- `/dashboard`: Personal stats and video management.
- `/watch/[videoId]`: Video playback and interaction.
- `/c/[username]`: Channel profile pages.
- `/my-videos`: User's uploaded content.
- `/subscriptions`: Feed from subscribed channels.
- `/playlists`: User's curated collections.

### Core Components
- **Header**: Global navigation and search.
- **Video Card**: Reusable video preview component.
- **Comment Section**: Interactive comment management.
- **Sidebar**: Easy navigation to categories and subscriptions.
- **Upload Modal**: Multi-step video upload with progress indicators.

---

## Implementation Details

### Media Handling
Videos and images are uploaded to the backend via `multer`, then processed and stored on **Cloudinary**. The backend returns secure URLs which are stored in MongoDB.

### Security
- **Passwords**: Hashed using `bcryptjs`.
- **API Security**: Protected by JWT stored in HTTP-only cookies.
- **CORS**: Configured for secure frontend-backend communication.

### UI/UX
- **Responsive Design**: Built with mobile-first Tailwind CSS.
- **Dark Mode**: Supports system and manual theme toggling.
- **Micro-interactions**: Framer Motion used for smooth transitions and hover effects.
