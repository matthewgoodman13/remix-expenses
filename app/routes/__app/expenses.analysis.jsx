import { json } from '@remix-run/node';
import Chart from '~/components/expenses/Chart';
import ExpenseStatistics from '~/components/expenses/ExpenseStatistics';
import { getExpenses } from '~/data/expenses.server';
import { useCatch, useLoaderData } from '@remix-run/react';
import Error from '~/components/util/Error';
import { requireUserSession } from '~/data/auth.server';

// const DUMMY_EMPENSES = [
//   { id: 'e1', title: 'Toilet Paper', amount: 94.12, date: new Date(2021, 7, 14).toISOString() },
//   { id: 'e2', title: 'New TV', amount: 799.49, date: new Date(2021, 2, 12).toISOString() },
//   { id: 'e3', title: 'Car Insurance', amount: 294.67, date: new Date(2021, 2, 28).toISOString() },
//   { id: 'e4', title: 'New Desk (Wooden)', amount: 450, date: new Date(2021, 5, 12).toISOString() },
// ];

export default function ExpenseAnalytics() {
  const expenses = useLoaderData();

  return (
    <main>
      <Chart expenses={expenses.expenses} />
      <ExpenseStatistics expenses={expenses.expenses} />
    </main>
  );
}

export async function loader({ request }) {
  await requireUserSession(request);
  const expenses = await getExpenses();

  if (!expenses || expenses.length === 0) {
    throw json(
      {
        message: 'No expenses found',
      },
      {
        status: 404,
        statusText: 'Not Found',
      }
    );
  }
  return { expenses };
}

export function CatchBoundary() {
  const caughtResponse = useCatch();

  return (
    <main>
      <Error title={caughtResponse.statusText}>
        <p>{caughtResponse.data?.message || 'Something went wrong :('}</p>
      </Error>
    </main>
  );
}
