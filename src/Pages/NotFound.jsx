import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-[70vh] lg:min-h-[82vh] flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-white px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">

        <h1 className="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">404</h1>
        <p className="mt-4 text-xl font-semibold text-blue-900">Page Not Found</p>

        <p className="mt-2 text-blue-700 leading-relaxed">
          The page you are looking for does not exist or may have been moved.
          Please verify the URL or return to the homepage.
        </p>

        <div className="mt-6">
          <Link to="/home" className="inline-block px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition-colors duration-300">
            Go to Home
          </Link>
        </div>
        <p className="mt-6 text-sm text-blue-500">Error code: 404</p>
      </div>
    </div>
  );
}

export default NotFound;
