export type ReminderRepeatType = {
  on: Boolean;
  howOften: string;
  interval: string;
  skipDates: string[];
  originalTime: Date;
  previousReminders: PreviousReminderType[];
};

export type PreviousReminderType = {
  time: string;
  status: {
    complete: boolean;
    when: string;
  };
  snoozed: boolean; // Change to snooze type later
};
