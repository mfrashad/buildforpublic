type StarProps = React.SVGProps<SVGSVGElement> & {
  color?: string;
  size?: number;
  stroke?: string;
  strokeWidth?: number;
};

export function Star1({ color = "currentColor", size, stroke, strokeWidth, ...props }: StarProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 200 200" width={size} height={size} {...props}>
      <path fill={color} stroke={stroke} strokeWidth={strokeWidth}
        d="M158.682 195 100 127.008 41.219 195l43.344-79.687L5 77.551l85.5 18.732L100 5l9.5 91.283L195 77.65l-79.661 37.663z" />
    </svg>
  );
}

export function Star6({ color = "currentColor", size, stroke, strokeWidth, ...props }: StarProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 200 200" width={size} height={size} {...props}>
      <path fill={color} stroke={stroke} strokeWidth={strokeWidth}
        d="m100 5 25.659 69.341L195 100l-69.341 25.659L100 195l-25.659-69.341L5 100l69.341-25.659z" />
    </svg>
  );
}

export function Star3({ color = "currentColor", size, stroke, strokeWidth, ...props }: StarProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 200 200" width={size} height={size} {...props}>
      <path fill={color} stroke={stroke} strokeWidth={strokeWidth}
        d="m100 5 3.277 63.822 16.475-61.746-10.064 63.108 28.952-56.97-22.965 59.636 40.165-49.707-34.863 53.56 49.622-40.27-45.236 45.14L182.272 52.5 128.64 87.249l61.71-16.606-59.685 22.839 63.815-3.412-63.13 9.93 63.13 9.93-63.815-3.412 59.685 22.839-61.71-16.606 53.632 34.749-56.909-29.073 45.236 45.14-49.622-40.269 34.863 53.559-40.165-49.707 22.965 59.637-28.952-56.971 10.064 63.108-16.475-61.746L100 195l-3.277-63.822-16.475 61.746 10.064-63.108-28.952 56.971 22.965-59.637-40.165 49.707 34.863-53.559L29.4 163.567l45.236-45.14-56.91 29.073 53.633-34.749-61.71 16.606 59.685-22.839L5.52 109.93 68.65 100 5.52 90.07l63.815 3.412L9.65 70.643 71.36 87.25 17.728 52.5l56.91 29.073L29.4 36.433l49.622 40.27-34.863-53.56L84.325 72.85 61.36 13.213l28.952 56.971L80.248 7.076l16.475 61.746z" />
    </svg>
  );
}

export function Star4({ color = "currentColor", size, stroke, strokeWidth, ...props }: StarProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 200 200" width={size} height={size} {...props}>
      <path fill={color} stroke={stroke} strokeWidth={strokeWidth}
        d="M158.727 195 100 150.193 41.273 195l22.353-72.545L5 77.545l72.546-.101L100 5l22.455 72.444 72.545.102-58.626 44.909z" />
    </svg>
  );
}
