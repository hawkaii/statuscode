# 🔥 Firebase Neo-Brutalist Authentication

A modern, bold authentication system using Firebase Auth with neo-brutalist design principles.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install firebase
```

### 2. Environment Setup

Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=enter-your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN= enter-your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID= enter-your-project-id
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID= enter-your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID= enter-your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID= enter-your-measurement-id
```

### 3. Firebase Console Setup

1. **Enable Authentication Methods**:
   - Email/Password ✅
   - Phone ✅
   - Google ✅
   - GitHub ✅

2. **Configure OAuth Providers**:
   - Add your domain to authorized domains
   - Set up OAuth redirect URIs

### 4. Start Development Server

```bash
npm run dev
```

### 5. Access Authentication

- **Sign In Page**: `http://localhost:3000/signin`
- **Dashboard**: `http://localhost:3000/dashboard` (protected route)

## 🎨 Features

### Neo-Brutalist Design
- ✅ Bold black borders (4px thick)
- ✅ Dramatic drop shadows (8px+ offset)
- ✅ High contrast color scheme
- ✅ Uppercase typography with wide tracking
- ✅ Sharp rectangular elements (no border-radius)
- ✅ Hover animations with shadow effects

### Authentication Methods
- ✅ **Email & Password** authentication
- ✅ **Phone Number** authentication with SMS verification
- ✅ **Google** social authentication
- ✅ **GitHub** social authentication
- ✅ Sign up / Sign in toggle
- ✅ Form validation with error handling
- ✅ Loading states and animations
- ✅ Responsive mobile design

### Security Features
- ✅ Firebase Auth security rules
- ✅ Phone verification with reCAPTCHA
- ✅ Email verification support
- ✅ Session persistence
- ✅ Protected routes

## 📂 File Structure

```
components/
├── signin-form.tsx          # Main auth component with all methods
└── ui/
    ├── button.tsx          # Neo-brutalist button
    ├── input.tsx           # Neo-brutalist input
    └── label.tsx           # Neo-brutalist label

app/
├── signin/
│   └── page.tsx           # Sign in page
└── dashboard/
    └── page.tsx           # Protected dashboard

lib/
├── auth.ts                # Firebase config
├── auth-client.ts         # Firebase auth functions
└── hooks/
    └── use-auth.ts        # Custom auth hook

.env.local                 # Environment variables
```

## 🎯 Authentication Methods

### 1. Email/Password Authentication

```tsx
const { signIn, signUp } = useAuth();

// Sign Up
const result = await signUp(email, password, displayName);

// Sign In
const result = await signIn(email, password);
```

### 2. Phone Authentication

```tsx
const { signInWithPhone } = useAuth();

// Send verification code
const result = await signInWithPhone(phoneNumber, recaptchaVerifier);

// Verify code (handled automatically in component)
```

### 3. Social Authentication

```tsx
const { signInWithGoogle, signInWithGithub } = useAuth();

// Google Sign In
const result = await signInWithGoogle();

// GitHub Sign In
const result = await signInWithGithub();
```

## 🎨 Component Usage

### Basic Authentication Form

```tsx
import { SignInForm } from '@/components/signin-form';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <SignInForm />
    </div>
  );
}
```

### Using the Auth Hook

```tsx
import { useAuth } from '@/lib/hooks/use-auth';

export default function MyComponent() {
  const { user, isAuthenticated, signOut } = useAuth();

  if (!isAuthenticated) {
    return <div>Please sign in</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.displayName || user.email}!</h1>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

### Protected Routes

```tsx
import { useAuth } from '@/lib/hooks/use-auth';
import { redirect } from 'next/navigation';

export default function ProtectedPage() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  
  if (!isAuthenticated) {
    redirect('/signin');
  }

  return <div>Protected content</div>;
}
```

## 🔧 Firebase Configuration

### Authentication Methods Setup

1. **Email/Password**:
   ```
   Firebase Console → Authentication → Sign-in method → Email/Password → Enable
   ```

2. **Phone**:
   ```
   Firebase Console → Authentication → Sign-in method → Phone → Enable
   Add test phone numbers for development
   ```

3. **Google**:
   ```
   Firebase Console → Authentication → Sign-in method → Google → Enable
   Add authorized domains: localhost, your-domain.com
   ```

4. **GitHub**:
   ```
   Firebase Console → Authentication → Sign-in method → GitHub → Enable
   GitHub OAuth App → Set Authorization callback URL
   ```

### Security Rules

```javascript
// Firestore Security Rules (if using Firestore)
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 📱 UI Components

### Auth Method Toggle
- **Email Tab**: Traditional email/password authentication
- **Phone Tab**: Phone number with SMS verification

### Social Authentication Row
- **Google Button**: OAuth with Google
- **GitHub Button**: OAuth with GitHub
- **Single Row Layout**: Both buttons side by side

### Form States
- **Loading**: Animated spinners and disabled states
- **Error**: Red error messages with context
- **Success**: Green success notifications
- **Verification**: Phone code input for SMS verification

## 🎯 Phone Authentication Flow

1. **Enter Phone Number**: With country code (+1234567890)
2. **reCAPTCHA Verification**: Invisible reCAPTCHA challenge
3. **SMS Code Sent**: 6-digit verification code
4. **Code Input**: User enters verification code
5. **Authentication**: Complete phone sign-in

## 🔐 Security Best Practices

### Environment Variables
- Never commit Firebase config to public repos
- Use environment variables for all sensitive data
- Different configs for development/production

### Authentication Rules
- Enable email verification in production
- Set up proper OAuth redirect URIs
- Use Firebase Security Rules for database access
- Implement proper session management

### Phone Authentication
- Enable reCAPTCHA for phone auth
- Set up test phone numbers for development
- Implement rate limiting for SMS sends

## 🎨 Design System

### Colors
- **Primary**: `#4c1d95` (Deep Purple)
- **Secondary**: `#00ff00` (Bright Green)  
- **Accent**: `#ffff00` (Bright Yellow)
- **Base**: Black/White high contrast

### Typography
- **Font**: Space Grotesk (primary), JetBrains Mono (monospace)
- **Style**: Bold, uppercase, wide letter-spacing
- **Shadows**: Black text shadows for depth

### Interactive Elements
- **Hover Effects**: Elements "lift" with shadow changes
- **Loading States**: Animated spinners
- **Form Validation**: Real-time error feedback
- **Social Buttons**: Icon + text layout

## 🚀 Production Deployment

### Environment Setup
```env
# Production Firebase Config
NEXT_PUBLIC_FIREBASE_API_KEY=your-production-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-domain.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
# ... other config
```

### Firebase Console Settings
1. **Authorized Domains**: Add your production domain
2. **OAuth Redirect URIs**: Update for production URLs
3. **Email Verification**: Enable for production
4. **Security Rules**: Tighten for production use

### Security Checklist
- ✅ Environment variables secured
- ✅ OAuth providers configured
- ✅ Email verification enabled
- ✅ Proper error handling
- ✅ Rate limiting configured
- ✅ HTTPS enforced

## 🤝 Contributing

The neo-brutalist design system follows these principles:

1. **Bold & Unapologetic**: No subtle design elements
2. **High Contrast**: Black/white with bold accent colors
3. **Sharp Edges**: No rounded corners or soft shadows
4. **Functional First**: Form follows function with dramatic flair
5. **Accessible**: High contrast ensures readability

---

Built with 🔥 using Firebase Auth and Neo-Brutalist design principles.