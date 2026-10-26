const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://cadac.in/broadbeachlearning.com';
const today = new Date().toISOString().split('T')[0];

const staticRoutes = [
  { url: '/', changefreq: 'daily', priority: '1.0' },
  { url: '/course', changefreq: 'daily', priority: '0.9' },
  { url: '/category/health-safety-environment', changefreq: 'weekly', priority: '0.8' },
  { url: '/category/management-certifications', changefreq: 'weekly', priority: '0.8' },
  { url: '/category/information-security-business-continuity', changefreq: 'weekly', priority: '0.8' },
  { url: '/category/environment', changefreq: 'weekly', priority: '0.8' },
  { url: '/category/food-safety', changefreq: 'weekly', priority: '0.8' },
  { url: '/about', changefreq: 'monthly', priority: '0.7' },
  { url: '/about-us', changefreq: 'monthly', priority: '0.7' },
  { url: '/about/history', changefreq: 'monthly', priority: '0.6' },
  { url: '/about/vision', changefreq: 'monthly', priority: '0.6' },
  { url: '/about/core-values', changefreq: 'monthly', priority: '0.6' },
  { url: '/about/our-team', changefreq: 'monthly', priority: '0.6' },
  { url: '/about/accreditations', changefreq: 'monthly', priority: '0.7' },
  { url: '/accreditations-approvals', changefreq: 'monthly', priority: '0.7' },
  { url: '/about/our-customers', changefreq: 'monthly', priority: '0.6' },
  { url: '/about/industries', changefreq: 'monthly', priority: '0.6' },
  { url: '/about/relations', changefreq: 'monthly', priority: '0.6' },
  { url: '/about/global-foot-print', changefreq: 'monthly', priority: '0.6' },
  { url: '/certificate-access', changefreq: 'monthly', priority: '0.8' },
  { url: '/contact', changefreq: 'monthly', priority: '0.7' },
  { url: '/raise-a-ticket', changefreq: 'monthly', priority: '0.6' },
  { url: '/terms-conditions', changefreq: 'yearly', priority: '0.4' },
  { url: '/privacy-policy', changefreq: 'yearly', priority: '0.4' },
  { url: '/cancellation-refund-policy', changefreq: 'yearly', priority: '0.4' },
  { url: '/terms-of-use', changefreq: 'yearly', priority: '0.4' },
  { url: '/return-policy', changefreq: 'yearly', priority: '0.4' },
  { url: '/data-compliance-policy', changefreq: 'yearly', priority: '0.4' },
];

const courseSlugs = [
  'iso-9001-2015-lead-auditor',
  'iso-14001-internal-auditor',
  'lean-six-sigma-green-belt',
  'iso-45001-lead-auditor',
  'iso-27001-lead-auditor',
  'food-safety-management',
  'project-management-professional',
  'human-resource-management',
  'supply-chain-management',
  'business-analytics',
  'as9100d-internal-auditor',
  'as9120b-internal-auditor',
  'as9110c-internal-auditor',
  'iso-9001-2026-internal-auditor',
  'iso-14001-2026-internal-auditor',
];

const courseRoutes = courseSlugs.map(slug => ({
  url: `/courses/${slug}`,
  changefreq: 'weekly',
  priority: '0.8',
}));

const allRoutes = [...staticRoutes, ...courseRoutes];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes.map(route => `  <url>
    <loc>${BASE_URL}${route.url === '/' ? '/' : route.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

const outputPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
fs.writeFileSync(outputPath, xml, 'utf8');
console.log(`Successfully generated sitemap with ${allRoutes.length} URLs at ${outputPath}`);
