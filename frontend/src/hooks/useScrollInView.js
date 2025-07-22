import { useEffect, useRef, useState } from 'react';

/**
 * Hook mới để handle scroll-based infinite loading
 * Khác với useInView cũ, hook này tập trung vào việc load more content khi scroll
 */
const useScrollInView = (callback, options = {}) => {
    const elementRef = useRef(null);
    const [isIntersecting, setIsIntersecting] = useState(false);
    const [hasTriggered, setHasTriggered] = useState(false);
const { threshold = 0.1, rootMargin = '0px 0px 200px 0px', triggerOnce = false } = options;


    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                const isCurrentlyIntersecting = entry.isIntersecting;
                setIsIntersecting(isCurrentlyIntersecting);

                if (isCurrentlyIntersecting && (!triggerOnce || !hasTriggered)) {
                    setHasTriggered(true);
                    callback();
                }
            },
            {
                threshold,
                rootMargin,
            }
        );

        observer.observe(element);

        return () => {
            if (element) observer.unobserve(element);
        };
    }, [callback, threshold, rootMargin, triggerOnce, hasTriggered]);

    useEffect(() => {
        if (!triggerOnce && !isIntersecting) {
            setHasTriggered(false);
        }
    }, [isIntersecting, triggerOnce]);

    return {
        elementRef,
        isIntersecting,
        hasTriggered
    };
};


export default useScrollInView;
