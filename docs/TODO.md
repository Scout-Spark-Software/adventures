# Scouts Adventures - TODO List

This document tracks incomplete features, missing functionality, and improvements needed for the Scouts Adventures platform.

## High Priority - Blocking Issues

### 1. Vercel Blob Configuration

- [ ] Set `VERCEL_BLOB_TOKEN` in .env file
- [ ] Test file upload functionality
- [ ] Add error handling for missing token

### 2. FavoriteButton User ID Bug

- [x] Fix `src/routes/hikes/[id]/+page.svelte` - pass actual userId instead of null
- [x] Fix `src/routes/camping/[id]/+page.svelte` - pass actual userId instead of null
- [x] Test favorite functionality when logged in and logged out

### 3. Environment Configuration

- [x] Create `.env.example` file with all required variables
- [x] Document each environment variable's purpose
- [x] Ensure `.env` is properly gitignored
- [x] Remove hardcoded credentials from version control

## Medium Priority - Missing Functionality

### API Endpoints

#### Camping Sites

- [x] Implement `PUT /api/camping-sites/[id]` for updates
- [x] Implement `DELETE /api/camping-sites/[id]` for deletion
- [x] Add creator/admin authorization checks

#### Alterations

- [x] Implement `PUT /api/alterations/[id]` for approval/rejection
- [x] Implement `DELETE /api/alterations/[id]` for deletion
- [x] Add proper moderation workflow

#### Files

- [x] Implement `DELETE /api/files/[id]` endpoint
- [ ] Add file cleanup when entities are deleted
- [ ] Add file validation (size limits, allowed types)

### Frontend Features

#### File Uploads

- [ ] Integrate FileUpload component into submit page
- [ ] Add ability to upload images on detail pages
- [ ] Show existing images on edit forms
- [ ] Implement image gallery for hikes/camping sites

#### User Dashboard

- [ ] Create `/profile/submissions` page to show user's hikes and camping sites
- [ ] Add ability to edit user's own submissions
- [ ] Show moderation status on user submissions
- [ ] Add delete functionality for user's own content

#### Alterations UI

- [ ] Create "Suggest Edit" button on detail pages
- [ ] Build alteration submission form
- [ ] Show pending alterations on detail pages
- [ ] Create alterations review page in admin

#### Navigation

- [ ] Add admin link to navbar when user is admin
- [ ] Add profile dropdown menu in navbar
- [ ] Add favorites link to navbar
- [ ] Improve mobile navigation

### Forms and Inputs

#### Structured Data Fields

- [x] Add features array input for hikes (checkboxes or multi-select)
- [x] Add amenities object input for camping sites
- [x] Add facilities object input for camping sites
- [x] Display features/amenities/facilities nicely on detail pages
- [x] Updated forms to support new address structure (address, city, state, country, postal code, lat/lng)
- [x] Updated detail pages to display address information
- [x] Updated API endpoints to handle addressId instead of location field

#### Form Validation

- [x] Add client-side validation on submit form
- [x] Add server-side input sanitization
- [x] Show validation errors inline
- [x] Add loading states on form submission

## Low Priority - Enhancements

### Search and Filtering

- [ ] Add search bar to hikes list page
- [ ] Add search bar to camping sites list page
- [ ] Add filters for difficulty, distance, etc.
- [ ] Add location-based search
- [ ] Add advanced filtering UI

### Pagination

- [ ] Implement pagination on hikes list
- [ ] Implement pagination on camping sites list
- [ ] Add "Load More" button option
- [ ] Show total count of results

### Map Integration

- [ ] Choose map provider (Google Maps, Mapbox, Leaflet)
- [ ] Add map view on list pages
- [ ] Add map on detail pages showing location
- [ ] Add location picker on submit form
- [ ] Implement geocoding for address to lat/lng

### Image Optimization

- [ ] Integrate Vercel Image Optimization
- [ ] Generate thumbnails for uploaded images
- [ ] Add lazy loading for images
- [ ] Implement image compression

### User Experience

- [ ] Add loading skeletons for list pages
- [ ] Add empty states (no hikes, no favorites, etc.)
- [ ] Add success/error toast notifications
- [ ] Improve error messages
- [ ] Add confirmation modals for destructive actions

### Authentication Enhancements

- [ ] Configure email verification in Stack Auth
- [ ] Add password reset functionality
- [ ] Add social login options (Google, GitHub)
- [ ] Add user profile editing (name, avatar)
- [ ] Add account deletion

## Security & Performance

### Security

- [ ] Implement CSRF protection
- [ ] Add rate limiting to API endpoints
- [ ] Add input sanitization for all user inputs
- [ ] Review and fix SQL injection vulnerabilities
- [ ] Add Content Security Policy headers
- [ ] Implement request logging
- [ ] Add audit trail for admin actions

### Performance

- [ ] Add database indexes for common queries
- [ ] Fix N+1 query issues (favorites page)
- [ ] Implement caching strategy
- [ ] Add Redis for session storage
- [ ] Optimize image loading
- [ ] Add database connection pooling
- [ ] Profile and optimize slow queries

## Monitoring & Observability

- [ ] Add error tracking (Sentry)
- [ ] Add analytics (Google Analytics or similar)
- [ ] Add performance monitoring
- [ ] Set up logging infrastructure
- [ ] Add health check endpoint
- [ ] Add database monitoring

## Documentation

- [ ] Complete README with setup instructions
- [ ] Document API endpoints (OpenAPI/Swagger)
- [ ] Add inline code comments for complex logic
- [ ] Create contributing guidelines
- [ ] Add deployment guide
- [ ] Document database schema with diagrams

## Testing

- [ ] Set up test environment
- [ ] Write unit tests for utility functions
- [ ] Write integration tests for API endpoints
- [ ] Write E2E tests for critical user flows
- [ ] Add test coverage reporting
- [ ] Set up CI/CD pipeline

## Future Features (Ideas)

- [ ] User reviews/ratings for hikes and camping sites
- [ ] Trail conditions reporting
- [ ] Weather integration
- [ ] Offline support (PWA)
- [ ] Mobile app (React Native/Flutter)
- [ ] Social features (following users, activity feed)
- [ ] Export hikes to GPX files
- [ ] Print-friendly trail guides
- [ ] Difficulty calculator based on distance/elevation
- [ ] Estimated time calculator
- [ ] Packing list generator
- [ ] Badge system for achievements

---

## Notes

### Current State

The application is a functional MVP with:

- Complete authentication system
- Core CRUD operations for hikes
- Admin moderation system
- Basic favorites functionality

### Immediate Next Steps

1. Fix the Vercel Blob token configuration
2. Fix the FavoriteButton user ID bug
3. Create .env.example file
4. Implement missing camping site endpoints
5. Add file upload integration to submit page

### Technical Debt

- Database queries need optimization (N+1 issues)
- No caching layer
- Missing input validation in many places
- No rate limiting
- Security hardening needed before production

### Environment Variables Needed

```
DATABASE_URL - PostgreSQL connection string (Neon)
STACK_PROJECT_ID - Stack Auth project ID
STACK_PUBLISHABLE_CLIENT_KEY - Stack Auth public key
STACK_SECRET_SERVER_KEY - Stack Auth secret key
VERCEL_BLOB_TOKEN - Vercel Blob storage token (currently missing value)
NODE_ENV - production/development
```
