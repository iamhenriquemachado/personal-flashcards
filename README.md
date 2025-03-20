```markdown
# FlashCards Application

A modern, minimalistic flash card application for enhancing learning through spaced repetition. The application supports two main categories: General Knowledge and Coding.

## Features

- **Category-based Flash Cards**: Separate sections for General Knowledge and Coding
- **Interactive Card Interface**: Flip cards to reveal answers
- **Knowledge Level Tracking**: Rate how well you knew each card on a scale of 1-5
- **Progress Tracking**: Visual progress bar shows completion status
- **Create New Cards**: Add your own flash cards with questions, answers, and explanations
- **Code Snippet Support**: Special formatting for code snippets with syntax highlighting
- **Responsive Design**: Works well on mobile, tablet, and desktop
- **Dark Mode Support**: Toggle between light and dark themes
- **PostgreSQL Integration**: Ready to connect with a PostgreSQL database backend

## Tech Stack

- **Frontend**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Database**: PostgreSQL (backend integration)
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL database (for backend)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/flashcards.git
   cd flashcards
```

2. Install dependencies:

```shellscript
npm install
# or
yarn install
```


3. Create a `.env.local` file in the root directory with the following variables:

```plaintext
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```


4. Start the development server:

```shellscript
npm run dev
# or
yarn dev
```


5. Open [http://localhost:3000](http://localhost:3000) in your browser.


## Backend Integration

The application is designed to work with a PostgreSQL database backend. The frontend is already set up with API services that can connect to your backend.

### API Endpoints

The frontend expects the following API endpoints:

- `GET /api/flashcards?category={category}` - Get all flash cards for a category
- `POST /api/flashcards` - Create a new flash card
- `PATCH /api/flashcards/{id}` - Update a flash card
- `DELETE /api/flashcards/{id}` - Delete a flash card
- `POST /api/progress` - Save user progress for a flash card
- `GET /api/progress` - Get user progress for all flash cards


### Database Schema

Here's a suggested database schema for your PostgreSQL backend:

```sql
-- Flash Cards Table
CREATE TABLE flash_cards (
  id SERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  explanation TEXT,
  code TEXT,
  category VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User Progress Table
CREATE TABLE user_progress (
  id SERIAL PRIMARY KEY,
  user_id INTEGER, -- If you implement authentication
  flash_card_id INTEGER REFERENCES flash_cards(id) ON DELETE CASCADE,
  knowledge_level INTEGER NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_flash_cards_category ON flash_cards(category);
CREATE INDEX idx_user_progress_flash_card_id ON user_progress(flash_card_id);
```

## Customization

### Adding New Categories

To add new categories:

1. Update the `FlashCard` type in `lib/types.ts`
2. Add new category options in the create form
3. Create new mock data in `lib/data.ts`
4. Update the styling for the new category in `globals.css`


### Styling

The application uses Tailwind CSS for styling. The main color scheme is defined in `globals.css` under the `:root` and `.dark` selectors. You can customize the colors by modifying these CSS variables.

## Deployment

The application can be easily deployed to Vercel:

1. Push your code to a GitHub repository
2. Import the repository in Vercel
3. Set up the environment variables
4. Deploy


## License

This project is licensed under the MIT License - see the LICENSE file for details.

```plaintext

You can save this as `README.md` in the root of your project. It provides comprehensive documentation for your FlashCards application, including setup instructions, backend integration details, and customization options.
```