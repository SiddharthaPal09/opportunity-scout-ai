import { opportunities } from '../data/opportunities.js';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Discovery Agent — retrieves opportunities from the local dataset.
 */
export async function runDiscoveryAgent(filters = {}) {
  await delay(800);

  let results = [...opportunities];

  if (filters.category) {
    results = results.filter((o) => o.category === filters.category);
  }

  if (filters.query) {
    const q = filters.query.toLowerCase();
    results = results.filter(
      (o) =>
        o.title.toLowerCase().includes(q) ||
        o.description.toLowerCase().includes(q) ||
        o.requiredSkills.some((s) => s.toLowerCase().includes(q))
    );
  }

  return {
    agent: 'Discovery Agent',
    status: 'complete',
    timestamp: new Date().toISOString(),
    output: {
      totalFound: results.length,
      opportunities: results,
      categories: [...new Set(results.map((o) => o.category))],
    },
  };
}
