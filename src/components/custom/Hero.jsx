import React from 'react';
import {Link} from 'react-router-dom';
import { Button } from '../ui/button';

function Hero() {
  return (
    <div className='flex flex-col items-center mx-56 gap-6'> 
      <h1 className='font-extrabold text-[50px] text-center mt-16'>
        <span className='text-[#f56551]'>Discover Your Next Adventure with AI:</span>
        <br />
        <span className=' mt-4 block'>
        Personalised Itineraries at Your Fingertips
        </span>
      </h1>
      <p className='text-xl text-gray-500 text-center'>
        Your personal trip planner and travel curator, creating custom itineraries
      </p>
      <Link to={'/create-trip'}>
      <Button>
        Get Started, It'Free
      </Button>
      </Link>
    </div>
  );
}

export default Hero;