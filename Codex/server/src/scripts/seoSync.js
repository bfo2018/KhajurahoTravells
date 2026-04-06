import { connectDatabase } from "../config/database.js";
import { buildSeoSyncUrls } from "../services/seoService.js";
import { submitIndexNowUrls } from "../services/indexNowService.js";

async function run() {
  await connectDatabase();

  const urls = await buildSeoSyncUrls();
  const indexNow = await submitIndexNowUrls(urls).catch((error) => ({
    submitted: false,
    reason: error.message
  }));

  console.log(
    JSON.stringify(
      {
        ok: true,
        googleSitemapPingSupported: false,
        googleNote:
          "Google deprecated the public sitemap ping endpoint on June 26, 2023. Submit sitemap.xml in Search Console and keep robots.txt live.",
        indexNow,
        submittedUrlCount: urls.length
      },
      null,
      2
    )
  );

  process.exit(0);
}

run().catch((error) => {
  console.error("SEO sync failed", error);
  process.exit(1);
});
