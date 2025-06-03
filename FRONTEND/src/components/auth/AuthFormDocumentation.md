# Auth Form Documentation

## Overview
The `AuthForm` component is a unified authentication form that handles both login and signup functionality with a clean, accessible UI. It features smooth transitions between modes, persistent form data, and comprehensive validation.

## Features

### Shared Features
- **Mode Toggling**: Smooth transition between login and signup modes while preserving form data
- **Real-time Validation**: Field-level validation with immediate feedback
- **Loading States**: Visual loading indicators during form submission
- **Accessibility**: ARIA attributes, keyboard navigation, and focus management
- **Responsive Design**: Mobile-first approach with adaptive layouts

### Login Mode
- **Email Field**: Floating label with real-time format validation
- **Password Field**: Show/hide toggle for visibility
- **Remember Me**: Persistent login option
- **Forgot Password**: Link for password recovery (visual only)

### Signup Mode
- **Username Field**: With availability checking and character limits
- **Email Field**: Same as login but with enhanced validation
- **Password Field**: With strength meter (4 levels) and requirements display
- **Terms & Conditions**: Required checkbox with link

## Component Architecture

### File Structure
```
/components/auth/
  ├── AuthForm.tsx         # Main component
  └── AuthForm.module.css  # Component-specific styles
/context/
  └── AuthContext.tsx      # Authentication state management
/services/
  └── authService.ts       # API interactions
/utils/
  └── validations.ts       # Form validation utilities
```

### State Management
- **Form State**: Managed with React Hook Form
- **Auth State**: Managed with Context API
- **UI State**: Local component state for visual elements

## Usage

```jsx
// As login form
<AuthForm initialMode="login" />

// As signup form
<AuthForm initialMode="signup" />
```

## Form Validation

### Email Validation
- Must be a valid email format
- Required field

### Password Validation
- Minimum 8 characters
- Must include uppercase, lowercase, number, and special character (for signup)
- Strength indicator based on complexity

### Username Validation
- 3-20 characters
- Only letters, numbers, and underscores
- Availability check (simulated)

## API Integration

The form connects to these endpoints:

### Login
- **Endpoint**: `http://localhost:5000/api/auth/login`
- **Method**: POST
- **Payload**: `{ email: string, password: string }`

### Register
- **Endpoint**: `http://localhost:5000/api/auth/register`
- **Method**: POST
- **Payload**: `{ username: string, email: string, password: string }`

## Authentication Flow

1. User submits credentials
2. Form data is validated client-side
3. If valid, API request is sent
4. Loading state is shown during request
5. On success: User is logged in and redirected to dashboard
6. On error: Error message is displayed

## CSS Implementation

- Uses CSS Modules for component-scoped styling
- 8px grid system for consistent spacing
- CSS variables for theming
- Responsive breakpoints for mobile, tablet, and desktop
- Subtle animations for enhanced UX

## Accessibility Features

- ARIA labels on all interactive elements
- Error states are properly announced
- Focus management during mode switching
- Keyboard navigation support
- Color contrast meets WCAG standards
- Skip link for keyboard users
