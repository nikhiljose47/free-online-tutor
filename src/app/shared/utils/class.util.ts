export class ClassUtil {
  
  static getNextCode(input: string): string {
    const parts = input.split('-');
    const last = parts[parts.length - 1];

    // ----- numeric (any length) -----
    if (/^\d+$/.test(last)) {
      const next = (parseInt(last, 10) + 1).toString();

      // preserve leading zero format if originally padded
      const padded =
        last.length > 1 && last.startsWith('0') ? next.padStart(last.length, '0') : next;

      parts[parts.length - 1] = padded;
      return parts.join('-');
    }

    // ----- single uppercase letter -----
    if (/^[A-Z]$/.test(last)) {
      const nextChar = String.fromCharCode(last.charCodeAt(0) + 1);
      parts[parts.length - 1] = nextChar;
      return parts.join('-');
    }

    return input;
  }

  static isDivision(input: string): boolean {
    const parts = input.split('-');
    const last = parts[parts.length - 1];
    return /^[A-Z]$/.test(last);
  }

  static convertToClassId(input: string): string {
    const parts = input.split('-');
    parts.pop();
    return parts.join('-');
  }

  static convertToDivisionId(input: string): string {
    const parts = input.split('-');
    parts.push('A');
    return parts.join('-');
  }
}
