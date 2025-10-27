function Home() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Welcome to Your Full Stack App
      </h1>
      <p className="text-gray-600 mb-4">
        This is a template for building full stack applications with:
      </p>
      <ul className="list-disc list-inside space-y-2 text-gray-700">
        <li>React + TypeScript + Vite (Frontend)</li>
        <li>Express + TypeScript (Backend)</li>
        <li>Sequelize + MySQL (Database)</li>
        <li>React Router (Routing)</li>
        <li>Tailwind CSS (Styling)</li>
      </ul>
      <div className="mt-6">
        <p className="text-sm text-gray-500">
          Navigate to the Users page to see the database integration in action.
        </p>
      </div>
    </div>
  );
}

export default Home;
