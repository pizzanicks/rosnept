import React from 'react'

function Footer() {
  return (
    <footer className="w-full text-center text-xs lg:text-sm text-gray-500 pt-4 pb-2 border-t mt-8">
    © {new Date().getFullYear()} Rosnept. All rights reserved.
    </footer>
  )
}

export default Footer