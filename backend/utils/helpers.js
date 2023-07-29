import { google } from "googleapis";

export const getOAuth2Client = (credentials, accessToken) => {
  const { client_secret, client_id, redirect_uris } = credentials;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );
  oAuth2Client.setCredentials({ access_token: accessToken });
  return oAuth2Client;
};
