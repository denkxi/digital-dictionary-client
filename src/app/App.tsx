// src/App.tsx
import { useState } from 'react';
import reactLogo from '@/assets/react.svg';
import viteLogo from '/vite.svg';
import Sidebar from '../shared/components/Sidebar';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col min-h-screen">
      <Sidebar />
      <main className="flex-grow">
        <section className="text-center mt-10">
          <div>
            <a href="https://vite.dev" target="_blank">
              <img src={viteLogo} className="logo mx-auto" alt="Vite logo" />
            </a>
            <a href="https://react.dev" target="_blank">
              <img src={reactLogo} className="logo react mx-auto" alt="React logo" />
            </a>
          </div>
          <h1 className="text-xl mt-5">Vite + React</h1>
          <div className="card mx-auto mt-5">
            <button onClick={() => setCount(count => count + 1)} className='bg-firefly-2 text-white w-fit mx-4 my-4 p-4 rounded-xl cursor-pointer hover:opacity-70 transition-all duration-300'>
              count is {count}
            </button>
            <p>
              Edit <code>src/App.tsx</code> and save to test HMR updates
            </p>
          </div>
          <p className="mt-5">
            Click on the Vite and React logos to learn more
          </p>
        </section>
      </main>
      <footer className="bg-gray-800 text-white text-center p-4">
        © {new Date().getFullYear()} Digital Dictionary
      </footer>
    </div>
  );
}

export default App;
