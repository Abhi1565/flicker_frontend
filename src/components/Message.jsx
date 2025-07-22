import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { setMessages } from '../redux/messageSlice';
import api from '../utils/axios';
import toast from 'react-hot-toast';
import { IoEllipsisVertical } from "react-icons/io5";

const Message = ({message}) => {
    const scroll = useRef();
    const menuRef = useRef();
    const {authUser,selectedUser} = useSelector(store=>store.user);
    const {messages} = useSelector(store=>store.message);
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(()=>{
        scroll.current?.scrollIntoView({behavior:"smooth"});
    },[message]);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };

        if (showMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showMenu]);

    // Check if message is deleted for current user
    const isDeletedForMe = message?.deletedForMe?.some(deletion => deletion.userId === authUser?._id);
    
    // Check if message is deleted for everyone
    const isDeletedForEveryone = message?.deletedForEveryone;
    
    // Check if current user is the sender
    // Support both populated and unpopulated senderId
    const senderId = message?.senderId?._id || message?.senderId;
    const receiverId = message?.receiverId?._id || message?.receiverId;
    const isSender = senderId === authUser?._id;

    const handleDeleteForMe = async () => {
        if (isDeleting) return;
        
        setIsDeleting(true);
        try {
            await api.delete(`/message/delete-for-me/${message._id}`);
            
            // Remove message from local state
            const updatedMessages = messages.filter(msg => msg._id !== message._id);
            dispatch(setMessages(updatedMessages));
            
            toast.success("Message deleted for you");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete message");
        } finally {
            setIsDeleting(false);
            setShowMenu(false);
        }
    };

    const handleDeleteForEveryone = async () => {
        if (isDeleting) return;
        
        setIsDeleting(true);
        try {
            await api.delete(`/message/delete-for-everyone/${message._id}`);
            
            // Update message in local state
            const updatedMessages = messages.map(msg => 
                msg._id === message._id 
                    ? { ...msg, deletedForEveryone: true, message: "This message was deleted" }
                    : msg
            );
            dispatch(setMessages(updatedMessages));
            
            toast.success("Message deleted for everyone");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete message");
        } finally {
            setIsDeleting(false);
            setShowMenu(false);
        }
    };

    // Don't render if deleted for current user
    if (isDeletedForMe) {
        return null;
    }

    // Show deleted message if deleted for everyone
    if (isDeletedForEveryone) {
        return (
            <div ref={scroll} className={`chat ${isSender ? 'chat-end' : 'chat-start'}`}>
                <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                        <img alt="Tailwind CSS chat bubble component" src={isSender ? authUser?.profilePhoto : (message?.senderId?.profilePhoto || selectedUser?.profilePhoto)} />
                    </div>
                </div>
                <div className="chat-header">
                    <time className="text-xs opacity-50 text-white">12:45</time>
                </div>
                <div className={`chat-bubble ${!isSender ? 'bg-gray-200 text-black' : ''} italic opacity-70`}>
                    {message?.message}
                </div>
            </div>
        );
    }
    
    return (
        <div ref={scroll} className={`chat ${isSender ? 'chat-end' : 'chat-start'} relative group`}>
            <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                    <img alt="Tailwind CSS chat bubble component" src={isSender ? authUser?.profilePhoto : (message?.senderId?.profilePhoto || selectedUser?.profilePhoto)} />
                </div>
            </div>
            <div className="chat-header">
                <time className="text-xs opacity-50 text-white">12:45</time>
            </div>
            <div className={`chat-bubble ${!isSender ? 'bg-gray-200 text-black' : ''} relative`}>
                {message?.message}
                
                {/* Delete menu button - show for all messages */}
                <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-gray-300 rounded-full bg-white shadow-sm"
                >
                    <IoEllipsisVertical className="w-3 h-3 text-gray-600" />
                </button>
            </div>
            
            {/* Delete menu */}
            {showMenu && (
                <div 
                    ref={menuRef}
                    className="absolute top-0 right-0 mt-2 mr-2 delete-menu rounded-lg z-10 min-w-[160px] py-1"
                >
                    <button
                        onClick={handleDeleteForMe}
                        disabled={isDeleting}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 flex items-center"
                    >
                        {isDeleting ? "Deleting..." : "Delete for me"}
                    </button>
                    
                    {/* Only show "Delete for everyone" if user is the sender */}
                    {isSender && (
                        <>
                            <div className="border-t border-gray-100 my-1"></div>
                            <button
                                onClick={handleDeleteForEveryone}
                                disabled={isDeleting}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 disabled:opacity-50 flex items-center"
                            >
                                {isDeleting ? "Deleting..." : "Delete for everyone"}
                            </button>
                        </>
                    )}
                    
                    {/* Show info for receiver */}
                    {!isSender && (
                        <>
                            <div className="border-t border-gray-100 my-1"></div>
                            <div className="px-4 py-1 text-xs text-gray-500 italic">
                                You can only delete for yourself
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}

export default Message