# Digital Dictionary Client
A web application for creating and managing personal dictionaries, word categories, and interactive quizzes to enhance language learning.

## Features
- **User Authentication**: Secure login and registration system
- **Dashboard**: Overview of your learning progress and recent activities
- **Dictionary Management**: Create and manage multiple dictionaries
- **Word Management**: Add, edit, and organize words within dictionaries
- **Word Categories**: Categorize words for better organization
- **Quiz System**: Test your knowledge with customizable quizzes
- **Quiz Results**: Review your performance after completing quizzes
- **User Profile**: Manage your account settings and preferences

## Tech Stack
- **React**: Frontend library for building the user interface
- **TypeScript**: Type-safe JavaScript for better development experience
- **React Router**: For navigation and routing within the application
- **Tailwind CSS**: Utility-first CSS framework for styling components

## Project Strcuture
The application follows a feature-based architecture:
- `src/features/`: Contains feature-specific components and logic
    - `auth/`": Authentication-related components and logic
    - `dashboard/`: Dashboard-related components and logic
    - `dictionaries/`: Dictionary-related components and logic
    - `words/`: Word-related components and logic
    - `wordCategories/`: Word category-related components and logic
    - `quizzes/`: Quiz-related components and logic
    - `profile/`: User profile-related components and logic
- `src/shared/`: Shared components and utilities
    - `components/`: Reusable UI components

## Getting Started
### Prerequisites
- Node.js (v14 or later recommended)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/denkxi/digital-dictionary-client.git
   ```
2. Navigate to the project directory:
   ```bash
   cd digital-dictionary-client
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
The application should now be running at `http://localhost:5173`.

## Usage
1. Sign up or log in to your account.
2. Explore the dashboard to view your learning progress and recent activities.
3. Create dictionaries, add words, and categorize them.
4. Take quizzes to test your knowledge and review your results.

