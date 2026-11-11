import "server-only";
import { createHash } from "node:crypto";

/**
 * Abstração do provedor de vídeo. O banco guarda só `video_id`; a URL de reprodução é
 * gerada aqui, no servidor, assinada e com validade curta (sem link direto público).
 * Para trocar de provedor (Mux, Cloudflare Stream), crie outra implementação e escolha por VIDEO_PROVIDER.
 */
export interface VideoProvider {
  name: string;
  /** URL de embed assinada, ou null se o provedor não estiver configurado. */
  getEmbedUrl(videoId: string, ttlSeconds?: number): string | null;
}

/** Bunny Stream, com "Embed view token authentication" ativado na biblioteca. */
const bunny: VideoProvider = {
  name: "bunny",
  getEmbedUrl(videoId, ttlSeconds = 4 * 60 * 60) {
    const library = process.env.BUNNY_STREAM_LIBRARY_ID;
    const key = process.env.BUNNY_STREAM_TOKEN_KEY;
    if (!library || !key) return null;
    const expires = Math.floor(Date.now() / 1000) + ttlSeconds;
    const token = createHash("sha256").update(key + videoId + expires).digest("hex");
    return `https://iframe.mediadelivery.net/embed/${library}/${videoId}?token=${token}&expires=${expires}&autoplay=false&preload=true`;
  },
};

const providers: Record<string, VideoProvider> = { bunny };

export function getVideoProvider(): VideoProvider | null {
  return providers[process.env.VIDEO_PROVIDER ?? "bunny"] ?? null;
}
