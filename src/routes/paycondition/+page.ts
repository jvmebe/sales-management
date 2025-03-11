import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
  const response = await fetch('/api/payconditions');
  const items = await response.json();
  return { items };
};