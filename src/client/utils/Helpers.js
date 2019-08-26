import { USER_AVATAR_URL_PRESET } from './Constant';

/* eslint-disable import/prefer-default-export */
export function generateAvatarIdFromUsername(username) {
  const uid = username
    .toLowerCase()
    .split(' ')
    .join('_');
  return `${USER_AVATAR_URL_PRESET}/${uid}.png`;
}
