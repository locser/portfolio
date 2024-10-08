
import React from 'react'

const LitUpBorder = ({
  title, icon, position, handleClick, otherClasses
}: { title: string, icon: React.ReactNode, position: string, handleClick?: () => void, otherClasses?: string }) => {
  return (
      <button className="p-[3px] relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg space-x-5" />
        <div className=" flex flex-row px-8 py-2 items-center justify-center bg-black rounded-[6px] relative group transition duration-200 text-white hover:bg-transparent ">
          {position === 'left' && icon}
          {title}
          <span className='mx-1'/>
          {position === 'right' && icon}
        </div>
      </button>
  )
}

export default LitUpBorder
