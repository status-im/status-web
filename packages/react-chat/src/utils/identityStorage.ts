import { bufToHex, hexToBuf } from "js-waku/build/main/lib/utils";
import { Identity } from "status-communities/dist/cjs";

export async function saveIdentity(identity: Identity, password: string) {
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const wrapKey = await getWrapKey(password, salt);

  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const cipher = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    wrapKey,
    identity.privateKey
  );

  const data = {
    salt: bufToHex(salt),
    iv: bufToHex(iv),
    cipher: bufToHex(cipher),
  };

  localStorage.setItem("cipherIdentity", JSON.stringify(data));
}

export async function loadIdentity(
  password: string
): Promise<Identity | undefined> {
  const str = localStorage.getItem("cipherIdentity");
  if (!str) return;
  const data = JSON.parse(str);

  const salt = hexToBuf(data.salt);
  const iv = hexToBuf(data.iv);
  const cipher = hexToBuf(data.cipher);

  return await decryptIdentity(salt, iv, cipher, password);
}

async function getWrapKey(password: string, salt: Uint8Array) {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );
  return await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
}

async function decryptIdentity(
  salt: Buffer,
  iv: Buffer,
  cipherKeyPair: Buffer,
  password: string
): Promise<Identity | undefined> {
  const key = await getWrapKey(password, salt);

  try {
    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      key,
      cipherKeyPair
    );

    return new Identity(new Uint8Array(decrypted));
  } catch (e) {
    return;
  }
}
