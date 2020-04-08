import { writable } from 'svelte/store';

export const isAuthenticated = writable(false);

export const authError = writable("");

export const permissions = writable([]);