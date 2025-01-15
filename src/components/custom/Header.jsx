import React from 'react'
import { Button } from '../ui/button'
import { Bold } from 'lucide-react'

function Header() {
  return (
    <div className='p-3 shadow-sm flex items-center gap-2 px-5'>
    <img src="/logo.svg" alt="logo" />
    <h2 style={{ fontWeight: "bold", color: "#f56551", fontSize:"30px" }}>Wander<span className='text-[#000000]'>Mind</span></h2>
    <div className="ml-auto">
      <Button>Sign Up</Button>
    </div>
  </div>
  
  )
}

export default Header