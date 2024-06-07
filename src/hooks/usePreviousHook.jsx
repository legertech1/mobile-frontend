import { useEffect, useRef } from "react";

const usePreviousHook = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export default usePreviousHook;
