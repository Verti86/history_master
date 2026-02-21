"use client";

import { useEffect, useState } from "react";

type Props = { xp: number; show: boolean; onDone?: () => void };

export function XpToast({ xp, show, onDone }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!show || xp <= 0) return;
    setVisible(true);
    const t = setTimeout(() => {
      setVisible(false);
      onDone?.();
    }, 2500);
    return () => clearTimeout(t);
  }, [show, xp, onDone]);

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-full bg-[#ffbd45] text-[#0e1117] font-bold text-lg shadow-lg animate-bounce"
      role="status"
      aria-live="polite"
    >
      +{xp} XP
    </div>
  );
}
