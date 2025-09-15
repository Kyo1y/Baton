// components/Logo.tsx
import * as React from "react";
import Link from "next/link";

export function LogoMark({
  className = "",
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 177 122"
      aria-hidden="true"
      className={
        "h-20 w-20 [&>path]:transition-colors [&>path]:fill-transparent" +
        className
      }
      {...props}
    >
      <path
        d="M149.571 94.4505C106.58 14.5468 76.2248 19.3477 84.9741 93.3444L30.9753 14.8378L175.562 14.2813L149.571 94.4505Z"
        className="stroke-current"
      />
      <path
        d="M139.46 102.374C96.4695 22.4708 66.1139 27.2717 74.8632 101.268L20.8644 22.7618L165.451 22.2052L139.46 102.374Z"
        className="stroke-current"
      />
      <path
        d="M124.93 114.616C81.9388 34.7123 51.5832 39.5132 60.3326 113.51L6.33377 35.0033L150.92 34.4468L124.93 114.616Z"
        className="stroke-current"
      />
    </svg>
  );
}

export function BrandLogo() {
  return (
    <Link href="/" aria-label="Home" className="group inline-flex items-center">
      {/* stroke uses currentColor; fill becomes orange on hover */}
      <LogoMark className="text-foreground group-hover:[&>path]:fill-[#F8831E]" />
    </Link>
  );
}
