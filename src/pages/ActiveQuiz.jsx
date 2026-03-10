import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut } from 'lucide-react';
import useQuizStore from '../store/useQuizStore';
import clsx from 'clsx';

const ActiveQuiz = () => {
    const navigate = useNavigate();
    const user = useQuizStore((state) => state.user);
    const logout = useQuizStore((state) => state.logout);
    const activeQuiz = useQuizStore((state) => state.activeQuiz);
    const answerQuestion = useQuizStore((state) => state.answerQuestion);
    const nextQuestion = useQuizStore((state) => state.nextQuestion);
    const finishQuiz = useQuizStore((state) => state.finishQuiz);
    const [timeLeftStr, setTimeLeftStr] = useState('');

    useEffect(() => {
        if (!activeQuiz) {
            navigate('/categories');
        }
    }, [activeQuiz, navigate]);

    useEffect(() => {
        if (!activeQuiz || activeQuiz.isFinished) return;

        const interval = setInterval(() => {
            const now = Date.now();
            const endTime = activeQuiz.startTime + activeQuiz.timeLimit * 60 * 1000;
            const msLeft = endTime - now;

            if (msLeft <= 0) {
                finishQuiz();
                navigate('/results');
                clearInterval(interval);
            } else {
                const totalSeconds = Math.floor(msLeft / 1000);
                const m = Math.floor(totalSeconds / 60);
                const s = totalSeconds % 60;
                setTimeLeftStr(`${m}:${s.toString().padStart(2, '0')}`);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [activeQuiz, finishQuiz, navigate]);

    if (!activeQuiz) return null;

    const currentQIndex = activeQuiz.currentQuestionIndex;
    const question = activeQuiz.questions[currentQIndex];
    const selectedAnswerIndex = activeQuiz.answers[question.id];
    const totalQ = activeQuiz.questions.length;

    // Realtime stats
    const answeredCount = Object.keys(activeQuiz.answers).length;
    let correctCount = 0;
    activeQuiz.questions.forEach((q) => {
        const uaIndex = activeQuiz.answers[q.id];
        if (uaIndex !== undefined && q.variantlar[uaIndex] === q.javob) {
            correctCount++;
        }
    });

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleStopQuiz = () => {
        finishQuiz();
        navigate('/results');
    };

    const handleSubmit = () => {
        if (currentQIndex < totalQ - 1) {
            nextQuestion();
        } else {
            finishQuiz();
            navigate('/results');
        }
    };

    const progressPercent = ((currentQIndex + 1) / totalQ) * 100;

    return (
        <div className="min-h-screen bg-[#eef2f6] p-8 flex flex-col">
            <div className="max-w-6xl mx-auto w-full flex-grow flex flex-col">
                {/* Header */}
                <header className="flex justify-between items-center mb-8 shrink-0">
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

                {/* Top Progress & Timer Bar */}
                <div className="glass-card mb-6 shrink-0 bg-white">
                    <div className="p-4 flex justify-between items-center px-6">
                        <div className="font-semibold text-gray-800">
                            {currentQIndex + 1}-savol, jami {totalQ} ta
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="font-medium text-gray-700">{timeLeftStr}</span>
                            <button
                                onClick={handleStopQuiz}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded text-sm font-bold transition-colors"
                            >
                                Testni to'xtatish
                            </button>
                        </div>
                    </div>
                    <div className="h-2 w-full bg-gray-200 overflow-hidden rounded-b-xl">
                        <motion.div
                            className="h-full bg-[#111111]"
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercent}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                </div>

                {/* Question Area */}
                <div className="glass-card bg-white p-6 md:p-8 flex-grow flex flex-col mb-6">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={question.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="flex-grow"
                        >
                            <h2 className="text-lg font-semibold text-gray-900 mb-8 leading-relaxed">
                                {question.savol}
                            </h2>

                            <div className="space-y-4">
                                {question.variantlar.map((variant, index) => {
                                    const isSelected = selectedAnswerIndex === index;
                                    const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F'];
                                    return (
                                        <button
                                            key={index}
                                            onClick={() => answerQuestion(question.id, index)}
                                            className={clsx(
                                                "w-full text-left p-4 rounded-lg border-2 transition-all flex items-center gap-4",
                                                isSelected
                                                    ? "border-blue-500 bg-blue-50/30"
                                                    : "border-gray-100 hover:border-gray-200 bg-white"
                                            )}
                                        >
                                            <div className={clsx(
                                                "w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold border-2 flex-shrink-0",
                                                isSelected
                                                    ? "border-blue-500 text-blue-600"
                                                    : "border-gray-300 text-gray-500"
                                            )}>
                                                {optionLetters[index]}
                                            </div>
                                            <span className="text-gray-700">{variant}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    <button
                        onClick={handleSubmit}
                        disabled={selectedAnswerIndex === undefined}
                        className="w-full mt-8 bg-gray-400 hover:bg-gray-500 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Javobni yuborish
                    </button>
                </div>

                {/* Bottom Realtime Stats */}
                <div className="grid grid-cols-3 gap-6 shrink-0">
                    <div className="glass-card bg-white p-4">
                        <div className="text-2xl font-bold text-gray-900">{correctCount}</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">To'g'ri</div>
                    </div>
                    <div className="glass-card bg-white p-4">
                        <div className="text-2xl font-bold text-gray-900">{answeredCount}</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">Javob berilgan</div>
                    </div>
                    <div className="glass-card bg-white p-4">
                        <div className="text-2xl font-bold text-gray-900">{totalQ - answeredCount}</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">Qolgan</div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ActiveQuiz;
