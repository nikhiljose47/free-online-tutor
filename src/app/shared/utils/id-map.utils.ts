import { SyllabusIndex } from '../../models/syllabus/syllabus-index.model';

export type ResourceIndex = Record<string, string>;

export class IdMapUtil {

  static buildResourceIndex(index: SyllabusIndex): ResourceIndex {
    const map: ResourceIndex = {};

    index.catalog.forEach((c) => {
      if (c.id && c.ready && c.enabled) {
        map[c.id] = c.file;
      }
    });

    return map;
  }

  buildIdNameMap(){
    
  }
}
