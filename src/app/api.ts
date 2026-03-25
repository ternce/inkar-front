export type ApiError = {
  status: number;
  message: string;
};

async function parseJsonSafe(response: Response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const body = await parseJsonSafe(response);
    throw {
      status: response.status,
      message: typeof body === "string" ? body : JSON.stringify(body),
    } satisfies ApiError;
  }

  return (await parseJsonSafe(response)) as T;
}

export async function apiSend<T>(
  path: string,
  method: "POST" | "PUT" | "PATCH" | "DELETE",
  body?: unknown,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(path, {
    ...init,
    method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (!response.ok) {
    const payload = await parseJsonSafe(response);
    throw {
      status: response.status,
      message: typeof payload === "string" ? payload : JSON.stringify(payload),
    } satisfies ApiError;
  }

  return (await parseJsonSafe(response)) as T;
}
