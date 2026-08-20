/**
 * Display formatting for learning-loop moments. Kept out of the component
 * module so that file exports components only.
 */
export function formatMoment(value: string): string {
  const date = new Date(value);
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(date);
}
