export default function DashboardSkeleton() {
  return (
    <main className="min-h-screen md:min-h-[calc(100vh-4rem)] bg-linear-to-b from-white to-blue-50 py-6 md:py-8 px-4 pb-24 md:pb-8">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="h-9 w-32 bg-gray-200 rounded-lg mx-auto animate-pulse" />
          <div className="h-5 w-48 bg-gray-200 rounded mt-2 mx-auto animate-pulse" />
        </div>

        {/* 2열 그리드 */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* 왼쪽: 상태 패널 스켈레톤 */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            {/* 헤더: 닉네임 & 레벨 */}
            <div className="bg-linear-to-r from-blue-50 to-blue-100 p-6 border-b border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="h-7 w-32 bg-gray-200 rounded animate-pulse" />
                  <div className="flex items-center gap-2 mt-2">
                    <div className="h-5 w-12 bg-gray-200 rounded animate-pulse" />
                    <div className="h-6 w-8 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
                <div className="h-7 w-16 bg-gray-200 rounded-full animate-pulse" />
              </div>

              {/* EXP 바 */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <div className="h-3 w-8 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 animate-pulse" />
              </div>
            </div>

            {/* 레이더 차트 영역 */}
            <div className="p-6 bg-gray-50/50">
              <div className="h-64 w-full bg-gray-200 rounded-lg animate-pulse" />
            </div>

            {/* 스탯 리스트 */}
            <div className="p-6 space-y-3">
              <div className="h-4 w-16 bg-gray-200 rounded animate-pulse mb-4" />
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
                    <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="h-6 w-8 bg-gray-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>

          {/* 오른쪽: 수련 폼 스켈레톤 */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-linear-to-r from-blue-50 to-blue-100">
              <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-56 bg-gray-200 rounded mt-2 animate-pulse" />
            </div>

            <div className="p-6">
              <div className="w-full h-32 bg-gray-200 rounded-lg animate-pulse" />
              <div className="w-full h-12 bg-gray-200 rounded-lg mt-4 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
