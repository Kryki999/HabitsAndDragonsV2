import type { TaskType } from './types';

export type SuggestedQuest = {
  name: string;
  hint: string;
  icon: string;
  taskType: TaskType;
};

/** IRL starters — no class/stat/Oracle flavour. */
export const suggestedQuests: SuggestedQuest[] = [
  { name: 'Poranne pompki', hint: '20 powtórzeń na start dnia', icon: '💪', taskType: 'daily' },
  { name: 'Szklanka wody', hint: 'Zanim cokolwiek innego', icon: '💧', taskType: 'daily' },
  { name: 'Rozciąganie', hint: '10 minut giętkości', icon: '🧘', taskType: 'daily' },
  { name: 'Czytaj 10 stron', hint: 'Książka, nie feed', icon: '📖', taskType: 'daily' },
  { name: 'Dziennik', hint: 'Trzy rzeczy, za które jesteś wdzięczny', icon: '📝', taskType: 'daily' },
  { name: 'Spacer wieczorem', hint: '15 minut na zewnątrz', icon: '🌙', taskType: 'daily' },
  { name: 'Bez ekranu przed snem', hint: 'Telefon odłóż 30 min wcześniej', icon: '📵', taskType: 'daily' },
  { name: 'Medytacja', hint: '10 minut oddechu', icon: '🧠', taskType: 'daily' },
  { name: 'Zdrowe danie', hint: 'Jedno świadome posiłek', icon: '🍲', taskType: 'daily' },
  { name: 'Trening', hint: 'Siłownia albo trening w domu', icon: '🏋️', taskType: 'one-off' },
  { name: '10 tys. kroków', hint: 'Cały dzień w ruchu', icon: '🚶', taskType: 'one-off' },
  { name: 'Głęboka praca', hint: '90 minut bez rozpraszaczy', icon: '🎯', taskType: 'one-off' },
];
