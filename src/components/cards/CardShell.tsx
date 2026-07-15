import type { CSSProperties, ReactNode } from "react";
import { getTiltDeg } from "@/lib/tilt";

export function CardShell({
  id,
  index,
  children,
  className,
}: {
  id: string;
  index: number;
  children: ReactNode;
  className?: string;
}) {
  const tilt = getTiltDeg(id);
  const delay = Math.min(index * 40, 400);
  const style = {
    "--tilt": `${tilt}deg`,
    "--enter-delay": `${delay}ms`,
  } as CSSProperties;

  return (
    <div
      className={`card-tilt card-enter relative mb-6 break-inside-avoid rounded-sm border border-line/60 bg-paper-3 p-5 shadow-sm ${className ?? ""}`}
      style={style}
    >
      {children}
    </div>
  );
}
