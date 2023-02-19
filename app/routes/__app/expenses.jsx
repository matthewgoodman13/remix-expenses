import { json } from '@remix-run/node';
import { Link, Outlet, useLoaderData } from '@remix-run/react';
import { FaDownload, FaPlus } from 'react-icons/fa';
import ExpensesList from '~/components/expenses/ExpensesList';
import { requireUserSession } from '~/data/auth.server';
import { getExpenses } from '~/data/expenses.server';

// const DUMMY_EMPENSES = [
//   { id: 'e1', title: 'Toilet Paper', amount: 94.12, date: new Date(2021, 7, 14).toISOString() },
//   { id: 'e2', title: 'New TV', amount: 799.49, date: new Date(2021, 2, 12).toISOString() },
//   { id: 'e3', title: 'Car Insurance', amount: 294.67, date: new Date(2021, 2, 28).toISOString() },
//   { id: 'e4', title: 'New Desk (Wooden)', amount: 450, date: new Date(2021, 5, 12).toISOString() },
// ];

export default function ExpensesLayout() {
  const expenses = useLoaderData();

  const hasExpenses = expenses && expenses.length > 0;

  return (
    <>
      <Outlet />
      <main>
        <section id="expenses-actions">
          <Link to="add">
            <FaPlus />
            <span>Add Expense</span>
          </Link>
          <a href="/expenses/raw" target="_blank">
            <FaDownload />
            <span>Raw Data</span>
          </a>
        </section>
        {hasExpenses && <ExpensesList expenses={expenses} />}
        {!hasExpenses && (
          <section id="no-expenses">
            <h1>No Expenses Found</h1>
            <p>
              Start <Link to="add">adding some</Link> today
            </p>
          </section>
        )}
      </main>
    </>
  );
}

export async function loader({ request }) {
  const userId = await requireUserSession(request);
  const expenses = await getExpenses(userId);

  return json(expenses, {
    headers: {
      'Cache-Control': 'max-age=3', // 3 seconds
    },
  });
}
export function headers({ actionHeaders, loaderHeaders, parentHeaders }) {
  return {
    'Cache-Control': loaderHeaders.get('Cache-Control'),
  };
}
