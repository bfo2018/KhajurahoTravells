import { env } from "../config/env.js";

export async function submitIndexNowUrls(urls = []) {
  const normalizedUrls = [...new Set(urls.filter(Boolean))];

  if (!env.indexNowKey || normalizedUrls.length === 0) {
    return { submitted: false, reason: "missing-key-or-urls" };
  }

  const response = await fetch(env.indexNowEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify({
      host: new URL(env.siteUrl).hostname,
      key: env.indexNowKey,
      keyLocation: `${env.siteUrl}/${env.indexNowKey}.txt`,
      urlList: normalizedUrls
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`IndexNow submission failed: ${response.status} ${errorText}`);
  }

  return { submitted: true, count: normalizedUrls.length };
}
