import { Outlet } from '@remix-run/react';
import ExpensesHeader from '~/components/navigation/ExpensesHeader';

import expensesStyles from '~/styles/expenses.css';

export default function ExpensesAppLayout() {
  // __app.jsx is a pathless route. Is a wrapper!
  return (
    <>
      <ExpensesHeader />
      <Outlet />
    </>
  );
}

export function links() {
  return [{ rel: 'stylesheet', href: expensesStyles }];
}
