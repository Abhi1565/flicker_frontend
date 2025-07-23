import React from 'react'
import OtherUser from './OtherUser';
import useGetOtherUsers from '../hooks/useGetOtherUsers';
import {useSelector} from "react-redux";

const OtherUsers = () => {
    // my custom hook
    useGetOtherUsers();
    let {otherUsers} = useSelector(store=>store.user);
    if (!Array.isArray(otherUsers)) otherUsers = [];
    return (
        <div className='overflow-auto flex-1'>
            {
                otherUsers.map((user)=>{
                    return (
                        <OtherUser key={user._id} user={user}/>
                    )
                })
            }
        </div>
    )
}

export default OtherUsers