import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function LayoutDashboard(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path
        strokeWidth="1.5"
        d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM13 5a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM13 13a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1v-6zM4 13a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z"
      />
    </svg>
  );
}

export function LineChart(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path
        strokeWidth="1.5"
        strokeLinecap="round"
        d="M4 19h16M7 16l4-6 4 4 4-10"
      />
    </svg>
  );
}

export function Briefcase(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path
        strokeWidth="1.5"
        d="M9 7V6a2 2 0 012-2h2a2 2 0 012 2v1M4 9h16v9a2 2 0 01-2 2H6a2 2 0 01-2-2V9z"
      />
    </svg>
  );
}

export function Bot(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path
        strokeWidth="1.5"
        strokeLinecap="round"
        d="M9.5 9.5h.01M14.5 9.5h.01M9 15h6M8 5h8v3H8V5zM6 8H4v8h2M18 8h2v8h-2"
      />
    </svg>
  );
}

export function Settings(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path
        strokeWidth="1.5"
        strokeLinecap="round"
        d="M12 15a3 3 0 100-6 3 3 0 000 6zM19 12h2M3 12h2m13-7l1.5-1.5M4.5 19.5L6 18m12 0l1.5 1.5M4.5 4.5L6 6"
      />
    </svg>
  );
}
