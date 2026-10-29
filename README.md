# CareerSaathi

> An AI-powered career management platform that helps students identify skill gaps, follow personalized technical roadmaps, complete assessments, and track their career progress.

CareerSaathi is a full-stack platform built to help students move from career confusion to structured and measurable career preparation.

It brings career planning, skill-gap analysis, personalized technical roadmaps, resume analysis, assessments, missions, progress tracking, and career-readiness workflows into a single platform.

---

## Overview

Students often struggle with questions such as:

- What should I learn for my target role?
- Which skills am I missing?
- What should I work on today?
- Is my current preparation actually improving?
- What projects should I build?
- Am I ready for interviews?

CareerSaathi is designed to address these problems through a personalized career workspace.

The platform uses the student's career goals, current skills, required skills, available study time, and other career information to build a structured preparation journey.

---

## Core Features

### Authentication & User Management

- User registration and login
- Protected application routes
- Authentication and authorization
- Secure password handling
- Token-based authentication
- User profile management

---

### Career Journey

CareerSaathi allows users to define and manage their career direction.

Users can provide information such as:

- Target role
- Target domain
- Graduation information
- Career preferences
- Current technical skills
- Skill levels
- Available study time
- Target timeline

This information becomes the foundation for personalization throughout the platform.

---

### Skill Gap Analysis

CareerSaathi compares the user's current skills with the skills required for their target career path.

The platform maintains information about:

- Current skills
- Skill proficiency
- Required skills
- Skill progress
- Career-specific requirements

This helps identify the areas where the user needs improvement.

---

### AI-Powered Roadmap Generation

CareerSaathi uses AI to generate personalized technical learning roadmaps.

The roadmap generation process considers:

- Target role
- Target domain
- Current skills
- Current skill levels
- Required skills
- Available technical skills
- Target duration
- Daily study hours

The generated roadmap can contain:

- Technical learning topics
- Practical projects
- Portfolio-related work

The AI output is processed by the backend before becoming part of the user's career journey.

---

### Roadmaps

Users receive a structured technical roadmap based on their career goals and skill gaps.

Roadmap items can represent:

- Technical topics
- Practical projects
- Portfolio work

Roadmaps are ordered according to learning dependencies and the user's current level.

---

### Missions & Learning Progress

CareerSaathi provides structured learning activities around the user's career roadmap.

The platform supports:

- Daily learning workflows
- Mission tracking
- Skill progress
- Completion tracking
- Career progress monitoring

---

### Assessments

The assessment system allows users to evaluate their technical knowledge and progress.

Assessment workflows are integrated into the broader career journey so that learning and evaluation are connected.

---

### Progress Tracking

CareerSaathi provides users with visibility into their career preparation progress.

The platform tracks areas such as:

- Skill progress
- Learning activity
- Mission completion
- Assessment performance
- Career journey progress
  
---

## System Architecture

CareerSaathi follows a modular full-stack architecture.

career-saathi/
├── .github/
│   └── workflows/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── core/
│   │   ├── master-data/
│   │   ├── modules/
│   │   ├── routes/
│   │   ├── shared/
│   │   └── types/
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── features/
│   │   ├── layouts/
│   │   ├── routes/
│   │   └── shared/
│   └── package.json
└── README.md

## Deployment

CareerSaathi uses containerization and automated deployment workflows.
The backend is containerized using Docker.
The project also uses GitHub Actions for automated backend deployment to AWS infrastructure.

## Security

Security-related practices implemented in the application include:

- JWT-based authentication
- Password hashing using bcrypt
- Protected routes
- Request validation
- HTTP security headers using Helmet
- CORS configuration
- Environment-based configuration
- Separation of secrets from application code

## Local Development
Prerequisites

Make sure the following are installed:

Node.js
npm
MongoDB
Git
Docker (optional)

1. Clone the Repository
  git clone <your-repository-url>
  cd career-saathi

 2. Backend Setup
    cd backend
    npm install

3. Create a local environment file:
   .env
   Configure the required backend environment variables.
   
   Then start the development server:
   npm run dev

4. Frontend Setup

  Open another terminal:

  cd frontend

  npm install

  Create the frontend environment file:

  .env

  Configure the API base URL and other required frontend environment variables.

  Then start the development server:

  npm run dev
