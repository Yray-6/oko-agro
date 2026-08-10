export const config = {
  baseUrl: process.env.BASE_URL || 'https://oko-agro-api.onrender.com',
  /** AgroTrack web app (Phase 1 Arrange Transit handoff). Local default: :3000 */
  agroTrackUrl:
    process.env.NEXT_PUBLIC_AGROTRACK_URL?.replace(/\/$/, '') ||
    'http://localhost:3000',
};
