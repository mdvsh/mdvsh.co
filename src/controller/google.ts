import { OAuth2Client } from "google-auth-library";
import { web } from "../../client_secret.json";
import { decode } from "jsonwebtoken";

const dev_env = process.env.NODE_ENV!;

const redirectUri = dev_env.includes("dev")
  ? web.redirect_uris[0]
  : web.redirect_uris[1];

const oAuth2Client = new OAuth2Client(
  web.client_id,
  web.client_secret,
  redirectUri
);

export const getAuthUrl = (): string => {
  return oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ],
  });
};

export const getAuthProfile = async (code: string): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    oAuth2Client.getToken(code, (err, tokens) => {
      if (err || tokens == undefined) {
        reject(err);
      } else {
        oAuth2Client.setCredentials(tokens);
        const profile = decode(tokens.id_token!);
        resolve(profile);
      }
    });
  });
};
