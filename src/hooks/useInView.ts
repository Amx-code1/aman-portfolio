
import { useEffect, useRef, useState } from 'react';

interface InViewOptions extends IntersectionObserverInit {
  once?: boolean;
}

export function useInView<T extends HTMLElement = HTMLDivElement>(
  options: InViewOptions = {}
) {
  const { once = true, threshold = 0.2, rootMargin = '0px 0px -10% 0px', root } = options;
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin, root }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once, threshold, rootMargin, root]);

  return { ref, inView };
}
