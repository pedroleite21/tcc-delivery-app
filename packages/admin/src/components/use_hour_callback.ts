import * as React from 'react';

type TimerType = ReturnType<typeof setTimeout>;

export default function useHourCallback(callback?: () => void) {
  const timeoutRef = React.useRef<TimerType>();

  function checkNewHour() {
    const now = new Date();
    if (now.getMinutes() === 0) {
      callback?.();
    }
  }

  React.useEffect(() => {
    timeoutRef.current = setTimeout(checkNewHour, 60000);

    return () => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);
}
