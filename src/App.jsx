import Signup from './components/Signup'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import HomePage from './components/HomePage'
import Login from './components/Login'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import io from "socket.io-client"
import { setSocket } from './redux/socketSlice'
import { setOnlineUsers } from './redux/userSlice'

const router = createBrowserRouter([
  {
    path:"/",
    element:<HomePage/>
  },
  {
    path:"/register",
    element:<Signup/>
  },
  {
    path:"/login",
    element:<Login/>
  }
])

function App() {
  const {authUser} = useSelector(store=>store.user);
  const {socket} = useSelector(store=>store.socket);
  const dispatch = useDispatch();

  useEffect(()=>{
    if(authUser){
     const socketio = io(import.meta.env.VITE_SOCKET_URL, {
        // withCredentials removed for open CORS
        query:{
          userId:authUser._id
        }
     });
     dispatch(setSocket(socketio));

     socketio?.on('getOnlineUsers', (onlineUsers)=>{
        dispatch(setOnlineUsers(onlineUsers));
     });
     return ()=> socketio.close();
    }else{
      if(socket){
        socket.close();
        dispatch(setSocket(null));
      }
    }
  },[authUser]);
  return (
      <div className='p-4 h-screen flex items-center justify-center'>
         <RouterProvider router={router}/>
       </div> 
  )
}

export default App
