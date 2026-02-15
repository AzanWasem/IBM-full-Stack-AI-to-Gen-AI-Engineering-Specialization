const app = document.querySelector('#app');

const state = {
  prompt: 'High-fashion editorial portrait, cinematic soft light, confident AI influencer in neon city',
  platform: 'Instagram',
  niche: 'Fashion & Lifestyle',
  images: [],
  influencers: [],
  generating: false,
};

const platformOptions = ['Instagram', 'TikTok', 'YouTube', 'X'];
const nicheOptions = ['Fashion & Lifestyle', 'Fitness & Wellness', 'Luxury Travel', 'Tech & Gaming', 'Beauty & Skincare'];

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function createPreviewDataUrl(text, seed) {
  const palettes = [
    ['#111827', '#db2777'],
    ['#172554', '#06b6d4'],
    ['#3f1d8b', '#f97316'],
  ];

  const [from, to] = palettes[seed % palettes.length];
  const title = escapeHtml(text.slice(0, 48));

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='960' height='960'>
    <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0%' stop-color='${from}'/><stop offset='100%' stop-color='${to}'/>
    </linearGradient></defs>
    <rect width='960' height='960' fill='url(#g)' rx='44'/>
    <circle cx='760' cy='220' r='150' fill='rgba(255,255,255,0.15)'/>
    <circle cx='230' cy='720' r='220' fill='rgba(255,255,255,0.1)'/>
    <text x='60' y='820' fill='white' font-size='42' font-family='Arial, sans-serif'>${title}</text>
  </svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function createInfluencers(niche, platform) {
  return ['Luxury', 'Relatable', 'Bold'].map((tone, index) => ({
    name: `${tone}Nova ${index + 1}`,
    niche,
    platform,
    tone,
    followers: `${(index + 1) * 120}K`,
    bio: `AI creator focused on ${niche.toLowerCase()} with a ${tone.toLowerCase()} visual identity and daily branded storytelling.`,
  }));
}

function render() {
  app.innerHTML = `
    <main class="min-h-screen p-6 md:p-10">
      <div class="max-w-7xl mx-auto space-y-8">
        <header class="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p class="text-fuchsia-300 uppercase tracking-[0.2em] text-xs">AI CREATIVE SUITE</p>
            <h1 class="text-3xl md:text-5xl font-bold mt-2">Lovio-Style Creator Studio</h1>
            <p class="text-slate-300 mt-3 max-w-2xl">Generate image concepts and AI influencer personas from one prompt.</p>
          </div>
          <div class="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm">
            <p class="text-slate-400">Output</p>
            <p class="font-semibold text-emerald-300">Images + Influencer Concepts</p>
          </div>
        </header>

        <section class="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div class="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
            <h2 class="text-xl font-semibold">Creative Input</h2>
            <label class="block space-y-2">
              <span class="text-sm text-slate-300">Image Prompt</span>
              <textarea id="prompt" rows="5" class="w-full rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 focus:outline-none">${escapeHtml(state.prompt)}</textarea>
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label class="space-y-2">
                <span class="text-sm text-slate-300">Primary Platform</span>
                <select id="platform" class="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2">
                  ${platformOptions.map((p) => `<option ${p === state.platform ? 'selected' : ''}>${p}</option>`).join('')}
                </select>
              </label>
              <label class="space-y-2">
                <span class="text-sm text-slate-300">Niche</span>
                <select id="niche" class="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2">
                  ${nicheOptions.map((n) => `<option ${n === state.niche ? 'selected' : ''}>${n}</option>`).join('')}
                </select>
              </label>
            </div>
            <button id="generate" class="w-full rounded-xl py-3 font-semibold transition bg-fuchsia-600 hover:bg-fuchsia-500 disabled:bg-slate-700 disabled:text-slate-400" ${state.generating ? 'disabled' : ''}>
              ${state.generating ? 'Generating concepts...' : 'Create Images & AI Influencers'}
            </button>
          </div>

          <div class="lg:col-span-3 space-y-6">
            <section class="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <h2 class="text-xl font-semibold mb-4">Generated Image Concepts</h2>
              ${state.images.length === 0 ? '<div class="h-56 flex items-center justify-center rounded-xl border border-dashed border-slate-700 text-slate-400 text-center p-8">Run generation to preview three visual concepts.</div>' : `
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  ${state.images.map((image) => `
                    <article class="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
                      <img src="${image.dataUrl}" alt="${escapeHtml(image.title)}" class="w-full aspect-square object-cover" />
                      <div class="p-3">
                        <h3 class="font-medium">${escapeHtml(image.title)}</h3>
                        <p class="text-xs text-slate-400 mt-1">${escapeHtml(image.prompt)}</p>
                      </div>
                    </article>
                  `).join('')}
                </div>
              `}
            </section>

            <section class="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <h2 class="text-xl font-semibold mb-4">AI Influencer Concepts</h2>
              ${state.influencers.length === 0 ? '<p class="text-slate-400">Influencer personas appear after image generation.</p>' : `
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  ${state.influencers.map((c) => `
                    <article class="rounded-xl border border-slate-700 bg-slate-950 p-4 space-y-2">
                      <div class="flex items-center justify-between">
                        <h3 class="font-semibold">${escapeHtml(c.name)}</h3>
                        <span class="text-xs bg-fuchsia-900/60 text-fuchsia-200 px-2 py-1 rounded">${escapeHtml(c.followers)}</span>
                      </div>
                      <p class="text-sm text-emerald-300">${escapeHtml(c.platform)} • ${escapeHtml(c.niche)}</p>
                      <p class="text-xs text-slate-400 uppercase tracking-wide">Tone: ${escapeHtml(c.tone)}</p>
                      <p class="text-sm text-slate-300">${escapeHtml(c.bio)}</p>
                    </article>
                  `).join('')}
                </div>
              `}
            </section>
          </div>
        </section>
      </div>
    </main>
  `;

  document.querySelector('#prompt').addEventListener('input', (e) => {
    state.prompt = e.target.value;
  });

  document.querySelector('#platform').addEventListener('change', (e) => {
    state.platform = e.target.value;
  });

  document.querySelector('#niche').addEventListener('change', (e) => {
    state.niche = e.target.value;
  });

  document.querySelector('#generate').addEventListener('click', async () => {
    if (state.prompt.trim().length < 10 || state.generating) return;
    state.generating = true;
    render();
    await new Promise((resolve) => setTimeout(resolve, 700));

    const prompts = [
      `Hero campaign image for ${state.niche}, ${state.prompt}`,
      `Lifestyle close-up for ${state.platform}, ${state.prompt}`,
      `Studio portrait with bold styling, ${state.prompt}`,
    ];

    state.images = prompts.map((text, index) => ({
      title: `Concept ${index + 1}`,
      prompt: text,
      dataUrl: createPreviewDataUrl(text, index),
    }));
    state.influencers = createInfluencers(state.niche, state.platform);
    state.generating = false;
    render();
  });
}

render();
