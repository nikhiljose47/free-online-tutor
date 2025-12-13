// data/search-data.ts

import { SearchItem } from "../../models/search-item.model";

export const SEARCH_ITEMS: SearchItem[] = [
  {
    label: 'Tuition Class 5 Maths',
    keywords: ['tuition', 'class 5', 'maths'],
    route: '/details/class/CL5',
  },
  {
    label: 'Tuition Class 6 Science',
    keywords: ['tuition', 'class 6', 'science'],
    route: '/details/class/CL6',
  },
  {
    label: 'Activity Violin',
    keywords: ['activity', 'violin', 'kids'],
    route: '/details/class/CL7',
  },
  {
    label: 'Activity Coding Juniors',
    keywords: ['activity', 'coding', 'juniors'],
    route: '/details/class/CL4',
  }
];
