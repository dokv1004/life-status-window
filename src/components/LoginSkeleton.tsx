import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function LoginSkeleton() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen md:min-h-[calc(100vh-4rem)] p-4 pb-20 md:pb-4 bg-gray-50/50">
      <div className="w-full max-w-md mb-4">
        <Link
          href="/"
          className="text-sm text-gray-500 hover:text-blue-600 flex items-center gap-1 transition-colors"
        >
          <ArrowLeft size={16} />
          메인으로 돌아가기
        </Link>
      </div>

      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden">
        <div className="p-8 space-y-4 flex flex-col items-center">
          <div className="h-8 w-40 bg-gray-100 rounded animate-pulse" />
          <div className="h-4 w-64 bg-gray-100 rounded animate-pulse" />
          <div className="h-4 w-48 bg-gray-100 rounded animate-pulse" />
        </div>
        <div className="px-8 pb-8">
          <div className="h-12 w-full bg-gray-100 rounded-lg animate-pulse" />
        </div>
      </div>

      <div className="mt-6 h-3 w-56 bg-gray-100 rounded animate-pulse" />
    </main>
  );
}
