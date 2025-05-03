type SpinnerProps = {
    message?: string;
  };
  
  export default function Spinner({ message }: SpinnerProps) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-4">
        <div className="w-6 h-6 border-2 border-primary-2 border-t-transparent rounded-full animate-spin" />
        {message && <p className="text-sm text-gray-600">{message}</p>}
      </div>
    );
  }
  