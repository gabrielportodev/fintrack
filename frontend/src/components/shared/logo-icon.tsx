export const LogoIcon = ({ size = 30 }: { size?: number }) => (
  <svg width={size} height={size} viewBox='0 0 24 24' fill='none'>
    <rect x='2' y='2' width='20' height='20' rx='6' fill='#6366F1' />
    <path d='M8 16V8h7' stroke='#fff' strokeWidth='2.2' strokeLinecap='round' />
    <path d='M8 12h5' stroke='#fff' strokeWidth='2.2' strokeLinecap='round' />
    <circle cx='16.5' cy='15.5' r='2' stroke='#fff' strokeWidth='1.8' />
  </svg>
)
