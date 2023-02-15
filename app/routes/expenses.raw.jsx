// Page that just returns the raw JSON data | /expenses/raw

import { getExpenses } from '~/data/expenses.server';

export function loader({ params }) {
  return getExpenses();
}
