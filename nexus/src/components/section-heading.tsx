export function SectionHeading({ title, kicker }: { title: string; kicker?: string }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        {kicker ? <p className="mb-2 text-xs font-black uppercase text-nexus-400">{kicker}</p> : null}
        <h2 className="text-2xl font-black tracking-normal text-white sm:text-3xl">{title}</h2>
      </div>
    </div>
  );
}
