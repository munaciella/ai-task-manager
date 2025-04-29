export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between py-14">

      <div className="mx-auto max-w-2xl text-center space-y-6 px-6 lg:px-8">
        <p
          role="alert"
          className="inline-block bg-red-100 dark:bg-red-900 px-4 py-2 rounded-md text-red-700 dark:text-red-300 font-medium text-md"
        >
          <span className="mr-1">⚠️</span>
          <strong>Demo Notice:</strong>{" "}
          <span className="font-light">
            This live demo is provided solely for testing and development
            purposes. Functionality may be limited, unstable, or subject to
            sudden service restrictions. Use at your own risk; production-grade
            reliability is not guaranteed.
          </span>
        </p>
      </div>

      <h1 className="text-4xl font-bold mt-10">AI Task Manager</h1>
    </main>
  );
}
