import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { exportToPDF } from '../utils/pdfExport';
import { speakText } from '../utils/speechService';
import { generateImage } from '../utils/imageService';

const PlanDisplay = ({ plan, userData, onBackToForm, onRegenerate, onClearSaved }) => {
  const [activeTab, setActiveTab] = useState('workout');
  const [speaking, setSpeaking] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(null);
  const [generatedImages, setGeneratedImages] = useState({});

  const handleSpeak = async (section) => {
    if (speaking) return;
    
    setSpeaking(true);
    try {
      const textToSpeak = section === 'workout' 
        ? `Here's your workout plan: ${plan.workout.replace(/\*\*/g, '').replace(/\*/g, '')}`
        : `Here's your diet plan: ${plan.diet.replace(/\*\*/g, '').replace(/\*/g, '')}`;
      
      await speakText(textToSpeak);
    } catch (error) {
      console.error('Speech error:', error);
    } finally {
      setSpeaking(false);
    }
  };

  const handleGenerateImage = async (item, type) => {
    const key = `${type}-${item}`;
    if (generatingImage === key || generatedImages[key]) return;
    
    setGeneratingImage(key);
    try {
      const imageUrl = await generateImage(item, type);
      if (imageUrl) {
        setGeneratedImages(prev => ({ ...prev, [key]: imageUrl }));
      }
    } catch (error) {
      console.error('Image generation failed:', error);
    } finally {
      setGeneratingImage(null);
    }
  };

  const handleExportPDF = () => {
    exportToPDF(plan, userData);
  };

  const handleRegenerate = async () => {
    setGeneratingImage('regenerating');
    try {
      await onRegenerate();
    } finally {
      setGeneratingImage(null);
    }
  };

  const renderWorkoutPlan = () => {
    const workoutLines = plan.workout.split('\n').filter(line => line.trim() && line.replace(/\*\*/g, '').replace(/\*/g, '').trim().length > 0);
    
    return (
      <div className="space-y-6">
        {workoutLines.filter((line, index) => {
          const cleanLine = line.replace(/\*\*/g, '').replace(/\*/g, '').trim();
          return cleanLine && cleanLine.length > 2; // Filter out very short or empty lines
        }).map((line, index) => {
          const cleanLine = line.replace(/\*\*/g, '').replace(/\*/g, '').trim();
          
          const isDay = cleanLine.toLowerCase().includes('day') && (cleanLine.includes('1') || cleanLine.includes('2') || cleanLine.includes('3') || cleanLine.includes('4') || cleanLine.includes('5') || cleanLine.includes('6') || cleanLine.includes('7'));
          const isActualExercise = !isDay && (cleanLine.includes('x') || cleanLine.includes('reps') || cleanLine.includes('sets') || (cleanLine.includes('-') && cleanLine.length > 10));
          const exerciseName = cleanLine.replace(/^[-•]\s*/, '').split(':')[0] || cleanLine;
          
          if (isDay) {
            return (
              <motion.div
                key={index}
                className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 shadow-xl"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zM4 7h12v9a1 1 0 01-1 1H5a1 1 0 01-1-1V7z"/>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white">{cleanLine}</h3>
                </div>
              </motion.div>
            );
          }
          
          return (
            <motion.div
              key={index}
              className="group bg-white dark:bg-gray-800 border border-orange-200 dark:border-orange-700 rounded-xl p-5 hover:shadow-lg transition-all duration-300 ml-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z"/>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
                        {cleanLine}
                      </p>
                    </div>
                  </div>
                </div>
                {isActualExercise && exerciseName.trim().length > 3 && (
                  <button
                    onClick={() => handleGenerateImage(exerciseName.trim(), 'exercise')}
                    disabled={generatingImage === `exercise-${exerciseName.trim()}`}
                    className="ml-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-gray-400 disabled:to-gray-500 text-white p-2 rounded-lg transition-all duration-200 hover:scale-110 shadow-lg"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
              {generatedImages[`exercise-${exerciseName.trim()}`] && (
                <div className="mt-4 flex justify-center">
                  <img 
                    src={generatedImages[`exercise-${exerciseName.trim()}`]} 
                    alt={exerciseName}
                    className="w-32 h-32 object-cover rounded-lg shadow-lg border-2 border-orange-200 dark:border-orange-700"
                  />
                </div>
              )}
              {generatingImage === `exercise-${exerciseName.trim()}` && (
                <div className="mt-3 flex items-center justify-center space-x-2 text-blue-600 dark:text-blue-400">
                  <svg className="animate-spin w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1z"/>
                  </svg>
                  <span className="text-sm font-medium">Generating AI image...</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    );
  };



  const renderDietPlan = () => {
    const dietLines = plan.diet.split('\n').filter(line => line.trim() && line.replace(/\*\*/g, '').replace(/\*/g, '').trim().length > 0);
    
    return (
      <div className="space-y-6">
        {dietLines.filter((line, index) => {
          const cleanLine = line.replace(/\*\*/g, '').replace(/\*/g, '').trim();
          return cleanLine && cleanLine.length > 2; // Filter out very short or empty lines
        }).map((line, index) => {
          const cleanLine = line.replace(/\*\*/g, '').replace(/\*/g, '').trim();
          
          const isMealTitle = /\b(breakfast|lunch|dinner|snacks?)\b/i.test(cleanLine);
          const isAdvice = /\b(note|tip|remember|important|ensure|make sure|adjust|based on|sample|plan|recommendation|guideline|instruction|should|must|need to|try to|be sure|approximately|around|about|total|aim for|crucial|follow|maintain|avoid|consider|deficit|caloric|portion)\b/i.test(cleanLine);
          const isActualFoodItem = !isMealTitle && !isAdvice;
          
          const foodName = cleanLine.replace(/^[-•]\s*/, '').trim();
          
          if (isMealTitle) {
            return (
              <motion.div
                key={index}
                className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 shadow-xl"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zM4 7h12v9a1 1 0 01-1 1H5a1 1 0 01-1-1V7z"/>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white">{cleanLine}</h3>
                </div>
              </motion.div>
            );
          }
          
          return (
            <motion.div
              key={index}
              className="group bg-white dark:bg-gray-800 border border-green-200 dark:border-green-700 rounded-xl p-5 hover:shadow-lg transition-all duration-300 ml-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
                        {cleanLine}
                      </p>
                    </div>
                  </div>
                </div>
                {isActualFoodItem && foodName.length > 3 && (
                  <button
                    onClick={() => handleGenerateImage(foodName, 'food')}
                    disabled={generatingImage === `food-${foodName}`}
                    className="ml-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-400 disabled:to-gray-500 text-white p-2 rounded-lg transition-all duration-200 hover:scale-110 shadow-lg"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
              {generatedImages[`food-${foodName}`] && (
                <div className="mt-4 flex justify-center">
                  <img 
                    src={generatedImages[`food-${foodName}`]} 
                    alt={foodName}
                    className="w-32 h-32 object-cover rounded-lg shadow-lg border-2 border-green-200 dark:border-green-700"
                  />
                </div>
              )}
              {generatingImage === `food-${foodName}` && (
                <div className="mt-3 flex items-center justify-center space-x-2 text-green-600 dark:text-green-400">
                  <svg className="animate-spin w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1z"/>
                  </svg>
                  <span className="text-sm font-medium">Generating AI image...</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    );
  };

  return (
    <motion.div 
      className="max-w-6xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-8 text-white shadow-2xl">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-6 lg:space-y-0">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">💪</span>
              </div>
              <h2 className="text-3xl font-bold">
                Your AI Fitness Plan
              </h2>
            </div>
            <p className="text-blue-100 text-lg">
              Welcome back, <span className="font-semibold">{userData.name}</span>! 
              Your personalized {userData.fitnessGoal.replace('-', ' ')} journey starts here.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleExportPDF}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-xl flex items-center space-x-2 transition-all duration-200 hover:scale-105"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <span>Export PDF</span>
            </button>
            
            <button
              onClick={handleRegenerate}
              disabled={generatingImage === 'regenerating'}
              className="bg-white/20 hover:bg-white/30 disabled:bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl flex items-center space-x-2 transition-all duration-200 hover:scale-105"
            >
              <svg className={`w-5 h-5 ${generatingImage === 'regenerating' ? 'animate-spin' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              <span>{generatingImage === 'regenerating' ? 'Regenerating...' : 'Regenerate'}</span>
            </button>
            
            <button
              onClick={onBackToForm}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-xl flex items-center space-x-2 transition-all duration-200 hover:scale-105"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              <span>Back</span>
            </button>
            
            <button
              onClick={onClearSaved}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-xl flex items-center space-x-2 transition-all duration-200 hover:scale-105"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 012 0v4a1 1 0 11-2 0V7zM12 7a1 1 0 112 0v4a1 1 0 11-2 0V7z" clipRule="evenodd" />
              </svg>
              <span>Clear Saved</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl mb-8 overflow-hidden">
        <div className="flex bg-gray-50 dark:bg-gray-700">
          <button
            onClick={() => setActiveTab('workout')}
            className={`flex-1 py-4 px-6 font-semibold transition-all duration-300 flex items-center justify-center space-x-3 ${
              activeTab === 'workout'
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg transform scale-105'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
            </svg>
            <span>Workout Plan</span>
          </button>
          <button
            onClick={() => setActiveTab('diet')}
            className={`flex-1 py-4 px-6 font-semibold transition-all duration-300 flex items-center justify-center space-x-3 ${
              activeTab === 'diet'
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg transform scale-105'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z" clipRule="evenodd" />
            </svg>
            <span>Diet Plan</span>
          </button>
          <button
            onClick={() => setActiveTab('tips')}
            className={`flex-1 py-4 px-6 font-semibold transition-all duration-300 flex items-center justify-center space-x-3 ${
              activeTab === 'tips'
                ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg transform scale-105'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
            <span>AI Tips</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 px-8 py-6 border-b border-gray-200 dark:border-gray-600">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                activeTab === 'workout' ? 'bg-gradient-to-r from-orange-500 to-red-500' :
                activeTab === 'diet' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                'bg-gradient-to-r from-purple-500 to-indigo-500'
              }`}>
                {activeTab === 'workout' && <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z"/></svg>}
                {activeTab === 'diet' && <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586z" clipRule="evenodd" /></svg>}
                {activeTab === 'tips' && <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>}
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                {activeTab === 'workout' && 'Your Workout Plan'}
                {activeTab === 'diet' && 'Your Diet Plan'}
                {activeTab === 'tips' && 'AI Tips & Motivation'}
              </h3>
            </div>
            
            {(activeTab === 'workout' || activeTab === 'diet') && (
              <button
                onClick={() => handleSpeak(activeTab)}
                disabled={speaking}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-6 py-3 rounded-xl flex items-center space-x-3 transition-all duration-200 hover:scale-105 shadow-lg"
              >
                <svg className={`w-5 h-5 ${speaking ? 'animate-pulse' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.816L4.846 13.5H3a1 1 0 01-1-1v-5a1 1 0 011-1h1.846l3.537-3.316a1 1 0 011.617.816zM16 10a1 1 0 01-.293.707l-2 2a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 111.414-1.414l2 2A1 1 0 0116 10z" clipRule="evenodd" />
                </svg>
                <span>{speaking ? 'Speaking...' : 'Read Aloud'}</span>
              </button>
            )}
          </div>
        </div>
        
        <div className="p-8">
        
          {activeTab === 'workout' && renderWorkoutPlan()}
          {activeTab === 'diet' && renderDietPlan()}
          {activeTab === 'tips' && (
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-6">
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <div className="whitespace-pre-line text-gray-700 dark:text-gray-300 leading-relaxed">
                  {plan.tips.replace(/\*\*/g, '').replace(/\*/g, '')}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PlanDisplay;