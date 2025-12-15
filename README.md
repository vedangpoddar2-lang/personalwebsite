# 🎨 Personal Website

A modern, pastel-themed personal portfolio website built with **Next.js 15**, **React 19**, and **Sanity.io**. Designed to be minimal, responsive, and easily manageable via a headless CMS.

## ✨ Features

-   **Dynamic Content**: All content (Profile, Work, Education, Projects, Reading List) is managed via Sanity CMS.
-   **Responsive Design**: Fully responsive layout that looks great on mobile and desktop.
-   **Modern Tech Stack**: Built with the latest Next.js App Router and React Server Components.
-   **Pastel Aesthetic**: A soothing, curated color palette with smooth transitions.
-   **Interactive Elements**: Includes a photo carousel, project timeline, and media gallery.

## 🛠️ Tech Stack

-   **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **CMS**: [Sanity.io](https://www.sanity.io/)
-   **Styling**: CSS Modules with custom variables
-   **Deployment**: [Vercel](https://vercel.com/)

## 🚀 Getting Started

### Prerequisites

-   Node.js 18+ installed
-   npm or yarn

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/vedangpoddar2-lang/personalwebsite.git
    cd personalwebsite
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Setup**:
    Create a `.env.local` file in the root directory and add your Sanity credentials:
    ```env
    NEXT_PUBLIC_SANITY_PROJECT_ID=ydxdhl76
    NEXT_PUBLIC_SANITY_DATASET=production
    NEXT_PUBLIC_SANITY_API_VERSION=2024-12-15
    ```

4.  **Run Locally**:
    ```bash
    npm run dev
    ```
    - Website: [http://localhost:3000](http://localhost:3000)
    - Studio: [http://localhost:3000/studio](http://localhost:3000/studio)

## 📝 Managing Content

This project uses **Sanity Studio** embedded at `/studio`. You can log in there to:

-   **Profile**: Update bio, location, and social links.
-   **Work Experience**: Add your professional history.
-   **Projects**: Showcase your work with images and PDFs.
-   **Reading List**: Share articles and videos you find interesting.

## ☁️ Deployment

The easiest way to deploy is using **Vercel**:

1.  Push your code to GitHub.
2.  Import the project into Vercel.
3.  Add the environment variables (`NEXT_PUBLIC_SANITY_PROJECT_ID`, etc.) in the Vercel dashboard.
4.  Deploy!
