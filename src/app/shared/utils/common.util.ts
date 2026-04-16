import { DEF_AVATAR_ID, TYPE_CONFIG } from '../../core/constants/app.constants';
import { Channel } from '../../models/learn-tube/channel.model';

export class CommonUtil {
  static getAvatarUrl(id?: string | null): string {
    console.log('Getting avatar URL for ID:', id);
    return id && id != '' ? `assets/avatars/${id}.svg` : `assets/avatars/${DEF_AVATAR_ID}.svg`;
  }

  static mapChannels(raw: any[]): Channel[] {
    return raw.map((ch, ci) => ({
      ...ch,
      slides: ch.slides.map((s: any, si: number) => {
        const cfg = TYPE_CONFIG[s.type] || TYPE_CONFIG['text'];

        return {
          id: `${ch.id || ci}_${si}`,
          type: s.type,
          path: cfg.path,
          duration: s.duration ?? cfg.duration,
          data: s.data ?? {},
        };
      }),
    }));
  }
}
