import React, { useEffect } from 'react'
import api from '../utils/axios';
import { useDispatch, useSelector } from 'react-redux';
import { setMessages } from '../redux/messageSlice';

const useGetMessages = () => {
  const {selectedUser, authUser} = useSelector(store=>store.user);
  const dispatch = useDispatch();
  useEffect(()=>{
    const fetchMessages = async() => {
        try {
            const res = await api.get(`/message/${selectedUser?._id}`);
            dispatch(setMessages(res.data));
        } catch (error) {
            console.log(error);
        }
    }
    
    // Only fetch messages if user is authenticated and has selected a user
    if (authUser && selectedUser) {
        fetchMessages();
    }
  },[selectedUser, authUser])
}

export default useGetMessages