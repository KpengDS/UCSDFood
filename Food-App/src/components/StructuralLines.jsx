export default function StructuralLines() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-10"
      aria-hidden="true"
    >
      {/* Left vertical line */}
      <div className="structural-line-v left-[8vw] top-0" />
      {/* Right vertical line */}
      <div className="structural-line-v right-[8vw] top-0" />
      {/* Center vertical line - desktop only */}
      <div className="structural-line-v left-1/2 top-0 hidden md:block opacity-30" />
    </div>
  );
}
