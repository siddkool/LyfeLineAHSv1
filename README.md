# LyfeLineAHSv1

A program I developed for my high school (Allen High School) to educate all 5000 students about vaping, its harmful side effects, and other dangers of nicotine. 
Worked with the principal and district coordinator to launch it full-time at the only high school in our city, allowing students of all ages to get real-time education on what these harmful substances can do to them.
Provides a gamified learning experience, as reading lessons and completing quizzes allows students to earn points which can be redeemed for MINGA points, used during priority for course scheduling, final exam exemptions, and much more!


## Core Technologies

### Frontend Framework

- **Next.js 15** (App Router) - React-based full-stack framework
- **React 19** - UI component library
- **TypeScript** - Type-safe JavaScript for better code quality


### Styling & UI

- **Tailwind CSS v4** - Utility-first CSS framework with custom design tokens
- **shadcn/ui** - Pre-built accessible React components (Button, Card, Dialog, Input, etc.)
- **Radix UI** - Headless UI primitives for accessibility
- **Lucide React** - Icon library


### State Management & Data Fetching

- **SWR** - React Hooks for data fetching, caching, and revalidation
- **React Hooks** (useState, useEffect, custom hooks)


## Backend & Database

### Database

- **Supabase (PostgreSQL)** - Cloud-hosted Postgres database

- Tables: `profiles`, `completed_lessons`, `quiz_scores`, `shop_purchases`
- Row Level Security (RLS) policies for data protection
- Database triggers for automatic profile creation





### Authentication

- **Supabase Auth** - Email/password authentication
- **@supabase/ssr** - Server-side rendering support for auth
- Session management with cookies
- Middleware for route protection


### API Routes

- **Next.js API Routes** (Route Handlers)

- `/api/purchase` - Handles point redemption and email receipts
- `/api/generate-quiz` - AI-powered quiz generation





## AI & Email Services

### AI Integration

- **Vercel AI SDK v5** - AI model integration
- **OpenAI GPT-4o-mini** - Generates unique quiz questions from lesson content
- Uses structured output with Zod schemas for validation


### Email Service

- **Resend** - Transactional email API
- HTML email templates for purchase receipts
- Sends confirmation emails when users redeem rewards

View the program:
[HERE](lyfelineahsprogram.vercel.app)

