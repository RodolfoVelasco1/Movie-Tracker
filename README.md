# 🎬 Movie & Series Tracker (Full-Stack)

A full-stack web application for tracking movies and TV series across different watch statuses. Built with Spring Boot and React + TypeScript with JWT authentication.

## ✨ Features

### Authentication & Security
- **JWT Authentication**: Secure token-based authentication
- **User Registration & Login**: Complete user management system
- **Protected Routes**: Route guards for authenticated-only access
- **Password Encryption**: BCrypt password hashing
- **Session Management**: Stateless authentication with JWT tokens

### User-Centric Data
- **Personalized Lists**: Each user has their own independent database of movies and series. Content created by one user is private and not visible to others.

### Content Management
- **Dual Tracking System**: Separate interfaces for movies and TV series
- **Status Management**: Organize content across three lists:
  - To Watch
  - In Progress
  - Completed
- **CRUD Operations**: Create, read, update, and delete entries
- **Genre Classification**: Multi-genre support with many-to-many relationships
- **Image Support**: Upload images via Cloudinary or provide image URLs

### User Experience
- **Genre Filters**: Filter movies and series by genre
- **Alphabetical Sorting**: Sort content alphabetically (A-Z)
- **Responsive Modals**: Info modal, edit modal, and delete confirmation
- **Status Transitions**: Move items between lists with arrow buttons
- **Persistent Sessions**: Token-based authentication with localStorage
- **Form Validation**: Robust form validation using **Yup** to ensure data integrity before submission (e.g., required fields, valid URLs, positive numbers).

## 🛠️ Tech Stack

### Backend
- **Spring Boot 3.2.0** - REST API framework
- **Spring Security** - Authentication and authorization
- **Spring Data JPA** - Database persistence
- **JWT (jsonwebtoken 0.11.5)** - Token-based authentication
- **H2 Database** - File-based database
- **Gradle** - Dependency management

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **React Router** - Navigation with protected routes
- **Axios** - HTTP client with interceptors
- **CSS Modules** - Component-scoped styling
- **Vite** - Build tool
- **Yup** - Schema builder for runtime value parsing and validation

## 📋 Prerequisites

- Java 17 or higher (Java 21 recommended)
- Node.js 16+ and npm
- Gradle 7.0+
- Cloudinary account (optional, for image uploads)

## 🚀 Getting Started

### Backend Setup

1. Clone the repository:
```bash
git clone https://github.com/RodolfoVelasco1/Movie-List
cd Movie-List
```

2. Navigate to the backend directory:
```bash
cd Backend
```

3. Configure the database and JWT in `application.properties`:
```properties
# Server configuration
server.port=8080

# H2 Database configuration
spring.datasource.url=jdbc:h2:file:./movies_db
spring.datasource.driver-class-name=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

spring.h2.console.enabled=true

# JPA configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# JWT configuration
jwt.secret=YOUR_SECRET_KEY_HERE
```

4. Run the Spring Boot application:
```bash
./gradlew bootRun
```

The API will start on `http://localhost:8080`

**Access H2 Console**: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:file:./movies_db`
- Username: `sa`
- Password: (leave empty)

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend root:
```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

4. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 📁 Project Structure

### Backend
```
src/main/java/org/example/
├── Config/
│   ├── DataInitializer.java         # Genre data initialization
│   ├── JwtAuthenticationFilter.java # JWT request filter
│   ├── JwtService.java              # JWT token operations
│   └── SecurityConfig.java          # Spring Security configuration
├── Controllers/
│   ├── AuthController.java          # Authentication endpoints
│   ├── AuthRequest.java             # Login/Register request DTO
│   ├── AuthResponse.java            # JWT token response DTO
│   ├── MovieController.java         # Movie CRUD endpoints
│   └── SeriesController.java        # Series CRUD endpoints
├── Entities/
│   ├── User.java                    # User entity (implements UserDetails)
│   ├── Movie.java                   # Movie entity
│   ├── Series.java                  # Series entity
│   ├── Genre.java                   # Genre entity
│   └── Enums/
│       └── Status.java              # TO_WATCH, IN_PROGRESS, COMPLETED
├── Repositories/
│   ├── UserRepository.java          # User data access
│   ├── MovieRepository.java         # Movie data access
│   ├── SeriesRepository.java        # Series data access
│   └── GenreRepository.java         # Genre data access
├── Services/
│   ├── AuthService.java             # Authentication logic
│   ├── MovieService.java            # Movie business logic
│   └── SeriesService.java           # Series business logic
└── Main.java                        # Application entry point
```

