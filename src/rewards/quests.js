export const QUESTS = [
  { code: 'join_telegram', reward: 50 },
  { code: 'play_5_crash', reward: 100 },
];

export function canClaim(userQuest) {
  return userQuest.completed === false;
}
