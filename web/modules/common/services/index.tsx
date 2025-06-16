import {auth} from '@/auth';

export async function apiGet<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${process.env.API_URL}${path}`);
    return await response.json();
  } catch (e) {
    return null;
  }
}

export async function apiPost<T>(path: string, body: {}): Promise<T | null> {
  console.log('apiPost', path, body);
  console.log('API_URL', process.env.API_URL);
  try {
    const response = await fetch(`${process.env.API_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.error('Response failed');
      return null;
    }
    return await response.json();
  } catch (e) {
    console.error('Error:', e);
    return null;
  }
}

export async function apiSecureGet<T>(path: string): Promise<T | null> {
  const session = await auth();
  try {
    const response = await fetch(`${process.env.API_URL}${path}`, {
      headers: {
        Authorization: `Bearer ${session?.user.token}`,
      },
    });
    return await response.json();
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function apiSecurePost<T>(path: string, body: {} = {}): Promise<T | null> {
  return await apiSecureMethod<T>(path, body, 'POST');
}

export async function apiSecurePut<T>(path: string, body: {} = {}): Promise<T | null> {
  return await apiSecureMethod<T>(path, body, 'PUT');
}

export async function apiSecureDelete<T>(path: string, body: {} = {}): Promise<T | null> {
  return await apiSecureMethod<T>(path, body, 'DELETE');
}

async function apiSecureMethod<T>(
  path: string,
  body: {},
  method: 'PUT' | 'POST' | 'DELETE'
): Promise<T | null> {
  const session = await auth();
  try {
    const response = await fetch(`${process.env.API_URL}${path}`, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.user.token}`,
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      console.error(await response.text());
      return null;
    }
    return await response.json();
  } catch (e) {
    console.error('Error:', e);
    return null;
  }
}

export async function apiSecurePostFormData<T>(path: string, body: FormData): Promise<T | null> {
  return await apiSecureFormData(path, body, 'POST');
}

export async function apiSecurePutFormData<T>(
  path: string,
  body: FormData
): Promise<T | null> {
  return await apiSecureFormData(path, body, 'POST');
}

export async function apiSecureFormData<T>(
  path: string,
  body: FormData,
  method: 'PUT' | 'POST'
): Promise<T | null> {
  const session = await auth();
  try {
    const response = await fetch(`${process.env.API_URL}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${session?.user.token}`,
      },
      body,
    });
    if (!response.ok) {
      console.error(await response.text());
      return null;
    }
    return await response.json();
  } catch (e) {
    console.error('Error:', e);
    return null;
  }
}
