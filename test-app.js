// Simple test to verify the app components
const { generateFitnessPlan } = require('./src/utils/aiService');

const testUserData = {
  name: 'John Doe',
  age: '25',
  gender: 'male',
  height: '175',
  weight: '70',
  fitnessGoal: 'muscle-gain',
  fitnessLevel: 'intermediate',
  workoutLocation: 'gym',
  dietaryPreference: 'non-vegetarian',
  medicalHistory: '',
  stressLevel: 'low'
};

console.log('Testing AI Fitness Coach App...');
console.log('User Data:', testUserData);

generateFitnessPlan(testUserData)
  .then(plan => {
    console.log('\n✅ Plan generated successfully!');
    console.log('\n🏋️ Workout Plan Preview:');
    console.log(plan.workout.substring(0, 200) + '...');
    console.log('\n🥗 Diet Plan Preview:');
    console.log(plan.diet.substring(0, 200) + '...');
    console.log('\n💡 Tips Preview:');
    console.log(plan.tips.substring(0, 200) + '...');
  })
  .catch(error => {
    console.error('❌ Error:', error);
  });