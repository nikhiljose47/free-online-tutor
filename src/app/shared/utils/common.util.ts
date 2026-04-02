import { DEF_AVATAR_ID } from '../../core/constants/app.constants';

export class CommonUtil {
  static getAvatarUrl(id?: string | null): string {
    console.log('Getting avatar URL for ID:', id);
    return id && id != ''
      ? `assets/avatars/${id}.svg`
      : `assets/avatars/${DEF_AVATAR_ID}.svg`;
  }
}
