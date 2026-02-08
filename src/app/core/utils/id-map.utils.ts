import { SyllabusIndex } from '../../models/syllabus/syllabus-index.model';

export type IdFileMap = Record<string, string>;

export class IdMapUtil {

  static buildIdFileMap(index: SyllabusIndex): IdFileMap {
    const map: IdFileMap = {};

    index.classes.forEach((c) => {
      if (c.id && c.fileName && c.enabled) {
        map[c.id] = c.fileName;
      }
    });

    index.jamSessions.forEach((j) => {
      if (j.id && j.fileName && j.enabled) {
        map[j.id] = j.fileName;
      }
    });

    index.activities.forEach((a) => {
      if (a.id && a.fileName && a.enabled) {
        map[a.id] = a.fileName;
      }
    });

    return map;
  }

  buildIdNameMap(){
    
  }
}
