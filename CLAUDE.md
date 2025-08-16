# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a family pregnancy collaboration app ("备孕孕期家庭协作应用") with a Spring Boot backend and React Native frontend. The app supports multiple family roles (parents, grandparents) through a role-based permission system for pregnancy health management, family collaboration, and emotional interaction.

## Architecture

### Backend (Spring Boot)
- **Framework**: Spring Boot 3.4.5 with Java 21
- **Database**: MySQL 8.0 with MyBatis-Plus ORM
- **Authentication**: Sa-Token with Redis session management  
- **Documentation**: Knife4j (OpenAPI 3.0) at `/doc.html`
- **Containerization**: Docker + Docker Compose

### Frontend (React Native + Expo)
- **Framework**: React Native with Expo (~53.0.0)
- **Language**: TypeScript with strict mode
- **Routing**: Expo Router with file-based routing
- **UI Libraries**: React Native Calendars, Chart Kit, Linear Gradient
- **Navigation**: Tab-based navigation with modal support

## Development Commands

### Backend Commands
```bash
# Quick start with H2 in-memory database (recommended for testing)
mvn spring-boot:run -Dspring.profiles.active=test

# Development with MySQL/Redis
mvn spring-boot:run -Dspring.profiles.active=dev

# Build and package
mvn clean package -DskipTests

# Run tests
mvn test

# Docker deployment
docker-compose up -d
```

### Frontend Commands
```bash
# Install dependencies
npm install

# Start development server
npm start

# Platform-specific development
npm run web      # Web browser
npm run ios      # iOS simulator  
npm run android  # Android emulator

# Linting
npm run lint
```

## Key Application URLs

### Backend
- **Application**: http://localhost:8080
- **API Documentation**: http://localhost:8080/doc.html
- **Health Check**: http://localhost:8080/health
- **H2 Console** (test profile): http://localhost:8080/h2-console

### Default Credentials
- **Username**: admin
- **Password**: 123456

## Core Modules & Architecture

### Backend Package Structure
```
com.growth/
├── common/           # Global handlers, base classes, exceptions
├── config/           # Configuration classes (Redis, MyBatis, Sa-Token)
├── controller/       # REST controllers
├── dao/              # MyBatis mappers
├── entity/           # JPA entities with request/response DTOs
├── service/          # Business logic layer
└── scheduler/        # Scheduled tasks (notifications)
```

### Frontend Structure  
```
app/                  # File-based routing (expo-router)
├── (tabs)/          # Tab navigation pages
├── family/          # Family management flows
└── profile/         # User profile pages

src/
├── components/      # Reusable UI components
├── contexts/        # React contexts (Auth, Family, Theme, Notification)
├── services/        # API service layer
├── types/           # TypeScript interfaces
└── utils/           # Utility functions
```

## Key Features & Domains

### Core Entities
- **User Management**: Users, profiles, device tokens
- **Family System**: Families, members, roles, relationships
- **Pregnancy Tracking**: Progress tracking, health data
- **Notifications**: Templates, push records, scheduling
- **AI Integration**: Chat support (Spring AI integration ready)

### Authentication Flow
- Sa-Token JWT-based authentication
- Role-based permissions
- Family membership validation
- Device token registration for push notifications

## Development Guidelines

### Backend Standards
- Use constructor injection over field injection
- Extend `BaseEntity` for all entities (audit fields)
- Use `Result<T>` wrapper for all API responses
- Implement business logic in service layer
- Use `@Valid` for request validation
- Custom exceptions with `BusinessException`

### Frontend Standards  
- Functional components with TypeScript interfaces
- Use React Context for global state
- File-based routing with Expo Router
- Safe area management with `SafeAreaProvider`
- Consistent theming with `useColorScheme`
- Error boundaries for robust error handling

### API Patterns
- RESTful endpoints under `/api/*`
- Authentication endpoints under `/auth/*`
- Standardized response format with `Result<T>`
- Comprehensive API documentation via Knife4j

## Testing Strategy

### Backend Testing
```bash
# Unit tests
mvn test

# Integration tests  
mvn verify -Dspring.profiles.active=test
```

### Frontend Testing
```bash
# Type checking
npx tsc --noEmit

# Linting
npm run lint
```

## Environment Configuration

### Backend Profiles
- **test**: H2 in-memory database, no Redis required
- **dev**: Local MySQL/Redis development
- **prd**: Production configuration

### Frontend Environments
- Development server supports hot reload
- Platform-specific builds via EAS
- OTA updates configured via Expo Updates

## Common Issues & Solutions

### Backend Startup Issues
- **Redis connection errors**: Use `test` profile or start Redis service
- **Database connection**: Verify MySQL is running and credentials are correct
- **Port conflicts**: Check if port 8080 is available

### Frontend Development
- **Metro bundler issues**: Clear cache with `npx expo start --clear`
- **iOS simulator**: Ensure Xcode and iOS simulator are properly installed
- **Android emulator**: Verify Android Studio and AVD setup

## Notification System

The app implements a comprehensive notification system with:
- **Templates**: Predefined notification templates
- **Scheduling**: Automated pregnancy milestone notifications  
- **Push Integration**: Expo push notifications
- **Family Broadcasting**: One-click notifications to family members

## Deployment

### Docker Deployment
```bash
# Full stack deployment
docker-compose up -d

# With Nginx proxy
docker-compose --profile nginx up -d

# View logs
docker-compose logs app
```

### Production Considerations
- Use environment-specific configurations
- Enable proper logging and monitoring
- Configure SSL/TLS for production
- Set up database backups
- Configure Redis persistence

This project follows a domain-driven design with clear separation between family management, health tracking, and notification systems. The codebase emphasizes type safety, proper error handling, and maintainable architecture patterns.