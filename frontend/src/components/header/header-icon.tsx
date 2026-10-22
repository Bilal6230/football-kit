import type { SVGProps } from "react";

export function HeaderIcon({ name, ...props }: SVGProps<SVGSVGElement> & { name: "search" | "bag" | "menu" | "close" }) {
  const paths = {
    search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></>,
    bag: <><path d="M5 7h14l1 14H4L5 7Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></>,
    menu: <><path d="M3 7h18M3 17h18" /></>,
    close: <path d="m6 6 12 12M6 18 18 6" />,
  };
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name]}</svg>;
}
