TODO:
Quiz
- Complete quizzes by category?
- When creating quiz and wordCount is bigger than amount of word in the quiz - notify about that (not enough words in the quiz)
- Make other question types ("TranslationChoice", "TranslationInput", "UseExampleFill")
- Render right sentence for each question in the quiz and in the result page
- Go back to previous question?
- Quiz timer/duraion?
- Quiz difficulties?

Categories
- Add form validation with error messages
- Sort/filter/pagination
- Improve design and responsiveness

Dictionaries
- Add form validation with error messages
- More details on dictionary cards
- Improve design
- Quick button to start quiz

Words
- Add form validation with error messages
- Filtering, searching, pagination, sorting
- Improve design (responsive flex structure)

Dashboard
- User stats (word counts, learned %, etc.)
- Recent activity
- Dynamic content based on auth state

Profile
- User info
- Statistics

Other
- Reusable components (input, textarea, select, checkbox, modal, buttons, spinner, universal error, validation error)
- Add light transitions and animations
- Better loading spinners, empty states, and error pages


# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
