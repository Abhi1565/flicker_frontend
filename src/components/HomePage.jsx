import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import MessageContainer from './MessageContainer'

const HomePage = () => {
  const { authUser } = useSelector(store => store.user);

  // Redirect to login if not authenticated
  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className='flex sm:h-[450px] md:h-[550px] rounded-lg bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-20'>
      <Sidebar/>
      <MessageContainer/>
    </div>
  )
}

export default HomePage