const API_BASE_URL = process.env.NEXT_PUBLIC_API || '';

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || res.statusText);
  }
  return res.json();
}

// Authentication
export async function getUsers(token?: string) {
  return fetchApi('/users/', {}, token);
}
export async function getUser(user_id: string, token?: string) {
  return fetchApi(`/users/${user_id}`, {}, token);
}
export async function updateUser(user_id: string, data: any, token?: string) {
  return fetchApi(`/users/${user_id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }, token);
}
export async function deleteUser(user_id: string, token?: string) {
  return fetchApi(`/users/${user_id}`, {
    method: 'DELETE',
  }, token);
}

// Booths
export async function createBooth(data: any, token?: string) {
  return fetchApi('/booths/', {
    method: 'POST',
    body: JSON.stringify(data),
  }, token);
}
export async function getBooths(token?: string) {
  return fetchApi('/booths/', {}, token);
}
export async function getBooth(booth_id: string, token?: string) {
  return fetchApi(`/booths/${booth_id}`, {}, token);
}
export async function updateBooth(booth_id: string, data: any, token?: string) {
  return fetchApi(`/booths/${booth_id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }, token);
}
export async function deleteBooth(booth_id: string, token?: string) {
  return fetchApi(`/booths/${booth_id}`, {
    method: 'DELETE',
  }, token);
}

// Frames
export async function createFrame(data: any, token?: string) {
  return fetchApi('/frames/', {
    method: 'POST',
    body: JSON.stringify(data),
  }, token);
}
export async function getFrames(token?: string) {
  return fetchApi('/frames/', {}, token);
}
export async function getFrame(frame_id: string, token?: string) {
  return fetchApi(`/frames/${frame_id}`, {}, token);
}
export async function updateFrame(frame_id: string, data: any, token?: string) {
  return fetchApi(`/frames/${frame_id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }, token);
}
export async function deleteFrame(frame_id: string, token?: string) {
  return fetchApi(`/frames/${frame_id}`, {
    method: 'DELETE',
  }, token);
}

// Transactions
export async function createTransaction(data: any, token?: string) {
  return fetchApi('/transactions/', {
    method: 'POST',
    body: JSON.stringify(data),
  }, token);
}
export async function getTransactions(token?: string) {
  return fetchApi('/transactions/', {}, token);
}
export async function getTransaction(transaction_id: string, token?: string) {
  return fetchApi(`/transactions/${transaction_id}`, {}, token);
}
export async function updateTransaction(transaction_id: string, data: any, token?: string) {
  return fetchApi(`/transactions/${transaction_id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }, token);
}
export async function deleteTransaction(transaction_id: string, token?: string) {
  return fetchApi(`/transactions/${transaction_id}`, {
    method: 'DELETE',
  }, token);
}

// Photos
export async function createPhoto(data: any, token?: string) {
  return fetchApi('/photos/', {
    method: 'POST',
    body: JSON.stringify(data),
  }, token);
}
export async function getPhotos(token?: string) {
  return fetchApi('/photos/', {}, token);
}
export async function getPhoto(photo_id: string, token?: string) {
  return fetchApi(`/photos/${photo_id}`, {}, token);
}
export async function updatePhoto(photo_id: string, data: any, token?: string) {
  return fetchApi(`/photos/${photo_id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }, token);
}
export async function deletePhoto(photo_id: string, token?: string) {
  return fetchApi(`/photos/${photo_id}`, {
    method: 'DELETE',
  }, token);
}

// Payment
export async function createPaymentTransaction(data: any, token?: string) {
  return fetchApi('/payment/create-transaction', {
    method: 'POST',
    body: JSON.stringify(data),
  }, token);
}
