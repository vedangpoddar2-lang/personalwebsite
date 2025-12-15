# Personal Website

A minimal, pastel-themed personal website built with Next.js and Sanity.io.

## Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run Locally**:
    ```bash
    npm run dev
    ```
    - Website: [http://localhost:3000](http://localhost:3000)
    - Admin Dashboard: [http://localhost:3000/studio](http://localhost:3000/studio)

## Managing Content (Sanity Studio)

You don't need to edit code to update your site. Use the **Sanity Studio** at `/studio`.

- **Profile**: Update your landing page photos and bio.
- **Work Experience**: Add companies, roles, and descriptions.
- **Education**: Add degrees and institutes.
- **Reading List**: Add links to articles/videos you like.
- **Projects**: Upload PDFs/PPTs and describe your projects.

## Deployment

This site is ready for **Vercel**.

1.  Push this code to a GitHub repository.
2.  Import the repository in Vercel.
3.  Add the Environment Variables in Vercel Settings:
    - `NEXT_PUBLIC_SANITY_PROJECT_ID`: `ydxdhl76`
    - `NEXT_PUBLIC_SANITY_DATASET`: `production`
    - `NEXT_PUBLIC_SANITY_API_VERSION`: `2024-12-15`
4.  Deploy!
