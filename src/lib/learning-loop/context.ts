/**
 * The injected side-effect boundary for product commands.
 *
 * Commands never read the clock and never generate randomness themselves: both
 * arrive as an explicit context. Tests pass fixed providers, so every command
 * is reproducible. Identifiers are opaque and prefixed — never derived from a
 * collection count, which would collide the moment a record is removed or two
 * writes interleave.
 */
const ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";

export interface CommandContext {
  now: string;
  newId: (prefix: string) => string;
}

function randomBytes(length: number): Uint8Array {
  const bytes = new Uint8Array(length);
  const crypto = globalThis.crypto;
  if (crypto && typeof crypto.getRandomValues === "function") {
    crypto.getRandomValues(bytes);
    return bytes;
  }
  for (let index = 0; index < length; index += 1) bytes[index] = Math.floor(Math.random() * 256);
  return bytes;
}

/** 16 opaque characters. Long enough that collision is not a practical concern. */
export function opaqueId(prefix: string): string {
  const bytes = randomBytes(16);
  let suffix = "";
  for (const byte of bytes) suffix += ALPHABET[byte % ALPHABET.length];
  return `${prefix}-${suffix}`;
}

export function liveContext(): CommandContext {
  return { now: new Date().toISOString(), newId: opaqueId };
}

/** Deterministic context for tests and for reproducible fixtures. */
export function fixedContext(now: string, seed = 0): CommandContext {
  let counter = seed;
  return {
    now,
    newId: (prefix) => {
      counter += 1;
      return `${prefix}-t${String(counter).padStart(6, "0")}`;
    },
  };
}
