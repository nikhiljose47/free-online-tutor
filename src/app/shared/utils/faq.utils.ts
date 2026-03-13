interface Faq {
  q: string;
  a: string;
}

const faqs: Faq[] = [
  {
    q: 'How are classes conducted?',
    a: 'All classes are conducted live by experienced teachers. Students join scheduled sessions where concepts are explained, examples are solved, and questions are discussed in real time.',
  },
  {
    q: 'Do students learn individually or together?',
    a: 'Students learn together in live interactive sessions. This collaborative environment encourages participation, discussion, and better understanding of concepts.',
  },
  {
    q: 'Are the courses organized by class?',
    a: 'Yes. Each class has its own structured course designed according to the syllabus and learning level of that grade.',
  },
  {
    q: 'Can students ask questions during the class?',
    a: 'Yes. Students can ask questions during the live session, and teachers address them instantly to ensure clear understanding.',
  },
  {
    q: 'What if I miss a live class?',
    a: 'Important lessons and materials are available for review so students can catch up and continue learning smoothly.',
  },
  {
    q: 'Is there support if I face issues while using the platform?',
    a: 'Yes. Our support team is available to help with technical or course-related issues. You can contact us anytime through the support section.',
  },
  {
    q: 'How do I track my learning progress?',
    a: 'Students can track progress through practice activities, assignments, and teacher feedback provided during the course.',
  },
  {
    q: 'Are the classes interactive?',
    a: 'Yes. Classes are designed to be interactive with discussions, questions, and guided problem solving so students stay actively engaged.',
  },
  {
    q: 'Do teachers guide students during the course?',
    a: 'Yes. Teachers guide students step by step throughout the course, helping them understand concepts clearly and build confidence.',
  },
];

export class FaqUtil {
  static getFaqData(): Faq[] {
    return faqs;
  }
}
