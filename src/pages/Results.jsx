import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, Trophy, Target, Clock, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import useQuizStore from '../store/useQuizStore';
import clsx from 'clsx';

const Results = () => {
    const navigate = useNavigate();
    const user = useQuizStore((state) => state.user);
    const logout = useQuizStore((state) => state.logout);
    const quizResult = useQuizStore((state) => state.quizResult);
    const clearQuiz = useQuizStore((state) => state.clearQuiz);

    useEffect(() => {
        if (!quizResult) {
            navigate('/categories');
        }
    }, [quizResult, navigate]);

    if (!quizResult) return null;

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleRestart = () => {
        clearQuiz();
        navigate('/categories');
    };

    const {
        category,
        questions,
        answers,
        correctAnswers,
        timeSpent,
        scorePercentage
    } = quizResult;

    const totalQ = questions.length;
    const incorrectQuestions = questions.filter(q => {
        const uaIndex = answers[q.id];
        const userAnswer = uaIndex !== undefined ? q.variantlar[uaIndex] : null;
        return userAnswer !== q.javob;
    });

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen bg-[#eef2f6] p-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-1">Quiz System</h1>
                        <p className="text-gray-500">Welcome, {user?.name}</p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={handleRestart}
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

                <div className="space-y-6">
                    {/* Main Score Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card bg-white p-10 text-center relative overflow-hidden"
                    >
                        <div className="absolute top-4 left-4">
                            <span className={clsx(
                                "px-3 py-1 rounded-full text-xs font-bold",
                                scorePercentage >= 80 ? "bg-green-100 text-green-700" :
                                    scorePercentage >= 50 ? "bg-yellow-100 text-yellow-700" :
                                        "bg-red-100 text-red-700"
                            )}>
                                {scorePercentage >= 80 ? 'Excellent' :
                                    scorePercentage >= 50 ? 'Good Job' :
                                        'Needs Improvement'}
                            </span>
                        </div>

                        <Trophy className="w-16 h-16 mx-auto mb-4 text-[#eab308]" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Test Yakunlandi!</h2>
                        <div className={clsx(
                            "text-5xl font-extrabold mb-2",
                            scorePercentage >= 80 ? "text-green-600" :
                                scorePercentage >= 50 ? "text-yellow-500" :
                                    "text-red-600"
                        )}>
                            {scorePercentage.toFixed(1)}%
                        </div>
                    </motion.div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="glass-card bg-white p-6 flex items-center gap-4"
                        >
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                                <Target size={24} />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900">{correctAnswers}/{totalQ}</div>
                                <div className="text-sm text-gray-500">To'g'ri Javoblar</div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="glass-card bg-white p-6 flex items-center gap-4"
                        >
                            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                                <Clock size={24} />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900">{formatTime(timeSpent)}</div>
                                <div className="text-sm text-gray-500">Sarflangan Vaqt</div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="glass-card bg-white p-6 flex items-center gap-4"
                        >
                            <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center">
                                <Trophy size={24} />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900">{scorePercentage.toFixed(0)}%</div>
                                <div className="text-sm text-gray-500">Natija</div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Incorrect Answers Review */}
                    {incorrectQuestions.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="glass-card bg-white p-6"
                        >
                            <div className="flex items-center gap-2 mb-6 text-red-600">
                                <XCircle size={20} />
                                <h3 className="text-lg font-bold">Notog'ri Javoblar ({incorrectQuestions.length})</h3>
                            </div>

                            <div className="space-y-4">
                                {incorrectQuestions.map((q, i) => {
                                    const uaIndex = answers[q.id];
                                    const userAnswer = uaIndex !== undefined ? q.variantlar[uaIndex] : "Javob berilmagan";

                                    return (
                                        <div key={i} className="p-4 border border-gray-100 rounded-lg bg-gray-50/50">
                                            <p className="font-medium text-gray-900 mb-3">{q.savol}</p>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex gap-2 text-red-600">
                                                    <XCircle size={16} className="shrink-0 mt-0.5" />
                                                    <span>Sizning Javobingiz: {userAnswer}</span>
                                                </div>
                                                <div className="flex gap-2 text-green-600">
                                                    <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                                                    <span>To'g'ri Javob: {q.javob}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                    <div className="text-center mt-8 pt-4">
                        <button
                            onClick={handleRestart}
                            className="bg-[#111111] hover:bg-black text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-md"
                        >
                            Boshqa Testni Boshlash
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Results;
