# Programming Club Application System

A web application for managing programming club applications at MPGI, built with Next.js and Supabase.

## Features

- Student application form
- Admin dashboard for application management
- Secure authentication
- Application status tracking
- CSV export functionality
- Search and filter capabilities

## Tech Stack

- Next.js 14
- TypeScript
- Supabase (PostgreSQL)
- Tailwind CSS
- Shadcn UI Components

## Getting Started

1. Clone the repository:
```bash
git clone <your-repo-url>
cd programming-club
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
Create a `.env.local` file with:
```
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:
```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard
│   ├── apply/             # Application form
│   └── page.tsx           # Home page
├── components/            # Reusable components
├── lib/                   # Utility functions and configurations
│   ├── supabase.ts       # Supabase client
│   └── types.ts          # TypeScript types
└── public/               # Static assets
```

## Database Schema

The application uses the following Supabase tables:

### core_applications
- id (uuid)
- created_at (timestamp)
- name (text)
- email (text)
- roll_number (text)
- skills (text)
- github_link (text)
- reason (text)
- role (text)
- status (text)
- notes (text)
- reviewed_by (text)
- reviewed_at (timestamp)

## Deployment

The application is configured for deployment on Render. See `render.yaml` for configuration details.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
