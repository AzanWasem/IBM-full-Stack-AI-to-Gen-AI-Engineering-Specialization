import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';

type Platform = 'Instagram' | 'TikTok' | 'YouTube' | 'X';

interface GeneratedImage {
  id: number;
  title: string;
  prompt: string;
  dataUrl: string;
}

interface InfluencerConcept {
  name: string;
  niche: string;
  platform: Platform;
  tone: string;
  bio: string;
  followers: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
})
export class AppComponent {
  protected readonly brandName = 'Lovio-Style Creator Studio';
  protected readonly prompt = signal('High-fashion editorial portrait, cinematic soft light, confident AI influencer in neon city');
  protected readonly selectedPlatform = signal<Platform>('Instagram');
  protected readonly selectedNiche = signal('Fashion & Lifestyle');
  protected readonly isGenerating = signal(false);
  protected readonly generatedImages = signal<GeneratedImage[]>([]);
  protected readonly influencerConcepts = signal<InfluencerConcept[]>([]);

  protected readonly canGenerate = computed(() => this.prompt().trim().length > 10 && !this.isGenerating());

  protected readonly platformOptions: Platform[] = ['Instagram', 'TikTok', 'YouTube', 'X'];
  protected readonly nicheOptions = [
    'Fashion & Lifestyle',
    'Fitness & Wellness',
    'Luxury Travel',
    'Tech & Gaming',
    'Beauty & Skincare',
  ];

  protected updatePrompt(value: string): void {
    this.prompt.set(value);
  }

  protected updatePlatform(value: string): void {
    this.selectedPlatform.set(value as Platform);
  }

  protected updateNiche(value: string): void {
    this.selectedNiche.set(value);
  }

  protected async generateAssets(): Promise<void> {
    if (!this.canGenerate()) {
      return;
    }

    this.isGenerating.set(true);

    await new Promise((resolve) => setTimeout(resolve, 900));

    const prompt = this.prompt().trim();
    const niche = this.selectedNiche();
    const platform = this.selectedPlatform();

    const imagePrompts = [
      `Hero campaign image for ${niche}, ${prompt}`,
      `Lifestyle close-up for ${platform}, ${prompt}`,
      `Studio portrait with bold styling, ${prompt}`,
    ];

    const images = imagePrompts.map((text, index) => ({
      id: Date.now() + index,
      title: `Concept ${index + 1}`,
      prompt: text,
      dataUrl: this.createPreviewDataUrl(text, index),
    }));

    this.generatedImages.set(images);
    this.influencerConcepts.set(this.createInfluencerConcepts(niche, platform));
    this.isGenerating.set(false);
  }

  private createInfluencerConcepts(niche: string, platform: Platform): InfluencerConcept[] {
    const tones = ['Luxury', 'Relatable', 'Bold', 'Minimal'];

    return tones.slice(0, 3).map((tone, index) => ({
      name: `${tone}Nova ${index + 1}`,
      niche,
      platform,
      tone,
      bio: `AI creator focused on ${niche.toLowerCase()} with a ${tone.toLowerCase()} visual identity and daily branded storytelling.`,
      followers: `${(index + 1) * 120}K`,
    }));
  }

  private createPreviewDataUrl(text: string, seed: number): string {
    const palettes = [
      ['#111827', '#db2777'],
      ['#172554', '#06b6d4'],
      ['#3f1d8b', '#f97316'],
    ];

    const [from, to] = palettes[seed % palettes.length];
    const title = this.escapeSvg(text.slice(0, 48));

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

  private escapeSvg(input: string): string {
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}
