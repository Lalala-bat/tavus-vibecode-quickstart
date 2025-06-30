import { atom } from "jotai";

// Get API key from environment variables
const getApiKey = (): string => {
  return import.meta.env.VITE_TAVUS_API_KEY || "";
};

// Atom to store the API token
export const apiTokenAtom = atom<string>(getApiKey());

// Atom to track if token is being validated
export const isValidatingTokenAtom = atom(false);

// Derived atom to check if token exists
export const hasTokenAtom = atom((get) => get(apiTokenAtom) !== null && get(apiTokenAtom) !== "");