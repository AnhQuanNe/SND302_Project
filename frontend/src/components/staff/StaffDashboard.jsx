import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-green-600 text-white p-5 shadow">
        <h1 className="text-3xl font-bold">
          Staff Dashboard
        </h1>
      </div>

      {/* Content */}
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">
          Queue Management
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <Link
            to="/staff/counter-management"
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg"
          >
            <h3 className="text-lg font-bold text-green-600">
              Counter Management
            </h3>

            <p className="mt-2 text-gray-600">
              Manage counter status and assignments.
            </p>
          </Link>

          <Link
            to="/staff/queue-processing"
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg"
          >
            <h3 className="text-lg font-bold text-blue-600">
              Queue Processing
            </h3>

            <p className="mt-2 text-gray-600">
              Call next customer and process queues.
            </p>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <div className="bg-white p-5 rounded-lg shadow">
            <h4 className="text-gray-500">Current Queue</h4>
            <p className="text-3xl font-bold text-blue-600">
              A001
            </p>
          </div>

          <div className="bg-white p-5 rounded-lg shadow">
            <h4 className="text-gray-500">Waiting</h4>
            <p className="text-3xl font-bold text-yellow-500">
              15
            </p>
          </div>

          <div className="bg-white p-5 rounded-lg shadow">
            <h4 className="text-gray-500">Completed Today</h4>
            <p className="text-3xl font-bold text-green-600">
              87
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;