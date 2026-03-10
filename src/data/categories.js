import quizData from '../../data/data.json';

// Group the quizData dynamically
// It has keys like fan_1, testlar_1, fan_2, testlar_2, etc.
const parsedCategories = [];

// Determine the maximum index by looking at the keys
let maxIndex = 0;
Object.keys(quizData).forEach(key => {
    if (key.startsWith('fan_')) {
        const index = parseInt(key.split('_')[1], 10);
        if (index > maxIndex) maxIndex = index;
    } else if (key === 'fan') {
        // fallback if some key is just 'fan'
        maxIndex = Math.max(maxIndex, 1);
    }
});

for (let i = 1; i <= maxIndex; i++) {
    const fanName = quizData[`fan_${i}`] || quizData['fan'];
    const testlar = quizData[`testlar_${i}`] || quizData['testlar'];

    if (fanName && testlar) {
        parsedCategories.push({
            id: `category_${i}`,
            name: fanName,
            difficultyInfo: 'Mavjud qiyinlik darajasi 3',
            data: {
                fan: fanName,
                testlar: testlar
            }
        });
    }
}

export const categories = parsedCategories;

export const getCategoryById = (id) => {
    return categories.find(c => c.id === id);
};
