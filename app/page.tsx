import FileUploader from "@/components/fileUploader";

export default function DashboardPage() {
  return (
    <div className="flex flex-1">
      <main className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <p>Hello World</p>
        <FileUploader />
      </main>
    </div>
  );
}
