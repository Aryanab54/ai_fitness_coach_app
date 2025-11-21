import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const motivationalQuotes = [
  "Your body can do it. It's your mind you need to convince.",
  "The only bad workout is the one that didn't happen.",
  "Fitness is not about being better than someone else. It's about being better than you used to be.",
  "Don't wish for it, work for it.",
  "Success starts with self-discipline.",
  "The pain you feel today will be the strength you feel tomorrow.",
  "Your health is an investment, not an expense.",
  "Strong is the new beautiful.",
  "Progress, not perfection.",
  "Make yourself proud."
];

const MotivationQuote = () => {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    setQuote(randomQuote);
  }, []);

  return (
    <motion.div 
      className="card mb-8 text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="text-4xl mb-4">💬</div>
      <p className="text-lg font-medium text-gray-700 dark:text-gray-300 italic">
        "{quote}"
      </p>
    </motion.div>
  );
};

export default MotivationQuote;