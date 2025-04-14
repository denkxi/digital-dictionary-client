import { useNavigate } from 'react-router-dom';

export default function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="text-sm text-primary-2 hover:text-primary-1 mb-4 inline-flex items-center gap-1"
    >
      ← Back
    </button>
  );
}
