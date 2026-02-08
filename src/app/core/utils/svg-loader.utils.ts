export interface SvgCardConfig {
  title: string;
  start: string;
  end: string;
  size?: number;
}

export function buildSvg(
  template: string,
  cfg: SvgCardConfig
): string {
  return template
    .replace('__TITLE__', cfg.title)
    .replace('__START__', cfg.start)
    .replace('__END__', cfg.end)
    .replace('__SIZE__', String(cfg.size ?? 42));
}