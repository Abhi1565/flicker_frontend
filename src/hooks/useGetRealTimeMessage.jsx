import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setMessages } from "../redux/messageSlice";

const useGetRealTimeMessage = () => {
    const { socket } = useSelector(store => store.socket);
    const { messages } = useSelector(store => store.message);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (newMessage) => {
            dispatch(setMessages([...(Array.isArray(messages) ? messages : []), newMessage]));
        };

        const handleDeletedForEveryone = (deletedMessage) => {
            dispatch(setMessages(
                (Array.isArray(messages) ? messages : []).map(msg =>
                    msg._id === deletedMessage._id
                        ? { ...msg, deletedForEveryone: true, message: "This message was deleted" }
                        : msg
                )
            ));
        };

        socket.on("newMessage", handleNewMessage);
        socket.on("messageDeletedForEveryone", handleDeletedForEveryone);

        return () => {
            socket.off("newMessage", handleNewMessage);
            socket.off("messageDeletedForEveryone", handleDeletedForEveryone);
        };
    }, [socket, dispatch, messages]);
};

export default useGetRealTimeMessage;