const brands = ['Havells', 'Polycab', 'Schneider', 'Legrand', 'Crompton', 'Anchor', 'Philips', 'Finolex'];

export default function BrandStrip() {
  return (
    <section className="bg-surface-100 py-10">
      <div className="container-app">
        <p className="mb-6 text-center text-xs font-semibold uppercase tracking-widest text-slate-400">
          Authorized brands & partners
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {brands.map((brand) => (
            <span
              key={brand}
              className="font-display text-lg font-bold text-slate-300 transition hover:text-primary-600"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
