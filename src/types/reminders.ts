export type ReminderRepeatType = {
  on: Boolean;
  howOften: string;
  interval: string;
  skipDates: string[];
  previousReminders: PreviousReminderType;
};

export type PreviousReminderType = {
  time: string;
  status: {
    complete: boolean;
    when: string;
  };
  snoozed: boolean; // Change to snooze type later
};
