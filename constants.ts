import type { QuestionType } from './types';

export const QUESTION_TYPES: QuestionType[] = [
  { id: 'scramble' },
  { id: 'vocabulary' },
  { id: 'grammar' },
  { id: 'translation' },
  { id: 'preposition' },
  { id: 'reading_comprehension' },
];

export const DEFAULT_ORIGINAL_TEXT = `The industrial revolution, which began in the 18th century, was a period of major technological, socioeconomic, and cultural change. It started in Great Britain and then spread throughout the world. The introduction of new machines, such as the steam engine, fundamentally altered methods of production. This led to a massive increase in the output of goods and a shift from a rural, agrarian society to an urban, industrial one. Many people moved to cities to find work in factories, which often had poor and dangerous working conditions. Despite these challenges, the era also brought about significant advancements in transportation, communication, and science, laying the groundwork for modern society. The long-term effects of this period are still being felt today, influencing everything from our economy to our environment.`;

export const DEFAULT_THEME = 'A space exploration team discovers a new planet inhabited by intelligent robots.';