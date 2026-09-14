import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

function App() {
  return (
    <div className="p-5 font-sans">
      <h1 className="text-2xl font-bold mb-4">Scanner Design System</h1>
      <p className="text-base text-gray-600">
        Development server running. Use <code className="bg-gray-100 px-1 rounded">npm run storybook</code> for the component library.
      </p>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
