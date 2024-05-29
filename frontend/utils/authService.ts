import axios from "axios";

import { SUI_CLIENT } from "./suiClient";

import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";

import {
  generateNonce,
  generateRandomness,
  getExtendedEphemeralPublicKey,
} from "@mysten/zklogin";

import { jwtToAddress } from "@mysten/zklogin";

import { genAddressSeed, getZkLoginSignature } from "@mysten/zklogin";

import { jwtDecode } from "jwt-decode";

import { SerializedSignature } from "@mysten/sui.js/cryptography";

const PROVER_URL = process.env.NEXT_PUBLIC_PROVER_URL;

const REDIRECT_URL = process.env.NEXT_PUBLIC_REDIRECT_URL;

const OPENID_PROVIDER_URL = process.env.NEXT_PUBLIC_OPENID_PROVIDER_URL;

const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;

async function salt() {
  const email = await claims()["email"];

  return await hashcode(email);
}

export async function getAddressSeed() {
  const jwt = await decodeJwt();

  //@ts-ignore
  const salt = await salt();

  return genAddressSeed(
    BigInt(salt!),
    "sub",
    jwt.sub,
    jwt.aud.toString()
  ).toString();
}

export async function getEd25519Keypair(): Promise<any> {
  const jwtData = await getJwtData();

  const publicKey = new Uint8Array(
    Object.values(jwtData.ephemeralKeyPair.keypair.publicKey)
  );

  const secretKey = new Uint8Array(
    Object.values(jwtData.ephemeralKeyPair.keypair.secretKey)
  );

  return new Ed25519Keypair({ publicKey, secretKey });
}

async function getPartialZkLoginSignature(): Promise<any> {
  const keyPair = await getEd25519Keypair();

  const extendedEphemeralPublicKey = getExtendedEphemeralPublicKey(
    keyPair.getPublicKey()
  );

  const verificationPayload = {
    jwt: await jwt(),

    extendedEphemeralPublicKey,

    maxEpoch: await getMaxEpoch(),

    jwtRandomness: await getRandomness(),

    salt: await salt(),

    keyClaimName: "sub",
  };

  return await verifyPartialZkLoginSignature(verificationPayload);
}

async function verifyPartialZkLoginSignature(zkpRequestPayload: any) {
  try {
    const proofResponse = await axios.post(PROVER_URL, zkpRequestPayload, {
      headers: {
        "content-type": "application/json",
      },
    });

    const partialZkLoginSignature =
      proofResponse.data as PartialZkLoginSignature;

    return partialZkLoginSignature;
  } catch (error) {
    console.log("failed to reqeust the partial sig: ", error);

    return {};
  }
}

export async function generateZkLoginSignature(
  userSignature: string
): Promise<SerializedSignature> {
  const partialZkLoginSignature = await getPartialZkLoginSignature();

  const addressSeed = await getAddressSeed();

  const maxEpoch = await getMaxEpoch();

  return getZkLoginSignature({
    inputs: {
      ...partialZkLoginSignature,

      addressSeed,
    },

    maxEpoch,

    userSignature,
  });
}

function getMaxEpoch() {
  return getJwtData().maxEpoch;
}

function getRandomness() {
  return getJwtData().randomness;
}

function getJwtData() {
  return JSON.parse(sessionStorage.getItem("jwt_data"));
}

function decodeJwt(): JwtPayload {
  const jwt = sessionStorage.getItem("sui_jwt_token");

  return jwtDecode(jwt) as JwtPayload;
}

export async function walletAddress() {
  const email = await claims()["email"];

  return jwtToAddress(jwt(), hashcode(email));
}

function claims() {
  const token = jwt();

  if (token) return JSON.parse(atob(token.split(".")[1]));
}

function hashcode(s: string) {
  var h = 0,
    l = s.length,
    i = 0;

  if (l > 0) while (i < l) h = ((h << 5) - h + s.charCodeAt(i++)) | 0;

  return h.toString();
}

export function isAuthenticated() {
  const token = jwt();

  return token && token !== "null";
}

function jwt() {
  if (typeof window !== "undefined") {
    return sessionStorage?.getItem("sui_jwt_token");
  }
}

export async function login() {
  const { epoch } = await SUI_CLIENT.getLatestSuiSystemState();

  const maxEpoch = Number(epoch) + 2222;

  const ephemeralKeyPair = new Ed25519Keypair();

  const randomness = generateRandomness();

  const nonce = generateNonce(
    ephemeralKeyPair.getPublicKey(),
    maxEpoch,
    randomness
  );

  const jwtData = {
    maxEpoch,

    nonce,

    randomness,

    ephemeralKeyPair,
  };

  console.log({ jwtData });

  sessionStorage.setItem("jwt_data", JSON.stringify(jwtData));

  const params = new URLSearchParams({
    client_id: CLIENT_ID,

    redirect_uri: REDIRECT_URL,

    response_type: "id_token",

    scope: "openid email",

    nonce: nonce,
  });

  console.log({ params });

  try {
    const { data } = await axios.get(OPENID_PROVIDER_URL);

    console.log({ data });

    const authUrl = `${data.authorization_endpoint}?${params}`;

    location.href = authUrl;
  } catch (error) {
    console.error("Error initiating Google login:", error);
  }
}

export interface JwtPayload {
  iss?: string;

  sub?: string;

  aud?: string[] | string;

  exp?: number;

  nbf?: number;

  iat?: number;

  jti?: string;
}

export type PartialZkLoginSignature = Omit<
  Parameters<typeof getZkLoginSignature>["0"]["inputs"],
  "addressSeed"
>;
