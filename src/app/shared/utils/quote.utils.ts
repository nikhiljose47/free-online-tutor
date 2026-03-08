// utils/quote.util.ts
import { MOTIVATION_QUOTES } from '../../core/constants/motivation-quotes';
import { Quote } from '../../models/quote.model';

export class QuoteUtil {
  static getRandom(): Quote {
    const index = Math.floor(Math.random() * MOTIVATION_QUOTES.length);
    var data = MOTIVATION_QUOTES[index];
    if (!data.author) {
      data.author = 'Author unknown';
    }
    return data;
  }

  static getQuoteOfDay(): Quote {
    const today = new Date();
    const key = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

    const index = key % MOTIVATION_QUOTES.length;

    const data = { ...MOTIVATION_QUOTES[index] };

    if (!data.author) {
      data.author = 'Author unknown';
    }

    return data;
  }
}
