import { ClassSyllabus } from '../../../models/syllabus.model';

export const GENERAL_APTITUDE_SYLLABUS: ClassSyllabus = {
  class: 'General Aptitude',
  code_prefix: 'SYLL-GA',
  desc: 'General Aptitude course for GATE and competitive exams',
  meta: '2-month structured syllabus covering Quantitative, Verbal, and Reasoning aptitude',
  subjects: {
    'General Aptitude': {
      code: 'GA-APT',
      chapters: [
        // WEEK 1–2: Quantitative Basics
        {
          code: 'GA-APT-01',
          name: 'Numbers and Number Systems',
          desc: 'Understanding number types, properties, and operations required for quick calculations.',
        },
        {
          code: 'GA-APT-02',
          name: 'LCM, HCF, and Divisibility Rules',
          desc: 'Learn fast methods to solve divisibility, factor, and multiple-based exam problems.',
        },
        {
          code: 'GA-APT-03',
          name: 'Fractions, Decimals, and Percentages',
          desc: 'Master conversions and applications commonly asked in aptitude exams.',
        },
        {
          code: 'GA-APT-04',
          name: 'Ratio and Proportion',
          desc: 'Build strong fundamentals to solve comparison and distribution-based problems.',
        },

        // WEEK 3: Algebra & Equations
        {
          code: 'GA-APT-05',
          name: 'Linear Equations and Inequalities',
          desc: 'Solve single and multi-variable equations with logical interpretation.',
        },
        {
          code: 'GA-APT-06',
          name: 'Quadratic Equations and Roots',
          desc: 'Understand roots, nature of equations, and shortcut techniques.',
        },
        {
          code: 'GA-APT-07',
          name: 'Algebraic Expressions and Simplification',
          desc: 'Learn simplification strategies to reduce calculation time.',
        },

        // WEEK 4: Arithmetic Applications
        {
          code: 'GA-APT-08',
          name: 'Averages and Weighted Mean',
          desc: 'Apply averaging concepts to real exam-style scenarios.',
        },
        {
          code: 'GA-APT-09',
          name: 'Time and Work',
          desc: 'Solve work-efficiency and combined-work problems using standard models.',
        },
        {
          code: 'GA-APT-10',
          name: 'Time, Speed, and Distance',
          desc: 'Understand motion-based problems with shortcuts and graphical intuition.',
        },
        {
          code: 'GA-APT-11',
          name: 'Simple and Compound Interest',
          desc: 'Learn interest calculations with practical exam-focused approaches.',
        },

        // WEEK 5: Geometry & Data
        {
          code: 'GA-APT-12',
          name: 'Basic Geometry and Mensuration',
          desc: 'Cover shapes, areas, volumes, and key formulas needed for aptitude exams.',
        },
        {
          code: 'GA-APT-13',
          name: 'Coordinate Geometry (Basics)',
          desc: 'Understand distance, slope, and line equations with visual clarity.',
        },
        {
          code: 'GA-APT-14',
          name: 'Data Interpretation (Tables, Charts, Graphs)',
          desc: 'Analyze numerical data efficiently using tables, bar charts, and graphs.',
        },

        // WEEK 6: Logical Reasoning
        {
          code: 'GA-APT-15',
          name: 'Logical Reasoning and Deduction',
          desc: 'Develop logical thinking through statements, conclusions, and deductions.',
        },
        {
          code: 'GA-APT-16',
          name: 'Analytical Reasoning and Puzzles',
          desc: 'Practice structured problem-solving through puzzles and case-based reasoning.',
        },
        {
          code: 'GA-APT-17',
          name: 'Series, Patterns, and Analogies',
          desc: 'Identify patterns and relationships to solve sequence-based questions.',
        },

        // WEEK 7: Verbal Ability
        {
          code: 'GA-APT-18',
          name: 'Reading Comprehension Techniques',
          desc: 'Improve reading speed and comprehension accuracy for exam passages.',
        },
        {
          code: 'GA-APT-19',
          name: 'Sentence Completion and Vocabulary Usage',
          desc: 'Strengthen contextual vocabulary and sentence logic.',
        },
        {
          code: 'GA-APT-20',
          name: 'Grammar, Tenses, and Articles',
          desc: 'Learn essential grammar rules frequently tested in exams.',
        },
        {
          code: 'GA-APT-21',
          name: 'Critical Reasoning and Paragraph Logic',
          desc: 'Analyze arguments and paragraph flow with logical clarity.',
        },

        // WEEK 8: Exam Strategy & Practice
        {
          code: 'GA-APT-22',
          name: 'Previous Year GATE GA Questions (Topic-wise)',
          desc: 'Solve and analyze past GATE aptitude questions topic by topic.',
        },
        {
          code: 'GA-APT-23',
          name: 'Mixed Practice Sets and Shortcuts',
          desc: 'Apply shortcuts and mixed-question practice to improve speed.',
        },
        {
          code: 'GA-APT-24',
          name: 'Full-Length Aptitude Mock Tests',
          desc: 'Attempt full mocks to simulate real exam conditions.',
        },
        {
          code: 'GA-APT-25',
          name: 'Revision, Mistake Analysis, and Exam Strategy',
          desc: 'Quick revision, mini tests, and one-to-one discussion on mistakes and strategy.',
        },
      ],
    },
  },
};
