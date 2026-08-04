export const BASE_URL = "http://localhost:5000";

export async function handleResponse(response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message =
      errorData.error ||
      errorData.message ||
      errorData.detail ||
      `HTTP error! Status: ${response.status}`;
    throw new Error(message);
  }
  return response.json();
}
