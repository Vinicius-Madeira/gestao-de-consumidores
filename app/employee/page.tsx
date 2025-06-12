export const dynamic = "force-static";

import EmployeeList from "./EmployeeList";

export default function CollaboratorPage() {
  return (
    <div className="flex flex-1">
      <main className="flex min-h-[99.8vh] h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
        <EmployeeList />
      </main>
    </div>
  );
}
