import { ClassSyllabus2 } from '../../../models/syllabus.model';

export const CLASS8_SYLLABUS: ClassSyllabus2 = {
  class: 'Class 8',
  code_prefix: 'SYLL-CL08',
  desc: 'Complete Class 8 syllabus aligned with NCERT and CBSE curriculum',
  meta: 'Conceptual depth, real-world applications, and exam readiness',
  subjects: {
    // ================= MATHEMATICS =================
    Mathematics: {
      code: 'CL08-MATH',
      chapters: [
        {
          code: 'CL08-MATH-01',
          name: 'Rational Numbers',
          desc: 'Extension of number system with properties and operations.',
          meta: 'Foundation for algebra and higher mathematics',
          divisions: [
            {
              code: 'CL08-MATH-01-A',
              name: 'Properties of Rational Numbers',
              desc: 'Closure, commutativity, associativity, and identity.',
              meta: 'Concept clarity and logical reasoning',
            },
            {
              code: 'CL08-MATH-01-B',
              name: 'Operations on Rational Numbers',
              desc: 'Addition, subtraction, multiplication, and division.',
              meta: 'Accuracy and simplification skills',
            },
          ],
        },

        {
          code: 'CL08-MATH-02',
          name: 'Linear Equations in One Variable',
          desc: 'Solving equations involving one unknown.',
          meta: 'Problem-solving and algebraic thinking',
          divisions: [
            {
              code: 'CL08-MATH-02-A',
              name: 'Solving Linear Equations',
              desc: 'Step-by-step solution techniques.',
              meta: 'Algebraic manipulation',
            },
            {
              code: 'CL08-MATH-02-B',
              name: 'Word Problems',
              desc: 'Real-life applications using equations.',
              meta: 'Translation of statements to equations',
            },
          ],
        },

        {
          code: 'CL08-MATH-03',
          name: 'Understanding Quadrilaterals',
          desc: 'Study of polygons with focus on quadrilaterals.',
          meta: 'Geometry fundamentals',
          divisions: [
            {
              code: 'CL08-MATH-03-A',
              name: 'Types of Quadrilaterals',
              desc: 'Parallelogram, rectangle, square, rhombus.',
              meta: 'Shape recognition',
            },
            {
              code: 'CL08-MATH-03-B',
              name: 'Angle Properties',
              desc: 'Interior angles and their sum.',
              meta: 'Logical deductions',
            },
          ],
        },

        {
          code: 'CL08-MATH-04',
          name: 'Practical Geometry',
          desc: 'Geometrical constructions.',
          meta: 'Hands-on geometry skills',
          divisions: [
            {
              code: 'CL08-MATH-04-A',
              name: 'Constructing Quadrilaterals',
              desc: 'Using given measurements.',
              meta: 'Precision and accuracy',
            },
            {
              code: 'CL08-MATH-04-B',
              name: 'Construction Logic',
              desc: 'Understanding steps and constraints.',
              meta: 'Visualization skills',
            },
          ],
        },

        {
          code: 'CL08-MATH-05',
          name: 'Data Handling',
          desc: 'Collection and analysis of data.',
          meta: 'Statistical awareness',
          divisions: [
            {
              code: 'CL08-MATH-05-A',
              name: 'Organizing Data',
              desc: 'Frequency tables and grouping.',
              meta: 'Data organization',
            },
            {
              code: 'CL08-MATH-05-B',
              name: 'Graphs and Probability',
              desc: 'Bar graphs, pie charts, probability basics.',
              meta: 'Interpretation skills',
            },
          ],
        },

        {
          code: 'CL08-MATH-06',
          name: 'Squares and Square Roots',
          desc: 'Understanding square numbers and roots.',
          meta: 'Number fluency',
          divisions: [
            {
              code: 'CL08-MATH-06-A',
              name: 'Square Numbers',
              desc: 'Patterns and properties.',
              meta: 'Number sense',
            },
            {
              code: 'CL08-MATH-06-B',
              name: 'Finding Square Roots',
              desc: 'Prime factorization and estimation.',
              meta: 'Speed methods',
            },
          ],
        },

        {
          code: 'CL08-MATH-07',
          name: 'Cubes and Cube Roots',
          desc: 'Cubic numbers and cube roots.',
          meta: 'Higher power concepts',
          divisions: [
            {
              code: 'CL08-MATH-07-A',
              name: 'Cube Numbers',
              desc: 'Patterns and properties.',
              meta: 'Concept reinforcement',
            },
            {
              code: 'CL08-MATH-07-B',
              name: 'Finding Cube Roots',
              desc: 'Prime factorization method.',
              meta: 'Problem-solving',
            },
          ],
        },

        {
          code: 'CL08-MATH-08',
          name: 'Comparing Quantities',
          desc: 'Ratios, percentages, and financial math.',
          meta: 'Everyday mathematics',
          divisions: [
            {
              code: 'CL08-MATH-08-A',
              name: 'Percentages and Ratios',
              desc: 'Conversions and comparisons.',
              meta: 'Practical math',
            },
            {
              code: 'CL08-MATH-08-B',
              name: 'Profit, Loss and Discount',
              desc: 'Commercial arithmetic.',
              meta: 'Real-world application',
            },
          ],
        },

        {
          code: 'CL08-MATH-09',
          name: 'Algebraic Expressions and Identities',
          desc: 'Operations on algebraic expressions.',
          meta: 'Symbolic manipulation',
          divisions: [
            {
              code: 'CL08-MATH-09-A',
              name: 'Algebraic Expressions',
              desc: 'Terms, coefficients, operations.',
              meta: 'Expression handling',
            },
            {
              code: 'CL08-MATH-09-B',
              name: 'Identities',
              desc: 'Standard algebraic identities.',
              meta: 'Formula application',
            },
          ],
        },

        {
          code: 'CL08-MATH-10',
          name: 'Visualising Solid Shapes',
          desc: '3D shapes and their representations.',
          meta: 'Spatial understanding',
          divisions: [
            {
              code: 'CL08-MATH-10-A',
              name: '3D Shapes',
              desc: 'Vertices, edges, faces.',
              meta: 'Shape recognition',
            },
            {
              code: 'CL08-MATH-10-B',
              name: 'Views and Nets',
              desc: 'Top, front, side views.',
              meta: 'Visualization skills',
            },
          ],
        },

        {
          code: 'CL08-MATH-11',
          name: 'Mensuration',
          desc: 'Measurement of area and volume.',
          meta: 'Formula-based problem solving',
          divisions: [
            {
              code: 'CL08-MATH-11-A',
              name: 'Area of Plane Figures',
              desc: 'Trapezium, polygon.',
              meta: 'Accuracy',
            },
            {
              code: 'CL08-MATH-11-B',
              name: 'Surface Area and Volume',
              desc: 'Cube, cuboid, cylinder.',
              meta: 'Application-based problems',
            },
          ],
        },

        {
          code: 'CL08-MATH-12',
          name: 'Exponents and Powers',
          desc: 'Use of powers for large numbers.',
          meta: 'Scientific notation readiness',
          divisions: [
            {
              code: 'CL08-MATH-12-A',
              name: 'Laws of Exponents',
              desc: 'Standard exponent rules.',
              meta: 'Simplification skills',
            },
            {
              code: 'CL08-MATH-12-B',
              name: 'Standard Form',
              desc: 'Very large and small numbers.',
              meta: 'Scientific thinking',
            },
          ],
        },

        {
          code: 'CL08-MATH-13',
          name: 'Direct and Inverse Proportions',
          desc: 'Relationship between quantities.',
          meta: 'Logical reasoning',
          divisions: [
            {
              code: 'CL08-MATH-13-A',
              name: 'Direct Proportion',
              desc: 'Linear relationships.',
              meta: 'Concept application',
            },
            {
              code: 'CL08-MATH-13-B',
              name: 'Inverse Proportion',
              desc: 'Opposite relationships.',
              meta: 'Analytical thinking',
            },
          ],
        },

        {
          code: 'CL08-MATH-14',
          name: 'Factorisation',
          desc: 'Breaking expressions into factors.',
          meta: 'Algebra mastery',
          divisions: [
            {
              code: 'CL08-MATH-14-A',
              name: 'Common Factor Method',
              desc: 'Factorization techniques.',
              meta: 'Stepwise logic',
            },
            {
              code: 'CL08-MATH-14-B',
              name: 'Using Identities',
              desc: 'Applying algebraic identities.',
              meta: 'Efficiency',
            },
          ],
        },

        {
          code: 'CL08-MATH-15',
          name: 'Introduction to Graphs',
          desc: 'Graphical representation of equations.',
          meta: 'Coordinate geometry base',
          divisions: [
            {
              code: 'CL08-MATH-15-A',
              name: 'Cartesian Plane',
              desc: 'Coordinates and axes.',
              meta: 'Graph basics',
            },
            {
              code: 'CL08-MATH-15-B',
              name: 'Linear Graphs',
              desc: 'Plotting equations.',
              meta: 'Visualization',
            },
          ],
        },

        {
          code: 'CL08-MATH-16',
          name: 'Playing with Numbers',
          desc: 'Patterns and number tricks.',
          meta: 'Mathematical curiosity',
          divisions: [
            {
              code: 'CL08-MATH-16-A',
              name: 'Number Patterns',
              desc: 'Divisibility and patterns.',
              meta: 'Logical play',
            },
            {
              code: 'CL08-MATH-16-B',
              name: 'Puzzles and Tricks',
              desc: 'Fun with numbers.',
              meta: 'Interest building',
            },
          ],
        },
      ],
    },

    // ================= SCIENCE =================
    Science: {
      code: 'CL08-SCI',
      chapters: [
        {
          code: 'CL08-SCI-01',
          name: 'Crop Production and Management',
          desc: 'Agricultural practices involved in growing crops.',
          meta: 'Food security and sustainable farming',
          divisions: [
            {
              code: 'CL08-SCI-01-A',
              name: 'Agricultural Practices',
              desc: 'Preparation of soil, sowing, irrigation, harvesting.',
              meta: 'Process understanding',
            },
            {
              code: 'CL08-SCI-01-B',
              name: 'Crop Protection and Storage',
              desc: 'Weeds, pests, fertilizers, and storage methods.',
              meta: 'Practical application',
            },
          ],
        },

        {
          code: 'CL08-SCI-02',
          name: 'Microorganisms: Friend and Foe',
          desc: 'Study of microorganisms and their effects.',
          meta: 'Health and environment awareness',
          divisions: [
            {
              code: 'CL08-SCI-02-A',
              name: 'Useful Microorganisms',
              desc: 'Microbes in food, medicine, and industry.',
              meta: 'Positive applications',
            },
            {
              code: 'CL08-SCI-02-B',
              name: 'Harmful Microorganisms',
              desc: 'Diseases, prevention, and preservation.',
              meta: 'Health safety',
            },
          ],
        },

        {
          code: 'CL08-SCI-03',
          name: 'Synthetic Fibres and Plastics',
          desc: 'Man-made fibres and plastic materials.',
          meta: 'Material science basics',
          divisions: [
            {
              code: 'CL08-SCI-03-A',
              name: 'Synthetic Fibres',
              desc: 'Rayon, nylon, polyester, acrylic.',
              meta: 'Material properties',
            },
            {
              code: 'CL08-SCI-03-B',
              name: 'Plastics and Environment',
              desc: 'Plastic types, hazards, and recycling.',
              meta: 'Environmental responsibility',
            },
          ],
        },

        {
          code: 'CL08-SCI-04',
          name: 'Materials: Metals and Non-metals',
          desc: 'Properties and uses of metals and non-metals.',
          meta: 'Chemical classification',
          divisions: [
            {
              code: 'CL08-SCI-04-A',
              name: 'Physical Properties',
              desc: 'Hardness, conductivity, malleability.',
              meta: 'Observation skills',
            },
            {
              code: 'CL08-SCI-04-B',
              name: 'Uses and Corrosion',
              desc: 'Applications and rusting.',
              meta: 'Real-world relevance',
            },
          ],
        },

        {
          code: 'CL08-SCI-05',
          name: 'Coal and Petroleum',
          desc: 'Natural resources used as fuels.',
          meta: 'Energy awareness',
          divisions: [
            {
              code: 'CL08-SCI-05-A',
              name: 'Fossil Fuels',
              desc: 'Coal, petroleum, natural gas.',
              meta: 'Energy sources',
            },
            {
              code: 'CL08-SCI-05-B',
              name: 'Conservation of Resources',
              desc: 'Petrochemicals and alternatives.',
              meta: 'Sustainability',
            },
          ],
        },

        {
          code: 'CL08-SCI-06',
          name: 'Combustion and Flame',
          desc: 'Burning of substances and flame structure.',
          meta: 'Basic chemistry of fire',
          divisions: [
            {
              code: 'CL08-SCI-06-A',
              name: 'Types of Combustion',
              desc: 'Rapid, spontaneous, explosive combustion.',
              meta: 'Concept differentiation',
            },
            {
              code: 'CL08-SCI-06-B',
              name: 'Flame and Fuels',
              desc: 'Zones of flame and fuel efficiency.',
              meta: 'Practical science',
            },
          ],
        },

        {
          code: 'CL08-SCI-07',
          name: 'Conservation of Plants and Animals',
          desc: 'Protecting biodiversity and ecosystems.',
          meta: 'Environmental science',
          divisions: [
            {
              code: 'CL08-SCI-07-A',
              name: 'Deforestation and Effects',
              desc: 'Causes and consequences.',
              meta: 'Cause-effect analysis',
            },
            {
              code: 'CL08-SCI-07-B',
              name: 'Wildlife Protection',
              desc: 'Biosphere reserves and conservation.',
              meta: 'Ecological balance',
            },
          ],
        },

        {
          code: 'CL08-SCI-08',
          name: 'Cell – Structure and Functions',
          desc: 'Basic unit of life.',
          meta: 'Foundation of biology',
          divisions: [
            {
              code: 'CL08-SCI-08-A',
              name: 'Cell Structure',
              desc: 'Organelles and their functions.',
              meta: 'Biological understanding',
            },
            {
              code: 'CL08-SCI-08-B',
              name: 'Types of Cells',
              desc: 'Plant, animal, unicellular cells.',
              meta: 'Classification',
            },
          ],
        },

        {
          code: 'CL08-SCI-09',
          name: 'Reproduction in Animals',
          desc: 'Modes of reproduction.',
          meta: 'Life processes',
          divisions: [
            {
              code: 'CL08-SCI-09-A',
              name: 'Asexual Reproduction',
              desc: 'Binary fission, budding.',
              meta: 'Basic biology',
            },
            {
              code: 'CL08-SCI-09-B',
              name: 'Sexual Reproduction',
              desc: 'Human reproductive system.',
              meta: 'Awareness and maturity',
            },
          ],
        },

        {
          code: 'CL08-SCI-10',
          name: 'Reaching the Age of Adolescence',
          desc: 'Changes during adolescence.',
          meta: 'Health education',
          divisions: [
            {
              code: 'CL08-SCI-10-A',
              name: 'Physical and Mental Changes',
              desc: 'Puberty and growth.',
              meta: 'Self-awareness',
            },
            {
              code: 'CL08-SCI-10-B',
              name: 'Hormones and Health',
              desc: 'Role of endocrine system.',
              meta: 'Body regulation',
            },
          ],
        },

        {
          code: 'CL08-SCI-11',
          name: 'Force and Pressure',
          desc: 'Effects of force and pressure.',
          meta: 'Physics fundamentals',
          divisions: [
            {
              code: 'CL08-SCI-11-A',
              name: 'Types of Forces',
              desc: 'Contact and non-contact forces.',
              meta: 'Concept clarity',
            },
            {
              code: 'CL08-SCI-11-B',
              name: 'Pressure in Liquids and Gases',
              desc: 'Pressure effects.',
              meta: 'Application-based learning',
            },
          ],
        },

        {
          code: 'CL08-SCI-12',
          name: 'Friction',
          desc: 'Force opposing motion.',
          meta: 'Motion understanding',
          divisions: [
            {
              code: 'CL08-SCI-12-A',
              name: 'Types of Friction',
              desc: 'Static, sliding, rolling.',
              meta: 'Physics concepts',
            },
            {
              code: 'CL08-SCI-12-B',
              name: 'Reducing Friction',
              desc: 'Lubricants and streamlining.',
              meta: 'Practical applications',
            },
          ],
        },

        {
          code: 'CL08-SCI-13',
          name: 'Sound',
          desc: 'Production and propagation of sound.',
          meta: 'Wave fundamentals',
          divisions: [
            {
              code: 'CL08-SCI-13-A',
              name: 'Sound Production',
              desc: 'Vibrations and sources.',
              meta: 'Core concepts',
            },
            {
              code: 'CL08-SCI-13-B',
              name: 'Human Ear and Noise',
              desc: 'Hearing mechanism and pollution.',
              meta: 'Health awareness',
            },
          ],
        },

        {
          code: 'CL08-SCI-14',
          name: 'Chemical Effects of Electric Current',
          desc: 'Chemical reactions due to electricity.',
          meta: 'Electrochemistry basics',
          divisions: [
            {
              code: 'CL08-SCI-14-A',
              name: 'Conductors and Liquids',
              desc: 'Electric current in liquids.',
              meta: 'Experiment-based learning',
            },
            {
              code: 'CL08-SCI-14-B',
              name: 'Electroplating',
              desc: 'Applications and uses.',
              meta: 'Industrial relevance',
            },
          ],
        },

        {
          code: 'CL08-SCI-15',
          name: 'Some Natural Phenomena',
          desc: 'Lightning and earthquakes.',
          meta: 'Disaster awareness',
          divisions: [
            {
              code: 'CL08-SCI-15-A',
              name: 'Lightning',
              desc: 'Charges and lightning conductors.',
              meta: 'Safety knowledge',
            },
            {
              code: 'CL08-SCI-15-B',
              name: 'Earthquakes',
              desc: 'Causes and safety measures.',
              meta: 'Disaster preparedness',
            },
          ],
        },

        {
          code: 'CL08-SCI-16',
          name: 'Light',
          desc: 'Reflection and human vision.',
          meta: 'Optics foundation',
          divisions: [
            {
              code: 'CL08-SCI-16-A',
              name: 'Reflection of Light',
              desc: 'Laws of reflection.',
              meta: 'Physics principles',
            },
            {
              code: 'CL08-SCI-16-B',
              name: 'Human Eye',
              desc: 'Vision defects and care.',
              meta: 'Health science',
            },
          ],
        },

        {
          code: 'CL08-SCI-17',
          name: 'Stars and the Solar System',
          desc: 'Celestial bodies and space.',
          meta: 'Astronomy basics',
          divisions: [
            {
              code: 'CL08-SCI-17-A',
              name: 'Solar System',
              desc: 'Planets and satellites.',
              meta: 'Space awareness',
            },
            {
              code: 'CL08-SCI-17-B',
              name: 'Stars and Constellations',
              desc: 'Night sky patterns.',
              meta: 'Observation skills',
            },
          ],
        },

        {
          code: 'CL08-SCI-18',
          name: 'Pollution of Air and Water',
          desc: 'Environmental pollution.',
          meta: 'Environmental responsibility',
          divisions: [
            {
              code: 'CL08-SCI-18-A',
              name: 'Air Pollution',
              desc: 'Causes, effects, prevention.',
              meta: 'Public health',
            },
            {
              code: 'CL08-SCI-18-B',
              name: 'Water Pollution',
              desc: 'Contamination and purification.',
              meta: 'Sustainability',
            },
          ],
        },
      ],
    },

    // ================= ENGLISH =================
    English: {
      code: 'CL08-ENG',
      chapters: [
        // ================= PROSE (HONEYDEW) =================

        {
          code: 'CL08-ENG-01',
          name: 'The Best Christmas Present in the World',
          desc: 'A story about war, humanity, and compassion.',
          meta: 'Empathy and peace education',
          divisions: [
            {
              code: 'CL08-ENG-01-A',
              name: 'Story and Characters',
              desc: 'Narrative structure and character roles.',
              meta: 'Reading comprehension',
            },
            {
              code: 'CL08-ENG-01-B',
              name: 'Themes and Message',
              desc: 'War, brotherhood, and humanity.',
              meta: 'Value-based interpretation',
            },
          ],
        },

        {
          code: 'CL08-ENG-02',
          name: 'The Tsunami',
          desc: 'True accounts of survival during natural disasters.',
          meta: 'Disaster awareness and courage',
          divisions: [
            {
              code: 'CL08-ENG-02-A',
              name: 'Survivor Stories',
              desc: 'Real-life experiences of tsunami victims.',
              meta: 'Empathy building',
            },
            {
              code: 'CL08-ENG-02-B',
              name: 'Lessons from Nature',
              desc: 'Preparedness and resilience.',
              meta: 'Life skills',
            },
          ],
        },

        {
          code: 'CL08-ENG-03',
          name: 'Glimpses of the Past',
          desc: 'Events leading to the Indian freedom struggle.',
          meta: 'Historical awareness',
          divisions: [
            {
              code: 'CL08-ENG-03-A',
              name: 'Colonial Background',
              desc: 'British policies and impact.',
              meta: 'Contextual understanding',
            },
            {
              code: 'CL08-ENG-03-B',
              name: 'Rise of Resistance',
              desc: 'Early freedom movements.',
              meta: 'Critical reading',
            },
          ],
        },

        {
          code: 'CL08-ENG-04',
          name: 'Bepin Choudhury’s Lapse of Memory',
          desc: 'A psychological story with humor.',
          meta: 'Mind and memory',
          divisions: [
            {
              code: 'CL08-ENG-04-A',
              name: 'Plot and Suspense',
              desc: 'Memory loss and deception.',
              meta: 'Inference skills',
            },
            {
              code: 'CL08-ENG-04-B',
              name: 'Irony and Humor',
              desc: 'Twist and realization.',
              meta: 'Literary appreciation',
            },
          ],
        },

        {
          code: 'CL08-ENG-05',
          name: 'The Summit Within',
          desc: 'An account of mountain climbing.',
          meta: 'Self-discovery and courage',
          divisions: [
            {
              code: 'CL08-ENG-05-A',
              name: 'Journey to the Summit',
              desc: 'Physical challenge and achievement.',
              meta: 'Narrative understanding',
            },
            {
              code: 'CL08-ENG-05-B',
              name: 'Inner Victory',
              desc: 'Mental strength and humility.',
              meta: 'Personal growth',
            },
          ],
        },

        {
          code: 'CL08-ENG-06',
          name: 'This is Jody’s Fawn',
          desc: 'A story of compassion for animals.',
          meta: 'Sensitivity and responsibility',
          divisions: [
            {
              code: 'CL08-ENG-06-A',
              name: 'Human–Animal Bond',
              desc: 'Care and emotional connection.',
              meta: 'Empathy',
            },
            {
              code: 'CL08-ENG-06-B',
              name: 'Moral Choices',
              desc: 'Duty versus emotion.',
              meta: 'Ethical thinking',
            },
          ],
        },

        {
          code: 'CL08-ENG-07',
          name: 'A Visit to Cambridge',
          desc: 'Meeting Stephen Hawking.',
          meta: 'Inspiration and inclusion',
          divisions: [
            {
              code: 'CL08-ENG-07-A',
              name: 'Meeting the Scientist',
              desc: 'Interaction and observation.',
              meta: 'Biographical reading',
            },
            {
              code: 'CL08-ENG-07-B',
              name: 'Overcoming Disability',
              desc: 'Determination and achievement.',
              meta: 'Motivational learning',
            },
          ],
        },

        {
          code: 'CL08-ENG-08',
          name: 'A Short Monsoon Diary',
          desc: 'Nature through personal experiences.',
          meta: 'Descriptive writing',
          divisions: [
            {
              code: 'CL08-ENG-08-A',
              name: 'Seasonal Observations',
              desc: 'Monsoon imagery.',
              meta: 'Sensory language',
            },
            {
              code: 'CL08-ENG-08-B',
              name: 'Author’s Reflections',
              desc: 'Personal thoughts and emotions.',
              meta: 'Creative appreciation',
            },
          ],
        },

        // ================= POETRY =================

        {
          code: 'CL08-ENG-09',
          name: 'The Ant and the Cricket',
          desc: 'A poem based on a fable.',
          meta: 'Moral learning',
          divisions: [
            {
              code: 'CL08-ENG-09-A',
              name: 'Poem Meaning',
              desc: 'Storyline and characters.',
              meta: 'Understanding poetry',
            },
            {
              code: 'CL08-ENG-09-B',
              name: 'Message',
              desc: 'Hard work and planning.',
              meta: 'Life values',
            },
          ],
        },

        {
          code: 'CL08-ENG-10',
          name: 'Geography Lesson',
          desc: 'A poem on human impact on earth.',
          meta: 'Environmental awareness',
          divisions: [
            {
              code: 'CL08-ENG-10-A',
              name: 'Imagery and Tone',
              desc: 'Visual and emotional elements.',
              meta: 'Poetic devices',
            },
            {
              code: 'CL08-ENG-10-B',
              name: 'Central Idea',
              desc: 'Man vs nature.',
              meta: 'Interpretation',
            },
          ],
        },

        // ================= SUPPLEMENTARY (IT SO HAPPENED) =================

        {
          code: 'CL08-ENG-11',
          name: 'The Missing Child',
          desc: 'A child’s experience at a fair.',
          meta: 'Emotional development',
          divisions: [
            {
              code: 'CL08-ENG-11-A',
              name: 'Fair Experience',
              desc: 'Attraction and excitement.',
              meta: 'Narrative flow',
            },
            {
              code: 'CL08-ENG-11-B',
              name: 'Loss and Realization',
              desc: 'Importance of family.',
              meta: 'Emotional intelligence',
            },
          ],
        },

        {
          code: 'CL08-ENG-12',
          name: 'The Open Window',
          desc: 'A humorous ghost story.',
          meta: 'Irony and imagination',
          divisions: [
            {
              code: 'CL08-ENG-12-A',
              name: 'Story Setup',
              desc: 'Characters and plot.',
              meta: 'Suspense building',
            },
            {
              code: 'CL08-ENG-12-B',
              name: 'Twist Ending',
              desc: 'Deception and humor.',
              meta: 'Literary twist',
            },
          ],
        },
      ],
    },

    // ================= HINDI =================
    Hindi: {
      code: 'CL08-HIN',
      chapters: [
        {
          code: 'CL08-HIN-01',
          name: 'ध्वनि',
          desc: 'भाषा में ध्वनियों का महत्व और स्वरूप।',
          meta: 'भाषाई आधार निर्माण',
          divisions: [
            {
              code: 'CL08-HIN-01-A',
              name: 'स्वर और व्यंजन',
              desc: 'स्वर, व्यंजन और उनकी पहचान।',
              meta: 'मूल भाषा ज्ञान',
            },
            {
              code: 'CL08-HIN-01-B',
              name: 'उच्चारण और प्रयोग',
              desc: 'सही उच्चारण और ध्वनि प्रयोग।',
              meta: 'भाषा सुधार',
            },
          ],
        },

        {
          code: 'CL08-HIN-02',
          name: 'लाख की चूड़ियाँ',
          desc: 'सामाजिक संवेदना पर आधारित कहानी।',
          meta: 'मानवीय मूल्यों का विकास',
          divisions: [
            {
              code: 'CL08-HIN-02-A',
              name: 'कथावस्तु और पात्र',
              desc: 'कहानी की घटनाएँ और पात्र।',
              meta: 'समझ और विश्लेषण',
            },
            {
              code: 'CL08-HIN-02-B',
              name: 'संदेश',
              desc: 'संवेदना और सहानुभूति का भाव।',
              meta: 'मूल्य शिक्षा',
            },
          ],
        },

        {
          code: 'CL08-HIN-03',
          name: 'बस की यात्रा',
          desc: 'यात्रा के अनुभवों पर आधारित रचना।',
          meta: 'अनुभवात्मक लेखन',
          divisions: [
            {
              code: 'CL08-HIN-03-A',
              name: 'यात्रा वर्णन',
              desc: 'बस यात्रा के दृश्य और अनुभव।',
              meta: 'वर्णन कौशल',
            },
            {
              code: 'CL08-HIN-03-B',
              name: 'लेखक की दृष्टि',
              desc: 'हास्य और व्यंग्य।',
              meta: 'साहित्यिक रुचि',
            },
          ],
        },

        {
          code: 'CL08-HIN-04',
          name: 'दीवानों की हस्ती',
          desc: 'आदर्शवाद और साहस की कविता।',
          meta: 'प्रेरणादायक साहित्य',
          divisions: [
            {
              code: 'CL08-HIN-04-A',
              name: 'कविता भाव',
              desc: 'भावार्थ और केंद्रीय विचार।',
              meta: 'काव्य बोध',
            },
            {
              code: 'CL08-HIN-04-B',
              name: 'संदेश',
              desc: 'आदर्श और संघर्ष।',
              meta: 'चरित्र निर्माण',
            },
          ],
        },

        {
          code: 'CL08-HIN-05',
          name: 'चिट्ठियों की अनूठी दुनिया',
          desc: 'पत्रों के माध्यम से संवाद की कला।',
          meta: 'संप्रेषण कौशल',
          divisions: [
            {
              code: 'CL08-HIN-05-A',
              name: 'पत्र लेखन',
              desc: 'पत्रों का स्वरूप और उद्देश्य।',
              meta: 'लेखन कौशल',
            },
            {
              code: 'CL08-HIN-05-B',
              name: 'भाव अभिव्यक्ति',
              desc: 'भावनाओं का प्रभावी संप्रेषण।',
              meta: 'रचनात्मकता',
            },
          ],
        },

        // ================= पद्य =================

        {
          code: 'CL08-HIN-06',
          name: 'यह सबसे कठिन समय नहीं',
          desc: 'आशा और संघर्ष की कविता।',
          meta: 'सकारात्मक दृष्टिकोण',
          divisions: [
            {
              code: 'CL08-HIN-06-A',
              name: 'कविता का अर्थ',
              desc: 'भावार्थ और प्रतीक।',
              meta: 'काव्य समझ',
            },
            {
              code: 'CL08-HIN-06-B',
              name: 'प्रेरक संदेश',
              desc: 'हिम्मत और आशावाद।',
              meta: 'मानसिक विकास',
            },
          ],
        },

        {
          code: 'CL08-HIN-07',
          name: 'कबीर की साखियाँ',
          desc: 'कबीर के दोहे और जीवन दर्शन।',
          meta: 'दार्शनिक चिंतन',
          divisions: [
            {
              code: 'CL08-HIN-07-A',
              name: 'साखियों का अर्थ',
              desc: 'सरल व्याख्या।',
              meta: 'भाव बोध',
            },
            {
              code: 'CL08-HIN-07-B',
              name: 'जीवन मूल्य',
              desc: 'नैतिक और सामाजिक संदेश।',
              meta: 'चरित्र निर्माण',
            },
          ],
        },

        // ================= सहायक पाठ =================

        {
          code: 'CL08-HIN-08',
          name: 'भगवान के डाकिए',
          desc: 'मानवता और करुणा पर आधारित रचना।',
          meta: 'संवेदनशीलता विकास',
          divisions: [
            {
              code: 'CL08-HIN-08-A',
              name: 'कथानक',
              desc: 'घटनाएँ और पात्र।',
              meta: 'कहानी समझ',
            },
            {
              code: 'CL08-HIN-08-B',
              name: 'मानवीय संदेश',
              desc: 'करुणा और सेवा।',
              meta: 'मूल्य शिक्षा',
            },
          ],
        },

        {
          code: 'CL08-HIN-09',
          name: 'यहाँ से वहाँ',
          desc: 'यात्रा संस्मरण।',
          meta: 'अनुभव आधारित साहित्य',
          divisions: [
            {
              code: 'CL08-HIN-09-A',
              name: 'यात्रा विवरण',
              desc: 'स्थल और अनुभव।',
              meta: 'वर्णन क्षमता',
            },
            {
              code: 'CL08-HIN-09-B',
              name: 'लेखक की अनुभूति',
              desc: 'भावनात्मक जुड़ाव।',
              meta: 'साहित्यिक दृष्टि',
            },
          ],
        },
      ],
    },
    'Social Science': {
      code: 'CL08-SST',
      desc: 'History, Civics, and Geography',
      meta: 'Understanding society, governance, and the physical world',
      chapters: [
        // ================= HISTORY =================

        {
          code: 'CL08-HIS-01',
          name: 'How, When and Where',
          desc: 'Understanding historical sources and timelines.',
          meta: 'Historical thinking',
          divisions: [
            {
              code: 'CL08-HIS-01-A',
              name: 'Sources of History',
              desc: 'Official records, surveys, and archives.',
              meta: 'Evidence-based learning',
            },
            {
              code: 'CL08-HIS-01-B',
              name: 'Periodisation',
              desc: 'Division of history into time periods.',
              meta: 'Chronological understanding',
            },
          ],
        },

        {
          code: 'CL08-HIS-02',
          name: 'From Trade to Territory',
          desc: 'Expansion of British power in India.',
          meta: 'Colonial history',
          divisions: [
            {
              code: 'CL08-HIS-02-A',
              name: 'East India Company',
              desc: 'Trade, battles, and policies.',
              meta: 'Political expansion',
            },
            {
              code: 'CL08-HIS-02-B',
              name: 'Annexation and Control',
              desc: 'Subsidiary alliance and doctrine of lapse.',
              meta: 'Power consolidation',
            },
          ],
        },

        {
          code: 'CL08-HIS-03',
          name: 'Ruling the Countryside',
          desc: 'British policies and their impact on agriculture.',
          meta: 'Economic history',
          divisions: [
            {
              code: 'CL08-HIS-03-A',
              name: 'Land Revenue Systems',
              desc: 'Permanent Settlement and Ryotwari.',
              meta: 'Agrarian structure',
            },
            {
              code: 'CL08-HIS-03-B',
              name: 'Impact on Peasants',
              desc: 'Exploitation and revolts.',
              meta: 'Social consequences',
            },
          ],
        },

        {
          code: 'CL08-HIS-04',
          name: 'Tribals, Dikus and the Vision of a Golden Age',
          desc: 'Tribal societies under colonial rule.',
          meta: 'Indigenous history',
          divisions: [
            {
              code: 'CL08-HIS-04-A',
              name: 'Tribal Life',
              desc: 'Customs and livelihood.',
              meta: 'Cultural understanding',
            },
            {
              code: 'CL08-HIS-04-B',
              name: 'Tribal Resistance',
              desc: 'Revolts and leaders.',
              meta: 'Resistance movements',
            },
          ],
        },

        {
          code: 'CL08-HIS-05',
          name: 'When People Rebel: 1857 and After',
          desc: 'The Revolt of 1857.',
          meta: 'Freedom struggle',
          divisions: [
            {
              code: 'CL08-HIS-05-A',
              name: 'Causes of Revolt',
              desc: 'Political, social, and economic reasons.',
              meta: 'Cause–effect analysis',
            },
            {
              code: 'CL08-HIS-05-B',
              name: 'Consequences',
              desc: 'British response and changes.',
              meta: 'Historical impact',
            },
          ],
        },

        // ================= CIVICS =================

        {
          code: 'CL08-CIV-06',
          name: 'The Indian Constitution',
          desc: 'Key features of the Indian Constitution.',
          meta: 'Civic literacy',
          divisions: [
            {
              code: 'CL08-CIV-06-A',
              name: 'Need for Constitution',
              desc: 'Purpose and importance.',
              meta: 'Democratic values',
            },
            {
              code: 'CL08-CIV-06-B',
              name: 'Fundamental Values',
              desc: 'Justice, liberty, equality.',
              meta: 'Rights awareness',
            },
          ],
        },

        {
          code: 'CL08-CIV-07',
          name: 'Understanding Secularism',
          desc: 'Meaning and importance of secularism.',
          meta: 'Social harmony',
          divisions: [
            {
              code: 'CL08-CIV-07-A',
              name: 'What is Secularism',
              desc: 'Concept and features.',
              meta: 'Concept clarity',
            },
            {
              code: 'CL08-CIV-07-B',
              name: 'Indian Context',
              desc: 'Practices in India.',
              meta: 'Practical understanding',
            },
          ],
        },

        {
          code: 'CL08-CIV-08',
          name: 'Why Do We Need a Parliament?',
          desc: 'Role of parliament in democracy.',
          meta: 'Democratic participation',
          divisions: [
            {
              code: 'CL08-CIV-08-A',
              name: 'Structure of Parliament',
              desc: 'Lok Sabha and Rajya Sabha.',
              meta: 'Institutional knowledge',
            },
            {
              code: 'CL08-CIV-08-B',
              name: 'Functions',
              desc: 'Law-making and representation.',
              meta: 'Civic engagement',
            },
          ],
        },

        // ================= GEOGRAPHY =================

        {
          code: 'CL08-GEO-09',
          name: 'Resources',
          desc: 'Natural, human, and capital resources.',
          meta: 'Resource awareness',
          divisions: [
            {
              code: 'CL08-GEO-09-A',
              name: 'Types of Resources',
              desc: 'Classification and examples.',
              meta: 'Concept building',
            },
            {
              code: 'CL08-GEO-09-B',
              name: 'Resource Conservation',
              desc: 'Sustainable use.',
              meta: 'Environmental responsibility',
            },
          ],
        },

        {
          code: 'CL08-GEO-10',
          name: 'Land, Soil, Water, Natural Vegetation and Wildlife Resources',
          desc: 'Earth’s life-support systems.',
          meta: 'Environmental studies',
          divisions: [
            {
              code: 'CL08-GEO-10-A',
              name: 'Land and Soil',
              desc: 'Types and conservation.',
              meta: 'Geographical awareness',
            },
            {
              code: 'CL08-GEO-10-B',
              name: 'Water and Wildlife',
              desc: 'Importance and protection.',
              meta: 'Ecological balance',
            },
          ],
        },

        {
          code: 'CL08-GEO-11',
          name: 'Mineral and Power Resources',
          desc: 'Energy and mineral resources.',
          meta: 'Economic geography',
          divisions: [
            {
              code: 'CL08-GEO-11-A',
              name: 'Minerals',
              desc: 'Metallic and non-metallic.',
              meta: 'Resource knowledge',
            },
            {
              code: 'CL08-GEO-11-B',
              name: 'Power Resources',
              desc: 'Conventional and non-conventional.',
              meta: 'Energy literacy',
            },
          ],
        },

        {
          code: 'CL08-GEO-12',
          name: 'Agriculture',
          desc: 'Farming practices around the world.',
          meta: 'Food systems',
          divisions: [
            {
              code: 'CL08-GEO-12-A',
              name: 'Types of Farming',
              desc: 'Subsistence and commercial.',
              meta: 'Comparative learning',
            },
            {
              code: 'CL08-GEO-12-B',
              name: 'Major Crops',
              desc: 'Food and cash crops.',
              meta: 'Economic relevance',
            },
          ],
        },

        {
          code: 'CL08-GEO-13',
          name: 'Industries',
          desc: 'Industrial development.',
          meta: 'Economic understanding',
          divisions: [
            {
              code: 'CL08-GEO-13-A',
              name: 'Types of Industries',
              desc: 'Classification and examples.',
              meta: 'Industry awareness',
            },
            {
              code: 'CL08-GEO-13-B',
              name: 'Industrial Regions',
              desc: 'Major industrial areas.',
              meta: 'Spatial understanding',
            },
          ],
        },

        {
          code: 'CL08-GEO-14',
          name: 'Human Resources',
          desc: 'Population as a resource.',
          meta: 'Human development',
          divisions: [
            {
              code: 'CL08-GEO-14-A',
              name: 'Population Distribution',
              desc: 'Density and growth.',
              meta: 'Demographic literacy',
            },
            {
              code: 'CL08-GEO-14-B',
              name: 'Human Development',
              desc: 'Education and health.',
              meta: 'Social development',
            },
          ],
        },
      ],
    },
  },
};
