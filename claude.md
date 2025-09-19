# Claude Development Memory & Context

**Project:** ConvertCast - Enterprise Webinar Platform
**Last Session:** January 2025
**Current Status:** Phase 1 Complete, Ready for Phase 2

---

## 🎯 **QUICK CONTEXT FOR "CONTINUE" COMMAND**

### What We Just Completed
1. **Enhanced Supabase Schema** - Enterprise database with 12+ tables
2. **Authentication System** - Complete signup/login/onboarding flow
3. **Component Library** - 5 professional dashboard components
4. **Testing Infrastructure** - Jest + Playwright with 16 passing tests
5. **User Onboarding** - Multi-step wizard with personalization

### Current Issues to Fix FIRST
- **Broadcast icon error** in `src/components/dashboard/DashboardHeader.tsx:119` (replace with Video)
- **Port conflicts** from multiple background dev servers
- **Next.js cache issues** (.next directory conflicts)

### Next Major Task
**Start Phase 2: Event Management System** - Event creation wizard and dashboard pages

---

## 🛠 **DEVELOPMENT COMMANDS & SHORTCUTS**

### Essential Commands
```bash
# Start development (resolve port conflicts first)
npm run dev

# Run tests
npm run test              # Jest unit tests
npm run test:e2e         # Playwright E2E tests
npm run test:coverage    # Coverage report

# Database
npm run db:setup         # Supabase setup
npm run db:verify        # Verify connection
npm run db:migrate       # Run migrations

# Build & Deploy
npm run build
npm run type-check
npm run lint
```

### Quick Fixes
```bash
# Clear Next.js cache
rm -rf .next && npm run dev

# Kill all background processes
# (Use Task Manager on Windows to kill node processes)

# Install missing dependencies
npm install @radix-ui/react-select  # Already installed
```

---

## 📂 **PROJECT ARCHITECTURE**

### Current Tech Stack
- **Framework:** Next.js 15 with App Router
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Styling:** Tailwind CSS + Radix UI
- **Animation:** Framer Motion
- **Testing:** Jest + React Testing Library + Playwright
- **Language:** TypeScript

### Key Directories
```
src/
├── app/                 # Next.js App Router pages
│   ├── auth/           # Authentication pages
│   ├── onboarding/     # User onboarding wizard
│   └── dashboard/      # Dashboard pages
├── components/
│   ├── auth/           # Auth-related components
│   ├── dashboard/      # Dashboard component library ⭐
│   ├── onboarding/     # Onboarding wizard
│   └── ui/             # Base UI components
├── contexts/           # React contexts (AuthContext)
├── hooks/              # Custom hooks (useAuth)
├── lib/                # Utilities (Supabase client, utils)
└── __tests__/          # Test files
```

### Database Schema Highlights
- **12+ tables** including users, events, registrations, analytics
- **Row-level security** for multi-tenant architecture
- **Real-time subscriptions** for live features
- **Migration-based** versioning system

---

## 🎨 **DESIGN SYSTEM**

### Brand Colors (HSL)
```css
--primary: 262 80% 50%;        /* Purple #a855f7 */
--secondary: 217 91% 60%;      /* Blue #3b82f6 */
--gradient: from-purple-500 to-blue-500;
```

### Key UI Patterns
- **Purple-to-blue gradients** for primary actions
- **Slate-800/50 backgrounds** for cards
- **Framer Motion animations** for interactions
- **Mobile-first responsive** design

---

## 🔐 **AUTHENTICATION FLOW**

### User Journey
1. **Homepage** → "Start Free Trial" button
2. **Signup** (`/auth/signup`) → Collect user info
3. **Email Verification** (`/auth/verify-email`) → Branded waiting page
4. **Onboarding** (`/onboarding`) → 5-step personalization
5. **Dashboard** (`/dashboard`) → Main application

### Technical Implementation
- **AuthContext** manages global auth state
- **ProtectedRoute** wrapper for secure pages
- **Supabase Auth** handles backend authentication
- **JWT tokens** for session management

---

## 🧩 **COMPONENT LIBRARY STATUS**

### Dashboard Components (All Complete ✅)
```typescript
// Import pattern
import { StatsCard, QuickAction, EventCard } from '@/components/dashboard';

// Available components:
- StatsCard      // Animated statistics cards
- QuickAction    // Dashboard action buttons
- EventCard      // Event display with actions
- DataTable      // Sortable/filterable data tables
- NotificationToast  // Toast notification system
```

