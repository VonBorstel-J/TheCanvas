import React from 'react';
import { Link } from 'react-router-dom';


export function HomePage() {
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className='text-4xl font-bold mb-4'>Welcome to TheCanvas</h1>
      <div className='flex items-center gap-x-4'>
        <Link to='/login' className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>Login</Link>
        <Link to='/signup' className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'>Sign Up</Link>
        <Link to='/discover' className='bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded'>Discover</Link>
      </div>
    </div>
  );
}