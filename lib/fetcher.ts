// lib/fetcher.ts

export async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url);

  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');
    (error as any).info = await res.json();
    (error as any).status = res.status;
    throw error;
  }

  return res.json();
}
