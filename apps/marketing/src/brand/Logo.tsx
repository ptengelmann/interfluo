import type { CSSProperties } from 'react';

type Variant = 'lockup' | 'mark' | 'wordmark' | 'stacked';
type Tone = 'ink' | 'paper';

const INK = '#17181C';
const PAPER = '#F5F1E9';

export function Logo({
  variant = 'lockup',
  tone = 'ink',
  size = 40,
  className,
  style,
}: {
  variant?: Variant;
  tone?: Tone;
  size?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const color = tone === 'paper' ? PAPER : INK;
  const divider = tone === 'paper' ? 'rgba(245,241,233,0.25)' : '#D8D1C2';

  const mark: CSSProperties = {
    fontFamily: "'Instrument Serif', Georgia, serif",
    fontStyle: 'italic',
    fontWeight: 400,
    letterSpacing: '-0.02em',
    fontSize: size,
    lineHeight: 1,
    color,
  };
  const wordmark: CSSProperties = {
    fontFamily: "'Hanken Grotesk', system-ui, sans-serif",
    fontWeight: 600,
    letterSpacing: '-0.015em',
    fontSize: size * 0.82,
    lineHeight: 1,
    color,
  };

  if (variant === 'mark') {
    return (
      <span className={className} style={{ ...mark, ...style }}>
        if
      </span>
    );
  }
  if (variant === 'wordmark') {
    return (
      <span className={className} style={{ ...wordmark, fontSize: size, ...style }}>
        Interfluo
      </span>
    );
  }
  if (variant === 'stacked') {
    return (
      <span
        className={className}
        style={{
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: size * 0.12,
          ...style,
        }}
      >
        <span style={mark}>if</span>
        <span style={{ ...wordmark, fontSize: size * 0.42, letterSpacing: '0.02em' }}>
          Interfluo
        </span>
      </span>
    );
  }

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: size * 0.36,
        ...style,
      }}
    >
      <span style={mark}>if</span>
      <span style={{ width: 1, height: size * 0.72, background: divider }} />
      <span style={wordmark}>Interfluo</span>
    </span>
  );
}

export default Logo;
