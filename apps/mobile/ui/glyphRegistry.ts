import type { FC } from 'react';
import type { SvgProps } from 'react-native-svg';

import Add from '../lookdev/assets/mc-add-fill.svg';
import Back from '../lookdev/assets/mc-left-line.svg';
import Calendar from '../lookdev/assets/mc-calendar-fill.svg';
import Check from '../lookdev/assets/mc-check-fill.svg';
import Close from '../lookdev/assets/mc-close-line.svg';
import Copy from '../lookdev/assets/mc-copy-2-fill.svg';
import Delete from '../lookdev/assets/mc-delete-2-fill.svg';
import Down from '../lookdev/assets/mc-down-fill.svg';
import Edit from '../lookdev/assets/mc-edit-2-fill.svg';
import Filter from '../lookdev/assets/mc-filter-2-fill.svg';
import Lock from '../lookdev/assets/mc-lock-fill.svg';
import Next from '../lookdev/assets/mc-right-line.svg';
import Refresh from '../lookdev/assets/mc-refresh-2-line.svg';
import Settings from '../lookdev/assets/mc-settings-3-fill.svg';
import Time from '../lookdev/assets/mc-time-fill.svg';
import Up from '../lookdev/assets/mc-up-fill.svg';

export const glyphs = {
  add: Add,
  back: Back,
  calendar: Calendar,
  check: Check,
  close: Close,
  copy: Copy,
  delete: Delete,
  down: Down,
  edit: Edit,
  filter: Filter,
  lock: Lock,
  next: Next,
  refresh: Refresh,
  settings: Settings,
  time: Time,
  up: Up,
} as const satisfies Record<string, FC<SvgProps>>;

export type GlyphName = keyof typeof glyphs;
