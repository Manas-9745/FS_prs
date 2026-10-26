import React from 'react';

/**
 * Modal that shows the Docker commands needed to build, run, and stop the
 * Lost & Found application containers. The UI follows the same design language
 * as the rest of the app (glass‑morphism backdrop, rounded corners, subtle
 * shadow) to keep a premium look.
 */
export default function DockerInfoModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const commands = `docker compose build
docker compose up -d   # start containers in detached mode
# To stop and remove containers
docker compose down
# Follow logs
docker compose logs -f`;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="relative bg-white rounded-xl shadow-lg max-w-lg w-full p-6">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">Docker Containerization Commands</h2>
        <p className="mb-2 text-sm text-gray-700">
          Run these commands from the project root (<code>FS_prs</code>) after Docker Desktop is running.
        </p>
        <pre className="bg-gray-100 p-3 rounded overflow-x-auto text-sm whitespace-pre-wrap">
{commands}
        </pre>
        <p className="mt-4 text-xs text-gray-600">
          The first command builds the images, the second starts them, and the third shuts them down.
          Use <code>docker compose logs -f</code> to watch live logs.
        </p>
      </div>
    </div>
  );
}
