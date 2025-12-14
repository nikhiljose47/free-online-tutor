// utils/quote.util.ts
import { MOTIVATION_QUOTES } from '../core/constants/motivation-quotes';
import { Quote } from '../models/quote.model';

export class QuoteUtil {
  static getRandom(): Quote {
    const index = Math.floor(Math.random() * MOTIVATION_QUOTES.length);
    return MOTIVATION_QUOTES[index];
  }
}
