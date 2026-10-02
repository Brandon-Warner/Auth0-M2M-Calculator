import React, { useState } from 'react';

export default function Auth0TokenEstimator() {
  const [scenario, setScenario] = useState('cached'); // 'cached' (Scenario A) or 'uncached' (Scenario B)

  // Scenario A Inputs
  const [connections, setConnections] = useState(10);
  const [days, setDays] = useState(30);
  const [bufferPercent, setBufferPercent] = useState(25);
  const [tokenLifetime, setTokenLifetime] = useState(86400); // in seconds

  // Scenario B Inputs
  const [apiCalls, setApiCalls] = useState(100);

  // Dynamic Token Calculation Logic
  const calculateTokens = () => {
    if (scenario === 'cached') {
      const conn = Math.max(0, Number(connections) || 0);
      const d = Math.max(0, Number(days) || 0);
      const buf = Math.max(0, Number(bufferPercent) || 0) / 100;
      const lifetime = Math.max(0, Number(tokenLifetime) || 0);
      return Math.round(conn * d * (1 + buf) * (864000 / lifetime));
    } else {
      return Math.round(Number(apiCalls) * 30 * (864000 / tokenLifetime));
    }
  };

  const estimatedTokens = calculateTokens();


  // Map tokens to Auth0 Pricing Tiers
  const getTierRecommendation = (tokens) => {
    if (tokens <= 1000) {
      return {
        tier: 'Free Tier',
        badgeColor: 'bg-green-100 text-green-800',
        detail: 'Fits within the standard free limit (up to 1,000 M2M tokens/month).'
      };
    } else if (tokens <= 5000) {
      return {
        tier: 'Essentials / Professional',
        badgeColor: 'bg-blue-100 text-blue-800',
        detail: 'Standard self-serve tiers (includes 1,000–5,000 M2M tokens/month).'
      };
    } else {
      return {
        tier: 'Enterprise Tier',
        badgeColor: 'bg-purple-100 text-purple-800',
        detail: 'Exceeds 5,000 tokens/month. Requires custom Enterprise quota add-on blocks.'
      };
    }
  };

  const tier = getTierRecommendation(estimatedTokens);

  const inputClass =
    'w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition';

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-indigo-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl">

        {/* Header */}
        <div className="mb-8 text-center">
          <span className="inline-flex items-center gap-1.5 bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full mb-3 tracking-wide uppercase">
            Auth0 M2M
          </span>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Token Estimator</h1>
          <p className="mt-2 text-sm text-gray-500">
            Calculate your monthly Machine-to-Machine token volume based on your architecture.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl ring-1 ring-black/5 overflow-hidden">

          {/* Scenario Tabs */}
          <div className="flex border-b border-gray-100 bg-gray-50/60">
            <button
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors focus:outline-none ${
                scenario === 'cached'
                  ? 'bg-white border-b-2 border-indigo-600 text-indigo-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-white/60'
              }`}
              onClick={() => setScenario('cached')}
            >
              Scenario A: Cached / Standard
            </button>
            <button
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors focus:outline-none ${
                scenario === 'uncached'
                  ? 'bg-white border-b-2 border-indigo-600 text-indigo-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-white/60'
              }`}
              onClick={() => setScenario('uncached')}
            >
              Scenario B: Serverless / Uncached
            </button>
          </div>

          {/* Form Body */}
          <div className="p-6 space-y-5">
            {scenario === 'cached' ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Total System Connections
                    <span className="ml-1.5 text-gray-400 font-normal">(App A → App B)</span>
                  </label>
                  <input
                    type="number"
                    value={connections}
                    onChange={(e) => setConnections(e.target.value)}
                    className={inputClass}
                    placeholder="e.g. 10"
                  />
                  <p className="text-xs text-gray-400 mt-1.5">Number of active service-to-service communication paths.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Days per Month</label>
                    <input
                      type="number"
                      value={days}
                      onChange={(e) => setDays(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Safety Buffer (%)</label>
                    <input
                      type="number"
                      value={bufferPercent}
                      onChange={(e) => setBufferPercent(e.target.value)}
                      className={inputClass}
                      placeholder="25"
                    />
                    <p className="text-xs text-gray-400 mt-1.5">Covers dev testing, deployments, & restarts.</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Token Lifetime
                    <span className="ml-1.5 text-gray-400 font-normal">(seconds)</span>
                  </label>
                  <input
                    type="number"
                    value={tokenLifetime}
                    onChange={(e) => setTokenLifetime(e.target.value)}
                    className={inputClass}
                    placeholder="e.g. 3600"
                  />
                  <p className="text-xs text-gray-400 mt-1.5">How long each token remains valid. Auth0 default is 86400s (24 hours). 3600s = 1 hour.</p>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    System-to-System Connections
                  </label>
                  <input
                    type="number"
                    value={apiCalls}
                    onChange={(e) => setApiCalls(e.target.value)}
                    className={inputClass}
                    placeholder="e.g. 100000"
                  />
                  <p className="text-xs text-gray-400 mt-1.5">
                    When tokens are not reused, each API request triggers a new token fetch.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Token Lifetime
                    <span className="ml-1.5 text-gray-400 font-normal">(seconds)</span>
                  </label>
                  <input
                    type="number"
                    value={tokenLifetime}
                    onChange={(e) => setTokenLifetime(e.target.value)}
                    className={inputClass}
                    placeholder="e.g. 3600"
                  />
                  <p className="text-xs text-gray-400 mt-1.5">How long each token remains valid. Default is 86,400s (24 hours). 3600s = 1 hour.</p>
                </div>
              </>
            )}
          </div>

          {/* Results */}
          <div className="mx-6 mb-6 rounded-xl bg-linear-to-br from-indigo-50 to-slate-50 border border-indigo-100 p-5">
            <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-3">Estimate</p>

            <div className="flex items-end justify-between mb-4">
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Monthly M2M Tokens</p>
                <p className="text-4xl font-extrabold text-gray-900 tracking-tight tabular-nums">
                  {estimatedTokens.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-indigo-100 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Recommended Auth0 Tier</p>
                <p className="text-xs text-gray-400">{tier.detail}</p>
              </div>
              <span className={`shrink-0 mt-0.5 px-3 py-1 text-xs font-semibold rounded-full ${tier.badgeColor}`}>
                {tier.tier}
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}