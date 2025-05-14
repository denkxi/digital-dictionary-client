import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

export default function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="inline-flex items-center gap-2 text-base text-gray-700 hover:text-black font-semibold cursor-pointer mb-6 transition"
    >
      <FiArrowLeft className="text-xl" />
      <span>Back</span>
    </button>
  );
}
