interface PageLoadingProps {
  message?: string;
  variant?: 'default' | 'gray';
}

export default function PageLoading({
  message = 'Loading...',
  variant = 'default'
}: PageLoadingProps) {
  const bgClass = variant === 'gray'
    ? 'bg-gray-50/50'
    : 'bg-linear-to-b from-white to-blue-50';

  return (
    <main className={`min-h-screen md:min-h-[calc(100vh-4rem)] ${bgClass} flex items-center justify-center p-4 pb-20 md:pb-4`}>
      <div className="text-blue-600 text-xl animate-pulse">{message}</div>
    </main>
  );
}
