export interface EpisodesQueryContract extends Record<string, string | number | undefined> {
  page?: number;
  name?: string;
  episode?: string;
}
