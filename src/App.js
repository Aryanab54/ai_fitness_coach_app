import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import UserForm from './components/UserForm';
import PlanDisplay from './components/PlanDisplay';
import Header from './components/Header';
import MotivationQuote from './components/MotivationQuote';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentView, setCurrentView] = useState('form');
  const [userPlan, setUserPlan] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
    
    // Load saved fitness plan
    const savedPlan = localStorage.getItem('fitnessplan');
    if (savedPlan) {
      try {
        const { plan, userData, timestamp } = JSON.parse(savedPlan);
        // Check if plan is not too old (7 days)
        const isRecent = new Date() - new Date(timestamp) < 7 * 24 * 60 * 60 * 1000;
        if (isRecent && plan && userData) {
          console.log('💾 Loading saved plan for:', userData.name);
          setUserPlan(plan);
          setUserData(userData);
          setCurrentView('plan');
        } else {
          console.log('💾 Saved plan expired, clearing localStorage');
          localStorage.removeItem('fitnessplan');
        }
      } catch (error) {
        console.error('❌ Error loading saved plan:', error);
        localStorage.removeItem('fitnessplan');
      }
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handlePlanGenerated = (plan, userData) => {
    setUserPlan(plan);
    setUserData(userData);
    setCurrentView('plan');
    
    // Save to localStorage
    const planData = {
      plan,
      userData,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('fitnessplan', JSON.stringify(planData));
    console.log('💾 Plan saved to localStorage');
  };

  const handleBackToForm = () => {
    setCurrentView('form');
    setUserPlan(null);
    setUserData(null);
  };
  
  const handleClearSavedPlan = () => {
    localStorage.removeItem('fitnessplan');
    console.log('💾 Cleared saved plan from localStorage');
    setCurrentView('form');
    setUserPlan(null);
    setUserData(null);
  };

  const handleRegenerate = async () => {
    if (!userData) {
      console.warn('⚠️ No user data available for regeneration');
      return;
    }
    
    try {
      console.log('🔄 === STARTING PLAN REGENERATION ===');
      console.log('🔄 Regenerating plan for:', userData.name);
      console.log('🔄 User data:', {
        name: userData.name,
        age: userData.age,
        goal: userData.fitnessGoal,
        level: userData.fitnessLevel
      });
      
      const { generateFitnessPlan } = await import('./utils/aiService');
      const newPlan = await generateFitnessPlan(userData);
      setUserPlan(newPlan);
      
      // Update localStorage with new plan
      const planData = {
        plan: newPlan,
        userData,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('fitnessplan', JSON.stringify(planData));
      console.log('💾 Updated saved plan in localStorage');
      
      console.log('✅ === PLAN REGENERATION SUCCESSFUL ===');
      console.log('✅ New plan generated with sections:', {
        workout: !!newPlan.workout,
        diet: !!newPlan.diet,
        tips: !!newPlan.tips
      });
    } catch (error) {
      console.error('❌ === PLAN REGENERATION FAILED ===');
      console.error('❌ Error regenerating plan:', error.message);
      console.error('❌ Error stack:', error.stack);
      alert('Failed to regenerate plan. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {currentView === 'form' && (
            <>
              <MotivationQuote />
              <UserForm onPlanGenerated={handlePlanGenerated} />
            </>
          )}
          
          {currentView === 'plan' && (
            <PlanDisplay 
              plan={userPlan} 
              userData={userData}
              onBackToForm={handleBackToForm}
              onRegenerate={handleRegenerate}
              onClearSaved={handleClearSavedPlan}
            />
          )}
        </motion.div>
      </main>
    </div>
  );
}

export default App;
