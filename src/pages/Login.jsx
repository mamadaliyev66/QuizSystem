import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useQuizStore from '../store/useQuizStore';
import usersData from '../../data/users.json';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const login = useQuizStore((state) => state.login);
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');

        const user = usersData.find(u => u.login === email && u.password === password);
        if (user) {
            login(user.login, user.name);
            navigate('/categories');
        } else {
            setError('Login yoki parol notog\'ri!');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#eef2f6]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="glass-card p-10 w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Quiz Tizimiga Kirish</h1>
                    <p className="text-sm text-gray-500">Login va parolingizni kiriting</p>
                </div>

                {error && (
                    <div className="mb-4 text-center text-sm font-medium text-red-600 bg-red-50 py-2 rounded-lg border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Login</label>
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2.5 bg-blue-50/50 border border-blue-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Parol</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2.5 bg-blue-50/50 border border-blue-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#111111] hover:bg-black text-white py-2.5 rounded-lg font-medium transition-colors"
                    >
                        Kirish
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;
