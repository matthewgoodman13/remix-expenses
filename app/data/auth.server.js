import { prisma } from './database.server';
import { hash, compare } from 'bcryptjs';
import { createCookieSessionStorage, redirect } from '@remix-run/node';

const SESSION_SECRET = process.env.SESSION_SECRET;
const sessionStorage = createCookieSessionStorage({
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    secrets: [SESSION_SECRET], // Ensures cookies are signed by our server
    sameSite: 'lax', // Prevent CSRF attacks
    maxAge: 30 * 24 * 60 * 60, // 30 days
    httpOnly: true, // Prevents client-side JS from reading the cookie
  },
});

async function createUserSession(userId, redirectPath) {
  console.log('createUserSession', userId, redirectPath);
  const session = await sessionStorage.getSession();
  session.set('userId', userId);
  return redirect(redirectPath, {
    headers: {
      'Set-Cookie': await sessionStorage.commitSession(session),
    },
  });
}

export async function getUserFromSession(request) {
  const session = await sessionStorage.getSession(request.headers.get('Cookie'));
  const userId = session.get('userId');

  if (!userId) {
    return null;
  }

  return userId;
}

export async function destroyUserSession(request) {
  const session = await sessionStorage.getSession(request.headers.get('Cookie'));
  return redirect('/', {
    headers: {
      'Set-Cookie': await sessionStorage.destroySession(session),
    },
  });
}

export async function requireUserSession(request) {
  const userId = await getUserFromSession(request);

  if (!userId) {
    // User is not logged in
    throw redirect('/auth?mode=login');
  }

  return userId;
}

export async function signup({ email, password }) {
  // Check if user already exists
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (user) {
    const error = new Error('User already exists');
    error.status = 422;
    throw error;
  }

  // Create user
  const hashedPassword = await hash(password, 12);
  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

  return createUserSession(newUser.id, '/expenses');
}

export async function login({ email, password }) {
  // Check if user exists
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    const error = new Error('Invalid Credentials');
    error.status = 401;
    throw error;
  }

  // Check if password is correct
  const isValid = await compare(password, user.password);

  if (!isValid) {
    const error = new Error('Invalid Credentials');
    error.status = 401;
    throw error;
  }

  return createUserSession(user.id, '/expenses');
}

export async function logout(request) {
  return destroyUserSession(request);
}
