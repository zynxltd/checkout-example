/** Full-bleed animated backgrounds — one visual language per section. */

export function BgSky() {
  return (
    <div className="bg bg--sky" aria-hidden="true">
      <div className="bg-sky__sun" />
      <div className="bg-sky__cloud bg-sky__cloud--a" />
      <div className="bg-sky__cloud bg-sky__cloud--b" />
      <div className="bg-sky__cloud bg-sky__cloud--c" />
      <div className="bg-sky__haze" />
    </div>
  );
}

export function BgSoil() {
  return (
    <div className="bg bg--soil" aria-hidden="true">
      <div className="bg-soil__grain" />
      <span className="bg-soil__sprout bg-soil__sprout--1" />
      <span className="bg-soil__sprout bg-soil__sprout--2" />
      <span className="bg-soil__sprout bg-soil__sprout--3" />
      <span className="bg-soil__sprout bg-soil__sprout--4" />
      <div className="bg-soil__roots" />
    </div>
  );
}

export function BgRain() {
  return (
    <div className="bg bg--rain" aria-hidden="true">
      <div className="bg-rain__mist" />
      {Array.from({ length: 18 }, (_, i) => (
        <span key={i} className={`bg-rain__drop bg-rain__drop--${i + 1}`} />
      ))}
      <div className="bg-rain__puddle" />
    </div>
  );
}

export function BgLeaves() {
  return (
    <div className="bg bg--leaves" aria-hidden="true">
      <div className="bg-leaves__ribbon" />
      {Array.from({ length: 10 }, (_, i) => (
        <span key={i} className={`bg-leaves__leaf bg-leaves__leaf--${i + 1}`} />
      ))}
    </div>
  );
}

export function BgDusk() {
  return (
    <div className="bg bg--dusk" aria-hidden="true">
      <div className="bg-dusk__glow" />
      {Array.from({ length: 12 }, (_, i) => (
        <span key={i} className={`bg-dusk__speck bg-dusk__speck--${i + 1}`} />
      ))}
      <div className="bg-dusk__horizon" />
    </div>
  );
}
