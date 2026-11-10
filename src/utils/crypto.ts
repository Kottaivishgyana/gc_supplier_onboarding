/**
 * AES-GCM encryption/decryption for sensitive data stored in localStorage.
 * Uses Web Crypto API (built into browsers, no external dependencies).
 */

const ENCRYPTION_KEY_NAME = 'vendor-onboarding-ek';

async function getOrCreateKey(): Promise<CryptoKey> {
  // Try to retrieve existing key from sessionStorage (lives only for tab session)
  const storedKey = sessionStorage.getItem(ENCRYPTION_KEY_NAME);
  if (storedKey) {
    const keyData = Uint8Array.from(atob(storedKey), c => c.charCodeAt(0));
    return crypto.subtle.importKey('raw', keyData, 'AES-GCM', true, ['encrypt', 'decrypt']);
  }

  // Generate a new key
  const key = await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );

  // Export and store in sessionStorage
  const exported = await crypto.subtle.exportKey('raw', key);
  const b64 = btoa(String.fromCharCode(...new Uint8Array(exported)));
  sessionStorage.setItem(ENCRYPTION_KEY_NAME, b64);

  return key;
}

export async function encryptData(data: string): Promise<string> {
  const key = await getOrCreateKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(data);

  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoded
  );

  // Combine IV + ciphertext and base64 encode
  const combined = new Uint8Array(iv.length + new Uint8Array(ciphertext).length);
  combined.set(iv);
  combined.set(new Uint8Array(ciphertext), iv.length);

  return btoa(String.fromCharCode(...combined));
}

export async function decryptData(encryptedB64: string): Promise<string> {
  const key = await getOrCreateKey();
  const combined = Uint8Array.from(atob(encryptedB64), c => c.charCodeAt(0));

  const iv = combined.slice(0, 12);
  const ciphertext = combined.slice(12);

  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    ciphertext
  );

  return new TextDecoder().decode(decrypted);
}
