import { Player } from "@lordicon/react";
import { useEffect, useRef } from "react";
export default function Play({ icon, once }) {
  const playerRef = useRef();

  useEffect(() => {
    playerRef.current?.playFromBeginning();
    if (!once) {
      const int = setInterval(
        () => playerRef.current?.playFromBeginning(),
        5000
      );
      return () => clearInterval(int);
    }
  }, []);

  return <Player ref={playerRef} icon={icon} />;
}
