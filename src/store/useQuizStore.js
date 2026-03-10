import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useQuizStore = create(
    persist(
        (set) => ({
            user: null,
            login: (loginName, name) => set({ user: { login: loginName, name } }),
            logout: () => set({ user: null, activeQuiz: null, quizResult: null }),

            activeQuiz: null,
            startQuiz: (category, numQuestions, timeLimit, questions) => set({
                activeQuiz: {
                    category,
                    numQuestions,
                    timeLimit, // in minutes
                    startTime: Date.now(),
                    questions,
                    currentQuestionIndex: 0,
                    answers: {}, // { questionId: selectedIndex }
                    isFinished: false,
                }
            }),
            answerQuestion: (questionId, answerIndex) => set((state) => {
                if (!state.activeQuiz) return state;
                return {
                    activeQuiz: {
                        ...state.activeQuiz,
                        answers: {
                            ...state.activeQuiz.answers,
                            [questionId]: answerIndex
                        }
                    }
                };
            }),
            nextQuestion: () => set((state) => {
                if (!state.activeQuiz) return state;
                return {
                    activeQuiz: {
                        ...state.activeQuiz,
                        currentQuestionIndex: Math.min(state.activeQuiz.currentQuestionIndex + 1, state.activeQuiz.questions.length - 1)
                    }
                };
            }),
            prevQuestion: () => set((state) => {
                if (!state.activeQuiz) return state;
                return {
                    activeQuiz: {
                        ...state.activeQuiz,
                        currentQuestionIndex: Math.max(state.activeQuiz.currentQuestionIndex - 1, 0)
                    }
                };
            }),
            finishQuiz: () => set((state) => {
                if (!state.activeQuiz) return state;

                // Calculate score
                let correctAnswers = 0;
                state.activeQuiz.questions.forEach((q) => {
                    const userAnswerIndex = state.activeQuiz.answers[q.id];
                    const userAnswer = userAnswerIndex !== undefined ? q.variantlar[userAnswerIndex] : null;
                    if (userAnswer === q.javob) {
                        correctAnswers++;
                    }
                });

                const timeSpent = Math.floor((Date.now() - state.activeQuiz.startTime) / 1000); // in seconds

                return {
                    quizResult: {
                        ...state.activeQuiz,
                        correctAnswers,
                        timeSpent,
                        scorePercentage: (correctAnswers / state.activeQuiz.questions.length) * 100
                    },
                    activeQuiz: { ...state.activeQuiz, isFinished: true }
                };
            }),
            clearQuiz: () => set({ activeQuiz: null, quizResult: null }),

            quizResult: null,
        }),
        {
            name: 'quiz-storage', // name of the item in the storage (must be unique)
            partialize: (state) => ({ user: state.user, quizResult: state.quizResult }), // Only persist user and last result
        }
    )
);

export default useQuizStore;
