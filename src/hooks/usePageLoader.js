import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const usePageLoader = () => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    // We can't directly listen to route changes, so we'll use a workaround
    // We'll set loading to true and then false after a short delay
    handleStart();
    const timer = setTimeout(handleComplete, 500); // Adjust delay as needed

    return () => clearTimeout(timer);
  }, [location]);

  return loading;
};

export default usePageLoader;