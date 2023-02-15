import { Form, Link, useActionData, useMatches, useNavigation, useParams } from '@remix-run/react';

function ExpenseForm() {
  const today = new Date().toISOString().slice(0, 10); // yields something like 2023-09-10
  const validationErrors = useActionData();
  const navigation = useNavigation();
  const params = useParams();

  const isSubmitting = navigation.state !== 'idle';

  // const expenseData = useLoaderData();
  const matches = useMatches();
  const allExpenses = matches.find((match) => match.id === 'routes/__app/expenses')?.data;
  const expenseData = allExpenses?.find((expense) => expense.id === params.id);

  if (params.id && !expenseData) {
    // Invalid expense ID
    return <p>Expense not found</p>;
  }

  // EXAMPLE TO SUBMIT FORM PROGRAMMATICALLY
  // const submit = useSubmit();
  // function submitHandler(e) {
  //   e.preventDefault();
  //   // perform own validation

  //   submit(e.target, {
  //     method: 'post',
  //     action: '/expenses/add',
  //   });
  // }

  // Pre-fill the form with data from the server if we're editing an expense
  const defaultValues = expenseData
    ? {
        title: expenseData.title,
        amount: expenseData.amount,
        date: expenseData.date.slice(0, 10),
      }
    : {
        title: '',
        amount: '',
        date: '',
      };

  return (
    <Form method={expenseData ? 'patch' : 'post'} className="form" id="expense-form">
      <p>
        <label htmlFor="title">Expense Title</label>
        <input type="text" id="title" name="title" required maxLength={30} defaultValue={defaultValues.title} />
      </p>

      <div className="form-row">
        <p>
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            id="amount"
            name="amount"
            min="0"
            step="0.01"
            required
            defaultValue={defaultValues.amount}
          />
        </p>
        <p>
          <label htmlFor="date">Date</label>
          <input type="date" id="date" name="date" max={today} required defaultValue={defaultValues.date} />
        </p>
      </div>
      {validationErrors && (
        <ul>
          {Object.values(validationErrors).map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      )}
      <div className="form-actions">
        <button disabled={isSubmitting}>{isSubmitting ? 'Saving' : 'Save Expense'}</button>
        <Link to="..">Cancel</Link> {/* .. means go up one level */}
      </div>
    </Form>
  );
}

export default ExpenseForm;
