import { useState } from 'react';
import NewQuizModal from './NewQuizModal';
import Button from '../../../shared/components/Button';

export default function NewQuizCard() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-lg p-6 shadow-md text-center">
        <h2 className="text-lg font-medium text-text mb-4">Start a New Quiz</h2>
        <Button variant="primary" className="text-4xl" onClick={() => setOpen(true)}>Start New Quiz</Button>
      </div>

      {open && <NewQuizModal onClose={() => setOpen(false)} />}
    </>
  );
}
