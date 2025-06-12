export const dynamic = "force-static";

import FileUploader from "@/components/file-uploader";

export default function DashboardPage() {
  return (
    <main className="flex min-h-[99.8vh] h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
      <h1 className="text-4xl font-bold">Dashboard</h1>
      <p>Hello World</p>
      <FileUploader />
    </main>
  );
}
