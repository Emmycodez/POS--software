export function YouTubeVideo({ videoId, title = "YouTube video player" }) {
  return (
    <div className="relative w-full  max-w-3xl mx-auto border-4 rounded-md border-foreground">
      <iframe
        className=""
        width="560"
        height="315"
        src="https://www.youtube.com/embed/OLXFVDAdEjI?si=bwZNUAywqMK_yLPf"
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      ></iframe>
    </div>
  );
}
