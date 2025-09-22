# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

Build for production:
```bash
npm run build
```

Linting and type checking:
```bash
npx @biomejs/biome check --write --unsafe
```

Use `context7` mcp to check React Admin's online docs

Check backend admin APIs in `docs/admin-api.md`

## Architecture

This is a React Admin application for managing the Contigo platform. It's built with:
- **React Admin** framework for admin interface
- **Vite** for development and building
- **TypeScript** for type safety
- **Material-UI** components via React Admin
- **React Router** for navigation

### Core Structure

- `src/App.tsx`: Main application entry point with React Admin configuration
- `src/Layout.tsx`: Custom layout wrapper with menu integration
- `src/dataProvider.ts`: Handles API communication with the backend, includes custom timestamp parsing for Contigo's format
- `src/authProvider.ts`: JWT-based authentication with localStorage token management

### Resource Management

The application manages three main resources:
1. **Users** (`/src/users/`): User management with verification status updates
2. **Matches** (`/src/matches/`): Match browsing and scheduled match creation/management
3. **Analytics** (`/src/analytics/`): Dashboard stats and tag analytics

### API Integration

- Backend API base URL configured via `VITE_API_BASE_URL` environment variable (defaults to `http://localhost:8091`)
- Custom HTTP client in dataProvider handles JWT token authorization
- Special timestamp parsing for Contigo's array-based timestamp format: `[year, day_of_year, hour, minute, second, nanosecond]`
- Admin-specific endpoints for stats, tags, previews, and match triggering

### Custom Components

Located in `src/components/`:
- `CustomMenu`: Navigation menu integration
- `ImageField`: Display card images from backend
- `StatusField`: User verification status display
- `DateTimeField`: Formatted timestamp display

### Environment Configuration

The app expects `VITE_API_BASE_URL` environment variable for backend API connection.
