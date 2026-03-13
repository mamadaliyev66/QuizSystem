import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useQuizStore from '../store/useQuizStore';

const Login = () => {
    const login = useQuizStore((state) => state.login);
    const navigate = useNavigate();

    useEffect(() => {
        login('guest', 'Guest');
        navigate('/categories');
    }, []);

    return null;
};

export default Login;
