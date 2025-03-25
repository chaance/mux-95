import Mux from "@mux/mux-node";
import assert from "node:assert";

assert(process.env.MUX_TOKEN_ID, "Mux Token ID is required");
assert(process.env.MUX_TOKEN_SECRET, "Mux Token Secret is required");

console.log({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});

export const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});
