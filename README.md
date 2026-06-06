# Notice Board App

A full-stack Notice Board application built using **Next.js, Prisma, and PostgreSQL**.  
It allows users to create, read, update, and delete notices with categories, priority, and date management.

##  How to Run Locally
### Clone repository
git clone https://github.com/AnkitaO7/notice-board.git
### Go to project folder
cd notice-board
### Install dependencies
npm install
### Generate Prisma client
npx prisma generate
### Run development server
npm run dev

Open in browser: http://localhost:3000

## Features
Add new notices  
Edit existing notices  
Delete notices  
Priority system (Urgent / Normal)  
Category support (General, Event, Exam)  
Date selection with validation  
Sorted notice display (Priority + Latest first)  
Fully responsive UI  

## Tech Stack
Next.js (Pages Router)  
React.js  
Prisma ORM  
PostgreSQL  
Tailwind CSS  
Vercel (Deployment)

## One Improvement I Would Make With More Time
If I had more time, I would improve:  
Add authentication (Login/Signup)  
Role-based access (Admin/User)  
Better UI using modals instead of alerts/confirms  
Search and filter functionality  
Improved date validation and timezone handling  

## How AI Was Used
AI tool was used as a development assistant for:  
-Debugging Prisma and Vercel deployment issues  
-Fixing API and validation logic  
-Solving date formatting problems  
-Helping structure frontend and backend logic  
-Understanding errors during development  
AI was used for guidance and support, while the final implementation, testing, and integration were done manually.

## Deployment
Deployed on Vercel:  
[https://notice-board-ruddy.vercel.app](https://notice-board-ruddy.vercel.app)

## Author
Ankita Pandey
