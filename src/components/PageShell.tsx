import { ReactNode } from "react";

interface PageShellProps {
  children: ReactNode;
  className?: string;
}

export default function PageShell({ children, className = "" }: PageShellProps) {
  return (
    <div
      className={`flex w-full max-w-xl flex-col items-center justify-center gap-3 px-4 py-1 text-center sm:max-w-2xl sm:gap-4 sm:px-6 md:max-w-3xl ${className}`}
    >
      {children}
    </div>
  );
}
