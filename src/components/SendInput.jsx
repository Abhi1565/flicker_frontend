import React, { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { setMessages } from '../redux/messageSlice';
import { IoMdSend } from "react-icons/io";
import { BsEmojiSmile } from "react-icons/bs";
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import api from '../utils/axios';
import toast from 'react-hot-toast';

const SendInput = () => {
    const [message, setMessage] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const {selectedUser} = useSelector(store=>store.user);
    const {messages} = useSelector(store=>store.message);
    const dispatch = useDispatch();
    const emojiPickerRef = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;
        
        try {
            const res = await api.post(`/message/send/${selectedUser?._id}`, {message});
            dispatch(setMessages([...messages, res?.data?.newMessage]));
            setMessage("");
            setShowEmojiPicker(false);
        } catch (error) {
            console.log(error);
            toast.error("Failed to send message");
        }
    };

    const handleEmojiSelect = (emoji) => {
        setMessage(prev => prev + emoji.native);
    };

    // Close emoji picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
                setShowEmojiPicker(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="px-4 py-3 bg-white border-t relative">
            {/* Emoji Picker */}
            {showEmojiPicker && (
                <div 
                    ref={emojiPickerRef}
                    className="absolute bottom-full right-4 mb-2 z-50 emoji-picker-container"
                >
                    <Picker 
                        data={data} 
                        onEmojiSelect={handleEmojiSelect}
                        theme="light"
                        set="native"
                        previewPosition="none"
                        skinTonePosition="none"
                        maxFrequentRows={4}
                        perLine={8}
                    />
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
                {/* Emoji Button */}
                <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors emoji-button"
                    title="Add emoji"
                >
                    <BsEmojiSmile size={20} />
                </button>
                
                {/* Message Input */}
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-600 rounded-full focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 message-input bg-gray-800 text-white placeholder-gray-400"
                />
                
                {/* Send Button */}
                <button
                    type="submit"
                    disabled={!message.trim()}
                    className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors send-button"
                    title="Send message"
                >
                    <IoMdSend size={20} />
                </button>
            </form>
        </div>
    )
}

export default SendInput