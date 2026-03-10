import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react';
import useQuizStore from '../store/useQuizStore';
import { categories } from '../data/categories';

const Categories = () => {
    const user = useQuizStore((state) => state.user);
    const logout = useQuizStore((state) => state.logout);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleSelectCategory = (categoryId) => {
        navigate(`/setup/${categoryId}`);
    };

    return (
        <div className="min-h-screen bg-[#eef2f6] p-8">
            <div className="max-w-6xl mx-auto">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-1">Quiz System</h1>
                        <p className="text-gray-500">Welcome, {user?.name || 'Demo User 1'}</p>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        <LogOut size={16} />
                        Chiqish
                    </button>
                </header>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-6"
                >
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">Toifalarni Tanlang</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categories.map((category, index) => (
                            <motion.div
                                key={category.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => handleSelectCategory(category.id)}
                                className="p-6 bg-white border border-gray-100 rounded-xl cursor-pointer hover:shadow-md hover:border-gray-200 transition-all group"
                            >
                                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                                    {category.name}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {category.difficultyInfo}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Categories;
