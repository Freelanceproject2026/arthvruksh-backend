type AdminApiOptions = RequestInit & {
  requireAuth?: boolean;
};

export async function adminApi<T = unknown>(
  path: string,
  options: AdminApiOptions = {}
): Promise<T> {
  const url = path.startsWith('/api') ? path : `/api${path}`;

  const response = await fetch(url, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    throw new Error(
      typeof payload === 'object' && payload && 'message' in payload
        ? String((payload as { message?: unknown }).message)
        : `Request failed with status ${response.status}`
    );
  }

  return payload as T;
}
