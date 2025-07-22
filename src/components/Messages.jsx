import React from 'react'
import Message from './Message'
import useGetMessages from '../hooks/useGetMessages';
import { useSelector } from "react-redux";
import useGetRealTimeMessage from '../hooks/useGetRealTimeMessage';

const Messages = () => {
    useGetMessages();
    useGetRealTimeMessage();
    let { messages } = useSelector(store => store.message);
    // Defensive: ensure messages is always an array
    if (!Array.isArray(messages)) messages = [];
    return (
        <div className='px-4 flex-1 overflow-auto messages-container'>
            {
               messages.map((message) => {
                    return (
                        <Message key={message._id} message={message} />
                    )
                })
            }

        </div>


    )
}

export default Messages