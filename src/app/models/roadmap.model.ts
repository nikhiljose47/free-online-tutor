export interface RoadmapNode {
  id: string;
  title: string;
  order: number;
  completed?: boolean;
  hoursEstimate?: number;
}
export interface Roadmap {
  id: string;
  className: string;
  nodes: RoadmapNode[];
}
