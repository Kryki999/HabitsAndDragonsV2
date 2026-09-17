export type Habit = {
  id: string;
  name: string;
  createdAt: string;
  /** Local calendar day `YYYY-MM-DD` when last completed; null if never. */
  completedOn: string | null;
};