### Frontend
```
src/
├── components/
│   ├── screens/
│   │   ├── Home.tsx                 # Landing page
│   │   ├── LoginPage.tsx            # User login
│   │   ├── RegisterPage.tsx         # User registration
│   │   ├── MoviesPage.tsx           # Movies with filters
│   │   └── SeriesPage.tsx           # Series with filters
│   └── ui/                          # Reusable components  
│       └── Modal.tsx   
│       └── DeleteModal.tsx    
│       └── InfoModal.tsx     
├── routes/
│   ├── AppRoutes.tsx                # Route definitions
│   └── ProtectedRoute.tsx           # Route guard component
├── types/                           # TypeScript interfaces
├── main.tsx                         # Axios interceptor setup
└── App.tsx                          # Main app component
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and receive JWT token

### Movies (Protected)
- `GET /api/movies` - Get all movies
- `POST /api/movies` - Create a movie
- `PUT /api/movies/{id}` - Update a movie
- `DELETE /api/movies/{id}` - Delete a movie

### Series (Protected)
- `GET /api/series` - Get all series
- `POST /api/series` - Create a series
- `PUT /api/series/{id}` - Update a series
- `DELETE /api/series/{id}` - Delete a series

### Genres (Protected)
- `GET /api/genres` - Get all genres

**Note**: All endpoints except `/api/auth/**` require a valid JWT token in the Authorization header: `Bearer <token>`

## 🗄️ Database Schema

### Entities

**User**
- id (Long)
- username (String, unique)
- password (String, encrypted)
- authorities (ROLE_USER)

**Movie**
- id (Long)
- title (String)
- summary (String)
- duration (Integer)
- imageUrl (String)
- status (Enum: TO_WATCH, IN_PROGRESS, COMPLETED)
- genres (Many-to-Many with Genre)

**Series**
- id (Long)
- title (String)
- summary (String)
- duration (Integer)
- episodes (Integer)
- imageUrl (String)
- status (Enum: TO_WATCH, IN_PROGRESS, COMPLETED)
- genres (Many-to-Many with Genre)

**Genre**
- id (Long)
- name (String)
- movies (Many-to-Many with Movie)
- series (Many-to-Many with Series)

### Relationships
- **User ↔ Movies/Series**: One user can have many movies and series
- **Movie/Series ↔ Genre**: Many-to-many relationship
- Join tables: `movie_genres`, `series_genres`

## 🎨 Features in Detail

### Authentication Flow
1. User registers or logs in via `/auth/register` or `/auth/login`
2. Backend returns JWT token
3. Token stored in localStorage
4. Axios interceptor adds token to all requests
5. Protected routes redirect unauthenticated users to login

### Status Management
Items can be moved between three status categories using arrow buttons:
- **To Watch** → In Progress → Completed
- Bidirectional navigation available

### Genre System
- Pre-populated with 12 common genres via DataInitializer:
  - Action, Adventure, Animation, Comedy, Documentary, Drama, Fantasy, Horror, Musical, Mystery, Sci-Fi, Suspense
- Multiple genres can be assigned to each movie/series
- Genre filtering on both Movies and Series pages

### Sorting & Filtering
- **Genre Filter**: Dropdown to filter by specific genre or view all
- **Alphabetical Sort**: Toggle A-Z sorting for content lists
- Filters work independently for movies and series

### Image Handling
Two options for adding images:
1. **URL Input**: Paste direct image links
2. **File Upload**: Upload images to Cloudinary

## 🔧 Configuration

### CORS
CORS is centrally configured within `SecurityConfig.java` to accept requests from the frontend origin (`http://localhost:5173`) and allow credentials, ensuring secure communication with the React app.

### Security
- **JWT Secret**: Configure in `application.properties` (use a strong secret in production)
- **Token Expiration**: 24 hours (configurable in `JwtService.java`)
- **Password Encryption**: BCrypt with default strength
- **CSRF**: Disabled for stateless JWT authentication

### Database
The app uses **H2 file-based database** (`./movies_db`), which persists data between restarts. Data is automatically initialized with genres on first run.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👤 Author

Rodolfo Velasco
- GitHub: [@RodolfoVelasco1](https://github.com/RodolfoVelasco1)

---

**Happy tracking! 🎬🍿**