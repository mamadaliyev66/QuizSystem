import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, LogOut } from 'lucide-react';
import useQuizStore from '../store/useQuizStore';
import { getCategoryById } from '../data/categories';

const QuizSetup = () => {
    const { categoryId } = useParams();
    const navigate = useNavigate();
    const category = getCategoryById(categoryId);

    const user = useQuizStore((state) => state.user);
    const logout = useQuizStore((state) => state.logout);
    const startQuiz = useQuizStore((state) => state.startQuiz);

    const testlar = category?.data?.testlar || [];
    const maxQuestions = testlar.length;

    const [numQuestionsStr, setNumQuestionsStr] = useState('1-' + maxQuestions);
    const [timeLimitStr, setTimeLimitStr] = useState('1-120');

    if (!category) {
        return <div>Category not found</div>;
    }

    const handleStart = () => {
        // Parse numQuestions.
        // If they type "50", it's 50. If they type "1-50", let's just take 50.
        let numQ = maxQuestions;
        const nStr = numQuestionsStr.split('-').pop(); // gets the max if range
        if (!isNaN(parseInt(nStr))) {
            numQ = parseInt(nStr);
        }
        numQ = Math.min(Math.max(1, numQ), maxQuestions);

        let tLimit = 120; // default 120 mins
        const tStr = timeLimitStr.split('-').pop();
        if (!isNaN(parseInt(tStr))) {
            tLimit = parseInt(tStr);
        }

        // Shuffle and slice questions
        const shuffled = [...testlar].sort(() => 0.5 - Math.random());
        const selectedQuestions = shuffled.slice(0, numQ);

        startQuiz(category, numQ, tLimit, selectedQuestions);
        navigate(`/quiz/${categoryId}`);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-[#eef2f6] p-8">
            <div className="max-w-6xl mx-auto">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-1">Quiz System</h1>
                        <p className="text-gray-500">Welcome, {user?.name}</p>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => navigate('/categories')}
                            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
                        >
                            Yangi test boshlash
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
                        >
                            <LogOut size={16} />
                            Chiqish
                        </button>
                    </div>
                </header>

                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card p-8 bg-white border-gray-200"
                >
                    <div className="flex items-center gap-4 mb-8">
                        <button
                            onClick={() => navigate('/categories')}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <ArrowLeft size={20} className="text-gray-600" />
                        </button>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 leading-tight">Quiz Setup</h2>
                            <p className="text-sm text-gray-500">{categoryId} - Daraja 1</p>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg mb-6 text-gray-800 font-medium">
                        Mavjud Savollar: {maxQuestions}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Savollar Raqami :
                            </label>
                            <input
                                type="text"
                                value={numQuestionsStr}
                                onChange={(e) => setNumQuestionsStr(e.target.value)}
                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Vaqt Limiti (minutlarda)
                            </label>
                            <input
                                type="text"
                                value={timeLimitStr}
                                onChange={(e) => setTimeLimitStr(e.target.value)}
                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleStart}
                        className="w-full bg-[#111111] hover:bg-black text-white py-3 rounded-lg font-medium transition-colors"
                    >
                        Testni Boshlash
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

export default QuizSetup;
