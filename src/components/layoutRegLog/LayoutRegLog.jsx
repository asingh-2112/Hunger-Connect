import React from 'react'
import Footer from '../footer/Footer'

export default function LayoutRegLog({children}) {
  return (
    <div>
    <div className="content min-h-screen">
      {children}
    </div>
    <Footer/>
    </div>
  )
}
