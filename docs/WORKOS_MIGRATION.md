# WorkOS Migration Guide

**Migration Date:** December 22, 2024  
**From:** Stack Auth (Neon Auth)  
**To:** WorkOS User Management

## Overview

This document provides a complete guide for migrating from Stack Auth to WorkOS User Management with email/password authentication. This is a fresh start migration with no existing users to migrate.

---

## Required Environment Variables

### Add these to `.env`:

```bash
# WorkOS Configuration
WORKOS_API_KEY='sk_live_xxx'              # From WorkOS dashboard
WORKOS_CLIENT_ID='client_xxx'             # From WorkOS dashboard
WORKOS_ORGANIZATION_ID='org_xxx'          # Organization ID for this project
WORKOS_COOKIE_PASSWORD='xxx'              # Generate: openssl rand -base64 32
```

### Remove these from `.env`:

```bash
STACK_PROJECT_ID
STACK_PUBLISHABLE_CLIENT_KEY
STACK_SECRET_SERVER_KEY
AUTH_URL  # Better Auth legacy variable
```

### To get your WorkOS credentials:

1. Sign in to [WorkOS Dashboard](https://dashboard.workos.com)
2. Navigate to your project
3. Copy **API Key** (starts with `sk_live_` or `sk_test_`)
4. Copy **Client ID** (starts with `client_`)
5. Go to **Organizations** and create or select your organization
6. Copy **Organization ID** (starts with `org_`)
7. Generate cookie password: `openssl rand -base64 32`

---

## Migration Architecture

### Authentication Provider: WorkOS User Management

**Organization-Based Authentication:**

- All users are created and managed within a specific WorkOS organization
- Users are automatically added as organization members upon signup
- Authentication is scoped to the organization

**WorkOS stores:**

- User authentication credentials (email, hashed passwords)
- Basic user profile (firstName, lastName, email)
- Organization memberships
- Session tokens (access + refresh)
- Email verification status

**Local PostgreSQL stores:**

- User roles (admin, moderator, user)
- User activity (favorites, notes, submissions)
- Application-specific data

### Session Strategy

**Token Types:**

- **Access Token:** Short-lived (1 hour), validates on each request
- **Refresh Token:** Long-lived (7 days), refreshes access token when expired

**Cookies:**

- `workos_access_token` - httpOnly, secure, sameSite=lax, 1 hour expiry
- `workos_refresh_token` - httpOnly, secure, sameSite=lax, 7 days expiry

---

## Files Modified

### Created Files

1. **`/src/lib/server/workos.ts`**
   - Core WorkOS client initialization
   - Authentication wrapper methods (signUp, signIn, verifySession, etc.)

### Modified Files

1. **`/src/hooks.server.ts`**
   - Session validation middleware
   - Token refresh logic
   - User data mapping

2. **`/src/routes/signup/+page.server.ts`**
   - User registration with WorkOS
   - Local role creation

3. **`/src/routes/login/+page.server.ts`**
   - User authentication
   - Session cookie management

4. **`/src/routes/logout/+server.ts`**
   - Session termination
   - Cookie cleanup

5. **`/src/routes/profile/+page.server.ts`**
   - Password change with two-step verification

6. **`.env.example`**
   - Updated with WorkOS variables

7. **`package.json`**
   - Added: `@workos-inc/node`
   - Removed: `@auth/core`

### Deleted Files

1. **`/src/lib/server/auth.ts`**
   - Old Stack Auth wrapper (replaced by workos.ts)

### Unchanged Files (No Modifications Needed)

- `/src/lib/auth/middleware.ts` - Uses event.locals.user
- `/src/lib/auth/index.ts` - Local DB role management
- `/src/lib/db/schemas/user-roles.ts` - Schema compatible
- `/src/app.d.ts` - Type definitions compatible
- All protected API routes - Middleware handles auth
- All admin routes - Role system unchanged

---

## Implementation Details

### 1. WorkOS Client (`/src/lib/server/workos.ts`)

The WorkOS client provides these authentication methods:

- **`signUp(email, password, firstName?, lastName?)`**  
  Creates a new user in WorkOS
- **`signIn(email, password)`**  
  Authenticates user, returns user object + access/refresh tokens
- **`verifySession(accessToken)`**  
  Validates access token, returns user data or null
- **`refreshSession(refreshToken)`**  
  Refreshes expired access token, returns new tokens
- **`updatePassword(userId, newPassword)`**  
  Updates user password (requires separate verification)
- **`signOut()`**  
  Logs out user (session cleanup via cookie deletion)

### 2. Session Middleware (`/src/hooks.server.ts`)

On every request:

1. Extract `workos_access_token` from cookies
2. Verify token with WorkOS API
3. If valid: set `event.locals.user` with user data
4. If expired: attempt refresh with `workos_refresh_token`
5. If refresh succeeds: update cookies and continue
6. If refresh fails: clear cookies and set user to null

User data structure in locals:

```typescript
event.locals.user = {
  id: workosUser.id, // WorkOS user ID (UUID)
  email: workosUser.email, // User email
  name: workosUser.firstName // Full name or email fallback
    ? `${workosUser.firstName} ${workosUser.lastName || ""}`.trim()
    : workosUser.email,
};
```

### 3. User Registration Flow

1. User submits signup form (name, email, password)
2. Parse name into firstName/lastName
3. Create user in WorkOS via `workosAuth.signUp()`
4. Add user as member to the organization
5. Authenticate user to get tokens
6. Create default role in local DB (`user`)
7. Set access and refresh token cookies
8. Redirect to home page

### 4. User Login Flow

1. User submits login form (email, password)
2. Authenticate with WorkOS via `workosAuth.signIn()`
3. Receive user object + access/refresh tokens
4. Set both token cookies
5. Redirect to home page

### 5. Password Change Flow

WorkOS doesn't verify old password during update, so we implement two-step verification:

1. User submits current password + new password
2. **Verify current password** by calling `workosAuth.signIn(email, currentPassword)`
3. If verification succeeds, **update password** via `workosAuth.updatePassword(userId, newPassword)`
4. Return success

This ensures users must know their current password to change it.

---

## Database Considerations

### No Schema Changes Required

The existing database schema is fully compatible:

- `user_roles.user_id` is UUID (matches WorkOS user IDs)
- All foreign keys use UUID references
- No user credentials stored locally

### User Synchronization

**On Signup:**

- Create user in WorkOS → get user ID
- Create default role in local `user_roles` table

**On Login:**

- Authenticate with WorkOS → get user data
- Verify role exists in local DB (auto-create if missing)

**On Each Request:**

- Validate token with WorkOS
- Set `event.locals.user` for route handlers
- Local DB queries use `event.locals.userId`

---

## Security Features

### Cookie Security

- **httpOnly:** Prevents JavaScript access (XSS protection)
- **secure:** HTTPS only in production
- **sameSite: 'lax':** CSRF protection
- **Separate expiration:** Access token (1h) vs refresh token (7d)

### Password Security

- WorkOS enforces strong password policies by default
- Old password verification required before updates
- Passwords never stored locally

### Session Security

- Short-lived access tokens (1 hour)
- Automatic refresh with long-lived refresh tokens
- Session validation on every request

---

## Testing Checklist

### Manual Testing

- [ ] Sign up new user
  - Verify user appears in WorkOS dashboard
  - Verify role created in local database
  - Verify cookies set in browser
- [ ] Login with new user
  - Verify access and refresh token cookies
  - Verify redirect to home page
  - Verify session persists across page loads
- [ ] Access protected route
  - Verify authenticated user can access
  - Verify session data in `event.locals.user`
- [ ] Create user data
  - Create favorite (verify user_id reference works)
  - Create private note (verify user_id reference works)
- [ ] Change password
  - Verify current password validation
  - Verify password update succeeds
  - Login with new password
- [ ] Access admin route as non-admin
  - Verify redirect to home/login
  - Verify role-based access control works
- [ ] Logout
  - Verify cookies deleted
  - Verify redirect to login page
  - Verify cannot access protected routes
- [ ] Session refresh
  - Delete access token cookie manually
  - Refresh page (should auto-refresh with refresh token)
  - Verify new access token set

### Database Verification

```sql
-- Verify user role created
SELECT * FROM user_roles WHERE user_id = '<workos-user-id>';

-- Verify user data references work
SELECT * FROM favorites WHERE user_id = '<workos-user-id>';
SELECT * FROM notes WHERE user_id = '<workos-user-id>';
```

### Code Quality Checks

```bash
# TypeScript validation
npm run check

# Linting
npm run lint

# Search for remaining Stack Auth references
grep -r "stackAuth" src/
grep -r "stack_access_token" src/
```

---

## Rollback Plan

If issues arise during migration:

1. **Restore files from git:**

   ```bash
   git checkout HEAD -- src/lib/server/auth.ts
   git checkout HEAD -- src/hooks.server.ts
   git checkout HEAD -- src/routes/login/
   git checkout HEAD -- src/routes/signup/
   git checkout HEAD -- src/routes/logout/
   git checkout HEAD -- src/routes/profile/
   ```

2. **Reinstall Stack Auth dependencies:**

   ```bash
   npm install @auth/core
   ```

3. **Restore environment variables:**
   - Add back Stack Auth variables to `.env`

4. **Restart dev server:**
   ```bash
   npm run dev
   ```

**No data loss risk** - Local database unchanged during migration.

---

## Post-Migration Enhancements

Consider implementing these features later:

### Password Reset

```typescript
await workos.userManagement.sendPasswordResetEmail({ email });
```

### Email Verification

Enable in WorkOS dashboard, handle verification callback

### Social Login (OAuth)

Add Google, Microsoft, GitHub providers

### Multi-Factor Authentication (MFA)

Enable in WorkOS dashboard, add MFA enrollment flow

### Session Management UI

- View active sessions
- Revoke sessions remotely
- Show last login time/location

---

## Support & Resources

### WorkOS Documentation

- [User Management Overview](https://workos.com/docs/user-management)
- [Node.js SDK](https://workos.com/docs/sdks/node)
- [Email + Password Auth](https://workos.com/docs/user-management/email-password)
- [Session Management](https://workos.com/docs/user-management/sessions)

### WorkOS Dashboard

- [Dashboard Login](https://dashboard.workos.com)
- View users, sessions, and activity logs

### Troubleshooting

**Issue: "WorkOS environment variables not set"**

- Verify `.env` has all three required variables
- Restart dev server after adding variables

**Issue: "Session verification failed"**

- Check access token in browser cookies
- Verify API key is correct in WorkOS dashboard
- Check WorkOS dashboard for error logs

**Issue: "User not found in local database"**

- Verify role synchronization in `hooks.server.ts`
- Check `user_roles` table for missing entries

---

## Migration Completion

Migration completed on: December 22, 2024

**Verified:**

- ✓ Dependencies installed
- ✓ Environment variables configured
- ✓ All authentication routes updated
- ✓ Session middleware updated
- ✓ Type checking passes
- ✓ All tests passing

**Next Steps:**

1. Test all authentication flows in development
2. Create admin user for production
3. Deploy to production with WorkOS production keys
4. Monitor WorkOS dashboard for user activity
