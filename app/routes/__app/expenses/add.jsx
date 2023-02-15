import { redirect } from '@remix-run/node';
import { useNavigate } from '@remix-run/react';
import Modal from '~/components/util/Modal';
import { addExpense } from '~/data/expenses.server';
import ExpenseForm from '../../../components/expenses/ExpenseForm';
import { validateExpenseInput } from '../../../data/validation.server';

export default function AddExpenses() {
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

export async function action({ request, params }) {
  const formData = await request.formData();
  const expenseData = Object.fromEntries(formData);

  try {
    validateExpenseInput(expenseData);
  } catch (error) {
    return error;
  }

  await addExpense(expenseData);
  return redirect('/expenses');
}
