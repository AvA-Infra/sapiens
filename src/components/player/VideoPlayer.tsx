/**
 * Player de vídeo. Recebe uma URL de embed já assinada pelo servidor (lib/video).
 * Mantém o provedor fora do componente: trocar de Bunny para Mux/Cloudflare não muda esta tela.
 */
export function VideoPlayer({ src, title }: { src: string | null; title: string }) {
  if (!src) {
    return (
      <div className="grid aspect-video w-full place-items-center rounded-card bg-navy-950 p-6 text-center text-sky-200">
        <div>
          <p className="font-display text-3xl font-bold text-white">Vídeo ainda não disponível</p>
          <p className="mt-2 max-w-sm text-sm">
            A aula foi cadastrada, mas o vídeo ainda não foi vinculado ou o provedor de vídeo não está configurado.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="aspect-video w-full overflow-hidden rounded-card bg-navy-950">
      <iframe
        title={title}
        src={src}
        className="size-full"
        loading="lazy"
        allow="accelerometer; gyroscope; encrypted-media; picture-in-picture"
        allowFullScreen
        sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}
