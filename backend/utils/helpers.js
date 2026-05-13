import { google } from "googleapis";

export const getOAuth2Client = (credentials, accessToken) => {
  const { client_secret, client_id, redirect_uris } = credentials;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0],
  );
  oAuth2Client.setCredentials({ access_token: accessToken });
  return oAuth2Client;
};

export const validateEmail = (email) => {
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailPattern.test(email);
};

export const reminderFutureDays = (reminder, amount = 4) => {
  const mutatingDate = new Date(reminder.time);

  const howOften = reminder.repeat?.howOften;

  const nextDays = [];

  for (let i = 0; i < amount; i++) {
    switch (howOften) {
      case "Minute": {
        mutatingDate.setMinutes(mutatingDate.getMinutes() + 1);
        const nextMinute = mutatingDate.toISOString();
        nextMinutes.push(nextMinute);
        break;
      }
      case "Daily": {
        mutatingDate.setDate(mutatingDate.getDate() + 1);
        const nextDay = mutatingDate.toISOString();
        nextDays.push(nextDay);
        break;
      }

      case "Weekly": {
        mutatingDate.setDate(mutatingDate.getDate() + 7);
        const nextDay = mutatingDate.toISOString();
        nextDays.push(nextDay);
        break;
      }

      case "Bi Weekly": {
        mutatingDate.setDate(mutatingDate.getDate() + 14);
        const nextDay = mutatingDate.toISOString();
        nextDays.push(nextDay);
        break;
      }

      case "Monthly": {
        mutatingDate.setMonth(mutatingDate.getMonth() + 1);
        const nextDay = mutatingDate.toISOString();
        nextDays.push(nextDay);
        break;
      }

      case "Yearly": {
        mutatingDate.setFullYear(mutatingDate.getFullYear() + 1);
        const nextDay = mutatingDate.toISOString();
        nextDays.push(nextDay);
        break;
      }

      default:
        break;
    }
  }

  return nextDays;
};
