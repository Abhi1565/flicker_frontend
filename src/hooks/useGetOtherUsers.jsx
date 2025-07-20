import React, {useEffect} from 'react';
import api from '../utils/axios';
import { useDispatch, useSelector } from 'react-redux';
import { setOtherUsers } from '../redux/userSlice';

const useGetOtherUsers = () => {
    const dispatch = useDispatch();
    const { authUser } = useSelector(store => store.user);

    useEffect(()=>{
        const fetchOtherUsers = async() => {
            try {
                const res = await api.get('/user');
                dispatch(setOtherUsers(res.data));
            } catch (error) {
                console.log('Error fetching other users:', error);
            }
        }
        
        // Only fetch other users if user is authenticated
        if (authUser) {
            fetchOtherUsers();
        }
    },[authUser])
}

export default useGetOtherUsers