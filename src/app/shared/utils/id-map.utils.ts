import { SyllabusIndex } from '../../models/syllabus/syllabus-index.model';

export class IdMapUtil {
  static getReadySyllIds(index: SyllabusIndex): Record<string, string> {
    const map: Record<string, string> = {};

    index.catalog.forEach((c) => {
      if (c.id && c.ready && c.enabled) {
        map[c.id] = c.file;
      }
    });
    return map;
  }

  static getReadyClassIds(index: SyllabusIndex): string[] {
    const list: string[] = [];

    index.catalog.forEach((c) => {
      if (c.id && c.ready && c.enabled) {
        list.push(c.id);
      }
    });
    return list;
  }

  //buildIdNameMap() {}
}
