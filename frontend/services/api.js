export const BASE_URL = "http://localhost:5000";

export async function handleResponse(response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `HTTP error! Status: ${response.status}`,
    );
  }
  return response.json();
}
