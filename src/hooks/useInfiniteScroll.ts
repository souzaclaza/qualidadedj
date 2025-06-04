import { useEffect, useCallback, RefObject } from 'react';

export function useInfiniteScroll(
  ref: RefObject<HTMLElement>,
  callback: () => void,
  options = { threshold: 100 }
) {
  const handleScroll = useCallback(() => {
    if (!ref.current) return;

    const { scrollTop, scrollHeight, clientHeight } = ref.current;
    const scrolledToBottom = scrollHeight - scrollTop - clientHeight < options.threshold;

    if (scrolledToBottom) {
      callback();
    }
  }, [callback, options.threshold]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.addEventListener('scroll', handleScroll);
    return () => element.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);
}