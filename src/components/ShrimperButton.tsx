import React from 'react'

const ShrimperButton = ({
 title, icon, position, _handleClick, otherClasses
}: { title: string, icon: React.ReactNode, position: string, _handleClick?: () => void, otherClasses?: string }) => {
 return (

  // Button code
  <button 
    onClick={_handleClick}
    className={`inline-flex h-12 animate-shimmer items-center justify-center rounded-md border
   border-zinc-300 dark:border-slate-800 bg-[linear-gradient(110deg,#ffffff,45%,#f4f4f5,55%,#ffffff)] dark:bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%]
    px-6 font-medium text-zinc-700 dark:text-slate-400 hover:text-zinc-950 dark:hover:text-white transition-colors 
    overflow-hidden focus:outline-none gap-2 shadow-sm dark:shadow-none ${otherClasses}`} 
  >
   {position === 'left' && icon}
   {title}
   {position === 'right' && icon}
  </button>
 )
}

export default ShrimperButton
