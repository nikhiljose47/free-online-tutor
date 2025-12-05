export class Validator {
  static isEmail(value: string): boolean {
    if (!value) return false;
    return /^[\w.-]+@[\w.-]+\.\w{2,}$/.test(value.trim());
  }

  static isPassword(value: string, min = 6): boolean {
    return !!value && value.length >= min;
  }

  static isNonEmpty(value: string): boolean {
    return value != null && value.trim().length > 0;
  }

  static isUsername(value: string): boolean {
    if (!value) return false;
    return /^[a-zA-Z0-9_]{3,20}$/.test(value);
  }

  static isMobile(value: string): boolean {
    if (!value) return false;
    return /^[6-9]\d{9}$/.test(value); // India mobile pattern
  }

  static isMeetingLink(value: string): boolean {
    if (!value) return false;
    const v = value.trim();

    const patterns = [
      /https:\/\/meet\.google\.com\/[a-zA-Z0-9-]+/, // Google Meet
      /https:\/\/zoom\.us\/j\/\d+/, // Zoom
      /https:\/\/us\d*\.zoom\.us\/j\/\d+/, // Zoom Region
      /https:\/\/teams\.microsoft\.com\/[a-zA-Z0-9/=?&.-]+/, // MS Teams
      /https:\/\/meet\.jit\.si\/[a-zA-Z0-9-]+/, // Jitsi
      /https:\/\/.*webex\.com\/meet\/[a-zA-Z0-9.-]+/, // Webex
    ];

    return patterns.some((p) => p.test(v));
  }

  static minLength(value: string, count: number): boolean {
    return !!value && value.length >= count;
  }

  static maxLength(value: string, count: number): boolean {
    return !!value && value.length <= count;
  }

  static matches(value: string, regex: RegExp): boolean {
    return regex.test(value);
  }
}
