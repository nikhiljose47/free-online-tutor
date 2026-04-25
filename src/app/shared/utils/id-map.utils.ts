import { SyllabusIndex } from '../../models/syllabus/syllabus-index.model';

export type AvailableSyllabus = Record<string, string>;

export class IdMapUtil {
  static buildAvailableSyllabus(index: SyllabusIndex): AvailableSyllabus {
    const map: AvailableSyllabus = {};

    index.catalog.forEach((c) => {
      if (c.id && c.ready && c.enabled) {
        map[c.id] = c.file;
      }
    });

    return map;
  }

  buildIdNameMap() {}
}
