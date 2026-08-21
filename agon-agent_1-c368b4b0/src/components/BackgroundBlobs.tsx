export default function BackgroundBlobs() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-40 -left-40 h-[32rem] w-[32rem] rounded-full bg-violet-600/30 blur-[120px] animate-blob" />
      <div className="absolute top-1/3 -right-40 h-[28rem] w-[28rem] rounded-full bg-cyan-500/25 blur-[120px] animate-blob animation-delay-2000" />
      <div className="absolute bottom-0 left-1/4 h-[26rem] w-[26rem] rounded-full bg-amber-400/20 blur-[120px] animate-blob animation-delay-4000" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0B0F17_90%)] dark:bg-[radial-gradient(circle_at_center,transparent_0%,#0B0F17_90%)]" />
    </div>
  );
}
