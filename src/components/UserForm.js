import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { generateFitnessPlan } from '../utils/aiService';

const UserForm = ({ onPlanGenerated }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    fitnessGoal: '',
    fitnessLevel: '',
    workoutLocation: '',
    dietaryPreference: '',
    medicalHistory: '',
    stressLevel: ''
  });
  
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log('🚀 Starting AI plan generation...');
      const plan = await generateFitnessPlan(formData);
      console.log('✅ Plan generated successfully!');
      onPlanGenerated(plan, formData);
    } catch (error) {
      console.error('❌ Error generating plan:', error);
      if (error.message.includes('API key')) {
        alert('🔑 Gemini API Key Required\n\nThis app requires a valid Gemini API key for AI-powered plan generation.\n\nPlease add your API key to the .env file.');
      } else {
        alert(`❌ Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className="card max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="flex items-center mb-6">
        <span className="text-2xl mr-3">👤</span>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Tell us about yourself
        </h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="input-field"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Age *
            </label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              className="input-field"
              min="13"
              max="100"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Gender *
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="input-field"
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Height (cm) *
            </label>
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleInputChange}
              className="input-field"
              min="100"
              max="250"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Weight (kg) *
            </label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleInputChange}
              className="input-field"
              min="30"
              max="300"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              🎯 Fitness Goal *
            </label>
            <select
              name="fitnessGoal"
              value={formData.fitnessGoal}
              onChange={handleInputChange}
              className="input-field"
              required
            >
              <option value="">Select Goal</option>
              <option value="weight-loss">Weight Loss</option>
              <option value="muscle-gain">Muscle Gain</option>
              <option value="maintenance">Maintenance</option>
              <option value="endurance">Endurance</option>
              <option value="strength">Strength</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              💪 Fitness Level *
            </label>
            <select
              name="fitnessLevel"
              value={formData.fitnessLevel}
              onChange={handleInputChange}
              className="input-field"
              required
            >
              <option value="">Select Level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              📍 Workout Location *
            </label>
            <select
              name="workoutLocation"
              value={formData.workoutLocation}
              onChange={handleInputChange}
              className="input-field"
              required
            >
              <option value="">Select Location</option>
              <option value="home">Home</option>
              <option value="gym">Gym</option>
              <option value="outdoor">Outdoor</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              🍽️ Dietary Preference *
            </label>
            <select
              name="dietaryPreference"
              value={formData.dietaryPreference}
              onChange={handleInputChange}
              className="input-field"
              required
            >
              <option value="">Select Preference</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="non-vegetarian">Non-Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="keto">Keto</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Medical History (Optional)
            </label>
            <input
              type="text"
              name="medicalHistory"
              value={formData.medicalHistory}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Any medical conditions..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Stress Level (Optional)
            </label>
            <select
              name="stressLevel"
              value={formData.stressLevel}
              onChange={handleInputChange}
              className="input-field"
            >
              <option value="">Select Level</option>
              <option value="low">Low</option>
              <option value="moderate">Moderate</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
        
        <motion.button
          type="submit"
          disabled={loading}
          className="w-full btn-primary flex items-center justify-center space-x-2 py-3"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? (
            <>
              <span className="animate-spin">⏳</span>
              <span>Generating Your Plan...</span>
            </>
          ) : (
            <span>🚀 Generate My Fitness Plan</span>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default UserForm;