# Travel Experience Review and Recommendation Platform - Backend

## Overview
A Spring Boot REST API backend for a travel review platform that allows users to share reviews, rate destinations, and receive recommendations.

## Features
- User authentication and management
- Destination management with CRUD operations
- Review system with rating calculations
- Search functionality for destinations
- Admin capabilities for content management

## Technology Stack
- **Framework**: Spring Boot 3.2.0
- **Database**: H2 (In-memory)
- **Build Tool**: Maven
- **Java Version**: 17

## Project Structure
```
src/main/java/com/travel/platform/
├── controller/          # REST Controllers
├── model/              # Entity classes
├── repository/         # Data repositories
├── service/           # Business logic
├── config/            # Configuration classes
└── TravelApplication.java
```

## Database Schema

### Users Table
- id (Primary Key)
- username (Unique)
- email (Unique)
- password
- role (USER/ADMIN)

### Destinations Table
- id (Primary Key)
- name
- country
- description
- imageUrl
- category
- averageRating
- reviewCount

### Reviews Table
- id (Primary Key)
- rating (1-5)
- comment
- userId (Foreign Key)
- destinationId (Foreign Key)
- username
- destinationName

## REST API Endpoints

### User Management
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID

### Destination Management
- `GET /api/destinations` - Get all destinations
- `GET /api/destinations/{id}` - Get destination by ID
- `POST /api/destinations` - Create new destination (Admin only)
- `GET /api/destinations/search?query={query}` - Search destinations
- `GET /api/destinations/top-rated` - Get top rated destinations

### Review Management
- `POST /api/reviews` - Create new review
- `GET /api/reviews` - Get all reviews
- `GET /api/reviews/destination/{destinationId}` - Get reviews for destination
- `GET /api/reviews/user/{userId}` - Get reviews by user

## Setup Instructions

### Prerequisites
- Java 17 or higher
- Maven 3.6 or higher

### Running the Application
1. Navigate to the backend directory:
   ```bash
   cd travel_backend
   ```

2. Run the application:
   ```bash
   mvn spring-boot:run
   ```

3. The API will be available at: `http://localhost:8080`

4. Access H2 Console: `http://localhost:8080/h2-console`
   - JDBC URL: `jdbc:h2:mem:traveldb`
   - Username: `sa`
   - Password: `password`

### Sample Data
The application automatically creates:
- Admin user: username=`admin`, password=`admin123`
- 5 sample destinations (Paris, Tokyo, Bali, New York, Rome)

## API Testing
You can test the APIs using tools like Postman or curl:

```bash
# Register a new user
curl -X POST http://localhost:8080/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:8080/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'

# Get all destinations
curl http://localhost:8080/api/destinations

# Add a review
curl -X POST http://localhost:8080/api/reviews \
  -H "Content-Type: application/json" \
  -d '{"rating":5,"comment":"Amazing place!","userId":1,"destinationId":1,"username":"testuser"}'
```

## Development Notes
- CORS is enabled for all origins to allow frontend integration
- H2 database is used for simplicity (data is lost on restart)
- No JWT authentication implemented (simplified for demo)
- Basic validation is implemented on entities
- Automatic rating calculation when reviews are added