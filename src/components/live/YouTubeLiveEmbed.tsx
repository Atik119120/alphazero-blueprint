import { parseYoutubeId } from '@/hooks/useLiveClasses';

export default function YouTubeLiveEmbed({ url, title = 'Live Class' }: { url: string; title?: string }) {
  const id = parseYoutubeId(url);
  if (!id) {
    return (
      <div className="aspect-video w-full flex items-center justify-center bg-muted rounded-xl text-sm text-muted-foreground">
        Invalid YouTube URL
      </div>
    );
  }
  const src = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
  return (
    <div className="aspect-video w-full rounded-xl overflow-hidden bg-black">
      <iframe
        src={src}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="w-full h-full border-0"
      />
    </div>
  );
}
