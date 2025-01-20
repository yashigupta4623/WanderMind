import React from 'react'
import { Button } from '../ui/button'
import { Bold } from 'lucide-react'

function Header() {
  return (
    <div className="p-3 shadow-sm flex items-center gap-2 px-5 flex-wrap sm:flex-nowrap">
  <img src="/logo.svg" alt="logo" className="w-8 h-8 sm:w-10 sm:h-10" />
  <h2
    className="font-bold text-[20px] sm:text-[25px] md:text-[30px]"
    style={{ color: "#f56551" }}
  >
    Wander<span className="text-[#000000]">Mind</span>
  </h2>
  <div className="ml-auto">
    <Button>Sign Up</Button>
  </div>
</div>

  )
}

export default Header