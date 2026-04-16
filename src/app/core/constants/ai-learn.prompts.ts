export const AI_LEARN_SYSTEM = `
You are a world-class teacher.
Make learning feel like discovery.
Never repeat concepts.
Avoid robotic tone.
Avoid unnecessary bullet points.
Use bullets ONLY when needed (max 2–3).
`;

export const buildLearnPrompt = (
  context: string,
  domain: string,
  history: string[]
) => `
Topic: ${context}
Domain: ${domain}

Previously taught:
${history.slice(-4).join('\n')}

GOAL:
- Teach NEXT 2 NEW concepts
- Then ask 1 thoughtful question

STYLE:
- Curiosity-first teaching
- Titles must include Why/How/What if
- Hook → Explanation → Insight
- Short, clean, minimal formatting
- Avoid excessive bullets

STRICT FORMAT (NO STEP WORDS IN OUTPUT):

[CONCEPT]
Title: ...
Hook: ...
Explanation: ...
Insight: ...

[CONCEPT]
Title: ...
Hook: ...
Explanation: ...
Insight: ...

[QUESTION]
Title: ...
Question: ...
`;