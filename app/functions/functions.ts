import { NextRequest, NextResponse } from "next/server";
import { TComputeCSSHeader, TcomputeDiskInfos } from "../types/stats.types";

export const computeDiskInfos: TcomputeDiskInfos = (fsSize, index) => ({
  sizeGB: parseFloat((fsSize[index].size / (1024 * 1024 * 1024)).toFixed(2)),
  usedGB: parseFloat((fsSize[index].used / (1024 * 1024 * 1024)).toFixed(2)),
  percent: parseFloat(fsSize[index].use.toFixed(1)),
});

export const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const computeState = (stateChar: string) => {
  const state = stateChar.charAt(0);
  switch (state) {
    case "R":
      return "running";
    case "S":
      return "sleeping";
    case "D":
      return "waiting";
    case "Z":
      return "zombie";
    case "T":
    case "t":
      return "stopped";
    case "W":
      return "paging";
    default:
      return "unknown";
  }
};

export const computeCSSHeader: TComputeCSSHeader = (
  headers: NextRequest["headers"]
) => {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const cspHeader = `
    default-src 'self';
    script-src 'nonce-${nonce}' 'strict-dynamic';
    style-src 'self' 'unsafe-inline' ;
    img-src 'self' blob: data: https://authjs.dev;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
`;
  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, " ")
    .trim();

  const requestHeaders = new Headers(headers);
  requestHeaders.set("x-nonce", nonce);

  requestHeaders.set(
    "Content-Security-Policy",
    contentSecurityPolicyHeaderValue
  );
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  response.headers.set(
    "Content-Security-Policy",
    contentSecurityPolicyHeaderValue
  );

  return requestHeaders;
};
