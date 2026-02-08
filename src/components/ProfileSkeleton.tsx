export default function ProfileSkeleton() {
  return (
    <main className="min-h-screen md:min-h-[calc(100vh-4rem)] bg-linear-to-b from-white to-blue-50 py-6 md:py-8 px-4 pb-24 md:pb-8">
      <div className="max-w-lg mx-auto space-y-6">
        {/* 헤더 */}
        <div className="text-center">
          <div className="h-9 w-24 bg-gray-100 rounded-lg mx-auto animate-pulse" />
        </div>

        {/* 프로필 카드 */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
          <div className="flex items-center gap-4">
            {/* 프로필 사진 */}
            <div className="w-20 h-20 rounded-full bg-gray-100 animate-pulse" />

            {/* 닉네임 & 레벨 */}
            <div className="flex-1">
              <div className="h-6 w-32 bg-gray-100 rounded animate-pulse" />
              <div className="h-5 w-16 bg-gray-100 rounded mt-2 animate-pulse" />
            </div>
          </div>

          {/* 친구 코드 */}
          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <div className="h-4 w-20 bg-gray-100 rounded animate-pulse mb-2" />
            <div className="flex items-center justify-between">
              <div className="h-8 w-36 bg-gray-100 rounded animate-pulse" />
              <div className="w-10 h-10 bg-gray-100 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>

        {/* 친구 추가 */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
          <div className="h-5 w-24 bg-gray-100 rounded animate-pulse mb-4" />
          <div className="flex gap-2">
            <div className="flex-1 h-11 bg-gray-100 rounded-lg animate-pulse" />
            <div className="w-16 h-11 bg-gray-100 rounded-lg animate-pulse" />
          </div>
        </div>

        {/* 친구 목록 / 요청 탭 */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
          {/* 탭 헤더 */}
          <div className="flex border-b border-gray-100">
            <div className="flex-1 py-3 flex items-center justify-center gap-2">
              <div className="h-5 w-20 bg-gray-100 rounded animate-pulse" />
            </div>
            <div className="flex-1 py-3 flex items-center justify-center gap-2">
              <div className="h-5 w-12 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>

          {/* 탭 컨텐츠 */}
          <div className="p-4 min-h-70">
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                >
                  <div className="w-12 h-12 rounded-full bg-gray-100 animate-pulse" />
                  <div className="flex-1">
                    <div className="h-5 w-24 bg-gray-100 rounded animate-pulse" />
                    <div className="h-4 w-12 bg-gray-100 rounded mt-1 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 모바일 로그아웃 버튼 */}
        <div className="md:hidden h-12 bg-gray-100 rounded-xl animate-pulse" />
      </div>
    </main>
  );
}