### Usage Examples
```typescript
<StatsCard
  title="Total Events"
  value="24"
  change="+12%"
  icon={Calendar}
  gradient="from-blue-500 to-cyan-500"
/>

<QuickAction
  title="Create New Event"
  description="Start a new webinar"
  href="/dashboard/events/create"
  icon={Plus}
/>
```

---

## 🧪 **TESTING SETUP**

### Current Test Coverage
- **16/16 tests passing** ✅
- **Component tests:** StatsCard, QuickAction, test utilities
- **E2E tests:** Authentication flow, dashboard navigation
- **Coverage goals:** 70% across all metrics

### Test Commands
```bash
npm run test           # Jest tests only
npm run test:e2e       # Playwright E2E tests
npm run test:coverage  # Coverage report
```

### Test Files
```
src/__tests__/
├── components/
│   ├── StatsCard.test.tsx     ✅
│   └── QuickAction.test.tsx   ✅
└── utils/
    └── test-utils.tsx         ✅ (Mock factories)

tests/e2e/
├── auth.spec.ts               ✅
└── dashboard.spec.ts          ✅
```

---

## 📋 **IMMEDIATE NEXT STEPS CHECKLIST**

### Fix Current Issues (Priority 1)
- [ ] Replace `Broadcast` with `Video` in DashboardHeader.tsx:119
- [ ] Kill background dev servers causing port conflicts
- [ ] Clear .next cache and restart dev server
- [ ] Test complete auth flow: signup → onboarding → dashboard

### Start Phase 2 Implementation (Priority 2)
- [ ] Create `/dashboard/events` page with DataTable
- [ ] Build event creation wizard (`/dashboard/events/create`)
- [ ] Implement event CRUD operations
- [ ] Add real-time features for live events

---

## 🔧 **COMMON ISSUES & SOLUTIONS**

### Port Conflicts
**Problem:** Multiple dev servers running
**Solution:** Kill all Node processes, clear .next, restart

### Icon Import Errors
**Problem:** Missing icons from lucide-react
**Solution:** Check available icons, use Video instead of Broadcast

### Auth Redirect Loops
**Problem:** ProtectedRoute causing infinite redirects
**Solution:** Check AuthContext loading states and middleware

### Component Import Errors
**Problem:** Cannot resolve @/components imports
**Solution:** Check tsconfig.json path mapping and file structure

---

## 💡 **DEVELOPMENT PATTERNS**

### Component Creation
1. Create component in appropriate directory
2. Export from index.tsx file
3. Write TypeScript interfaces
4. Add Jest unit tests
5. Update component library index

### Database Changes
1. Create migration file in supabase/migrations/
2. Update TypeScript types
3. Test locally with npm run db:migrate
4. Update component interfaces if needed

### New Page Creation
1. Create page.tsx in app/ directory
2. Wrap with ProtectedRoute if auth required
3. Use DashboardLayout for dashboard pages
4. Add navigation links in DashboardSidebar

---

## 🎯 **PHASE 2 ROADMAP PREVIEW**

### Event Management (Weeks 5-8)
- Event creation wizard (multi-step form)
- Event dashboard pages with CRUD operations
- Registration system and attendee management
- Public event landing pages

### Live Streaming (Weeks 9-12)
- Mux integration for streaming
- OBS setup and stream keys
- Real-time chat and engagement features
- Live analytics and monitoring

### Advanced Features (Weeks 13-16)
- Advanced analytics and reporting
- Email marketing integration
- Payment processing with Stripe
- Mobile apps and PWA features

---

## 📞 **REFERENCE LINKS**

### Documentation
- **Testing Guide:** See TESTING.md
- **Production Roadmap:** See PRODUCTION-ROADMAP.md
- **Database Schema:** See supabase/migrations/
- **Brand Guidelines:** See BRAND-GUIDELINES.md

### External Services
- **Supabase Dashboard:** [app.supabase.com](https://app.supabase.com)
- **Deployment:** Vercel (configured in package.json)
- **Design Reference:** mystic-lab.zip (analyzed and implemented)

---

## 🚀 **WHEN USER SAYS "CONTINUE"**

1. **First, check current server status** and fix any compilation errors
2. **Review CURRENT-TODO.md** for latest priorities
3. **Fix the Broadcast icon issue** as immediate priority
4. **Test the auth flow** end-to-end once server is stable
5. **Begin Phase 2: Event Management System** starting with events list page

**Key Context:** We've successfully completed a comprehensive Phase 1 including authentication, onboarding, dashboard components, and testing. Ready to move into event management and live streaming features.