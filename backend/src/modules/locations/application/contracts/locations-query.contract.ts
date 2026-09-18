export interface LocationsQueryContract extends Record<string, string | number | undefined> {
  page?: number;
  name?: string;
  type?: string;
  dimension?: string;
}
