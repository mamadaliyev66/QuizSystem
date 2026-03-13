import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useQuizStore from '../store/useQuizStore';
import usersData from '../../data/users.json';

const Login = () => {
    const login = useQuizStore((state) => state.login);
    const navigate = useNavigate();

    useEffect(() => {
        const defaultUser = usersData[0]; // Use first user from your data
        login(defaultUser.login, defaultUser.name);
        navigate('/categories', { replace: true });
    }, []);

    return null;
};

export default Login;
