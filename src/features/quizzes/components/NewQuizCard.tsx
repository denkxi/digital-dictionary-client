import { useState } from 'react';
import NewQuizModal from './NewQuizModal';

export default function NewQuizCard() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-lg p-6 shadow-md text-center">
        <h2 className="text-lg font-medium text-text mb-4">Start a New Quiz</h2>
        <button
          onClick={() => setOpen(true)}
          className="bg-primary-2 hover:bg-primary-1 cursor-pointer px-6 py-3 rounded text-sm font-medium"
        >
          Start Quiz
        </button>
      </div>

      {open && <NewQuizModal onClose={() => setOpen(false)} />}
    </>
  );
}
