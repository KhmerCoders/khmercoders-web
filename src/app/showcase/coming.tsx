export function ShowcaseUpcoming() {
  return (
    <div className="py-8 px-4 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-3">Showcase Coming Soon</h1>
        <p className="text-gray-600">
          {`We're working on something amazing. Launching at the end of Q3!`}
        </p>
      </div>

      <div className="relative overflow-hidden">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Project</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Author</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Category</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map(item => (
              <tr key={item} className="border-t border-gray-200">
                <td className="py-3 px-4 text-sm">Project {item}</td>
                <td className="py-3 px-4 text-sm">Developer {item}</td>
                <td className="py-3 px-4 text-sm">
                  {['Web', 'Mobile', 'AI', 'Blockchain', 'IoT'][item - 1]}
                </td>
                <td className="py-3 px-4 text-sm">
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                    Coming soon
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
      </div>

      <div className="text-center mt-8">
        <button className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors cursor-not-allowed">
          Unlock Access (Coming End of Q3)
        </button>
      </div>
    </div>
  );
}
