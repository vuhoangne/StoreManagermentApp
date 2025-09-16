# Store Management App

A Next.js application for managing store information with features for creating, viewing, editing and listing stores.

## Features

- Store listing with search functionality
- Store details view with location information
- Create and edit store forms with validation
- Image upload support
- Responsive design with mobile support
- Dark/Light theme support

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Redux](https://redux.js.org/) - State management
- [Lucide Icons](https://lucide.dev/) - Icons

## Getting Started

1. Install dependencies:

```bash
pnpm install
```

2. Run the development server:

```bash
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Project Structure

```
app/               # Next.js app directory
  layout.tsx      # Root layout
  page.tsx        # Home page
components/       # React components
  ui/            # Reusable UI components
  store-*.tsx    # Store related components
hooks/           # Custom React hooks
lib/             # Utilities and store
public/          # Static assets
styles/          # Global styles
```

## Development

The application uses the Next.js App Router and follows React server components conventions. UI components are built using shadcn/ui with Tailwind CSS for styling.

Store management features are implemented using Redux for state management with async thunks for API calls.
