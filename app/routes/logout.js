import { json } from '@remix-run/node';
import { logout } from '~/data/auth.server';

export function action({ request }) {
  if (request.method != 'POST') {
    throw json({ error: 'Invalid Request' }, { status: 400 });
  }

  return logout(request);
}
