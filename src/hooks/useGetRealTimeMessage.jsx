import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setMessages } from "../redux/messageSlice";

const useGetRealTimeMessage = () => {
    const {socket} = useSelector(store=>store.socket);
    const {messages} = useSelector(store=>store.message);
    const dispatch = useDispatch();
    
    useEffect(()=>{
         socket?.on("newMessage", (newMessage)=>{
            dispatch(setMessages([...messages, newMessage]));
         });

         // Handle message deleted for everyone
         socket?.on("messageDeletedForEveryone", (deletedMessage)=>{
            const updatedMessages = messages.map(msg => 
                msg._id === deletedMessage._id 
                    ? { ...msg, deletedForEveryone: true, message: "This message was deleted" }
                    : msg
            );
            dispatch(setMessages(updatedMessages));
         });
         
         return () => {
             socket?.off("newMessage");
             socket?.off("messageDeletedForEveryone");
         };
    },[socket, messages, dispatch]);
};

export default useGetRealTimeMessage;