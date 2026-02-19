interface Faq {
  q: string;
  a: string;
}

const faqs: Faq[] = [
  {
    q: 'How are classes conducted?',
    a: 'Classes are delivered through structured live sessions, recorded lessons, and guided practice modules for consistent learning.',
  },
  {
    q: 'Can I access content offline?',
    a: 'Yes, key learning resources are cached for smooth access even on low or unstable internet connections.',
  },
  {
    q: 'How do I track my progress?',
    a: 'You can monitor performance using weekly analytics, teacher feedback, and assessment scores inside your dashboard.',
  },
  {
    q: 'Are doubt-solving sessions available?',
    a: 'Dedicated doubt-clearing sessions and teacher chat support are available to ensure concept clarity.',
  },
];

export class Faqutil {
  static getFaqData(): Faq[] {
    return faqs;
  }
}
