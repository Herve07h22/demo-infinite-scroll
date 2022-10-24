import React, { ReactElement, useEffect, useRef } from "react";
import useOnScreen from "./useOnScreen";

export const ObserveVisibility: React.FC<{
  children: ReactElement;
  onVisibilityChange?: (visible: boolean) => void;
}> = ({ children, onVisibilityChange }) => {
  const ref = useRef(null);
  const isVisible = useOnScreen(ref);
  useEffect(() => {
    if (onVisibilityChange) onVisibilityChange(isVisible);
  }, [isVisible]);

  const style = { opacity: isVisible ? 1 : 0 };

  return (
    <div
      className="transition-opacity delay-150 duration-500 ease-out opacity-0"
      style={style}
      ref={ref}
    >
      {children}
    </div>
  );
};
