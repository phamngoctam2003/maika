import { useState, useEffect, useRef, useCallback } from 'react';

const useInView = (callback, options = {}) => {
  const [isInView, setIsInView] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const elementRef = useRef(null);
  const callbackRef = useRef(callback);
  const observerRef = useRef(null);

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const handleIntersection = useCallback(([entry]) => {
    setIsInView(entry.isIntersecting);
    
    if (entry.isIntersecting && !hasLoaded && !loading) {
      setLoading(true);
      
      callbackRef.current()
        .then(() => {
          setHasLoaded(true);
        })
        .catch((error) => {
          console.error('Error loading data:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [hasLoaded, loading]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Disconnect previous observer if exists
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      handleIntersection,
      {
        threshold: 0.1,
        rootMargin: '-160px',
        ...options
      }
    );

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleIntersection]);

  return {
    elementRef,
    isInView,
    hasLoaded,
    loading
  };
};

export default useInView;
