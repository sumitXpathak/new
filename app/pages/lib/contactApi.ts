// frontend/src/lib/contactApi.ts
const RAW_API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const API_BASE_URL = RAW_API.replace(/\/+$/, ""); // remove trailing slashes

export type ContactForm = {
  name: string;
  email: string;
  message: string;
};

export const contactApi = {
  async submit(formData: ContactForm) {
    const endpoint = `${API_BASE_URL}/api/contact/`;

    const resp = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!resp.ok) {
      // try parse error message from backend
      try {
        const err = (await resp.json()) as { detail?: string; message?: string };
        const msg = err.detail || err.message || `Server error ${resp.status}`;
        throw new Error(msg);
      } catch {
        throw new Error(`Server error ${resp.status} ${resp.statusText}`);
      }
    }

    return resp.json();
  },
};

export default contactApi;
