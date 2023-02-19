import { redirect } from '@remix-run/node';
import { useNavigate } from '@remix-run/react';
import Modal from '~/components/util/Modal';
import { deleteExpense, getExpense, updateExpense } from '~/data/expenses.server';
import { validateExpenseInput } from '~/data/validation.server';
import ExpenseForm from '../../../components/expenses/ExpenseForm';

export default function ViewAndEditExpense() {
  const navigate = useNavigate();

  const closeHandler = () => {
    navigate('..');
  };

  return (
    <Modal onClose={closeHandler}>
      <ExpenseForm />
    </Modal>
  );
}

//  LETS USE PREVIOUSLY LOADED DATA FROM ALL EXPENSES PAGE
// export function loader({ params }) {
//   return getExpense(params.id);
// }

export async function action({ request, params }) {
  const expenseId = params.id;

  const method = request.method;

  if (method === 'PATCH') {
    const formData = await request.formData();
    const expenseData = Object.fromEntries(formData);

    try {
      validateExpenseInput(expenseData);
    } catch (error) {
      return error;
    }

    await updateExpense(expenseId, expenseData);
    return redirect('/expenses');
  } else if (method === 'DELETE') {
    try {
      await deleteExpense(expenseId);
    } catch (error) {
      return error;
    }

    return redirect('/expenses');
  }
}

export function meta({ params, location, data, parentsData }) {
  const expense = parentsData['routes/__app/expenses'].find((expense) => expense.id === params.id);
  return {
    title: expense.title,
    description: 'Update expense.',
  };
}
