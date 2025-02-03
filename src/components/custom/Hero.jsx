import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';

function Hero() {
  return (
    <div className='flex flex-col items-center mx-4 sm:mx-8 md:mx-16 lg:mx-32 xl:mx-56 gap-6'>
      <h1 className='font-extrabold text-[40px] sm:text-[50px] mt-16'>
        <span className='text-[#f56551]'>Discover Your Next Adventure with AI:</span>
        <br />
        <span className='mt-4 block'>
          Personalised Itineraries at Your Fingertips
        </span>
      </h1>
      <p className='text-lg sm:text-xl text-gray-500'>
        Your personal trip planner and travel curator, creating custom itineraries
      </p>
      <Link to={'/create-trip'}>
        <Button>
          Get Started, It's Free
        </Button>
      </Link>
    </div>
  );
}

export default Hero;