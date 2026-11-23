import { Pip, type PipPose } from "./components/Pip";
import { BgSky, BgSoil, BgRain, BgLeaves, BgDusk } from "./components/SectionBgs";
import type { ReactNode } from "react";

type SectionProps = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  pose: PipPose;
  bg: ReactNode;
  pipSide?: "left" | "right";
  cta?: { label: string; href: string };
};

function Section({
  id,
  eyebrow,
  title,
  body,
  pose,
  bg,
  pipSide = "right",
  cta,
}: SectionProps) {
  return (
    <section id={id} className={`scene scene--${id} scene--pip-${pipSide}`}>
      {bg}
      <div className="scene__scrim" aria-hidden="true" />
      <div className="scene__inner">
        <div className="scene__copy">
          <p className="scene__eyebrow">{eyebrow}</p>
          <h2 className="scene__title">{title}</h2>
          <p className="scene__body">{body}</p>
          {cta ? (
            <a className="scene__cta" href={cta.href}>
              {cta.label}
            </a>
          ) : null}
        </div>
        <div className="scene__mascot">
          <Pip pose={pose} className="scene__pip" />
        </div>
      </div>
    </section>
  );
}

export default function App() {
  return (
    <div className="site">
      <header className="top">
        <a className="top__brand" href="#hero">
          YouGarden
        </a>
        <nav className="top__nav" aria-label="Primary">
          <a href="#grow">Planting</a>
          <a href="#care">Care</a>
          <a href="#harvest">Seasonal</a>
          <a href="#club">Club</a>
        </nav>
        <a className="top__action" href="#club">
          Become a member
        </a>
      </header>

      <section id="hero" className="hero">
        <BgSky />
        <div className="hero__scrim" aria-hidden="true" />
        <div className="hero__inner">
          <p className="hero__brand">YouGarden</p>
          <h1 className="hero__title">Plants chosen for British gardens</h1>
          <p className="hero__lede">
            Expert-grown stock, clear planting guidance, and delivery timed to the
            season — from first root to lasting borders.
          </p>
          <div className="hero__actions">
            <a className="hero__cta" href="#grow">
              Explore the season
            </a>
            <a className="hero__link" href="#club">
              View club benefits
            </a>
          </div>
        </div>
        <div className="hero__mascot">
          <Pip pose="wave" className="hero__pip" label="Pip, YouGarden mascot" />
          <p className="hero__mascot-caption">Pip guides each stage of the garden year</p>
        </div>
      </section>

      <Section
        id="grow"
        eyebrow="01 — Establish"
        title="Start with the right root"
        body="Healthy plants begin below the surface. We match varieties to soil, light and climate so new beds settle quickly and stay resilient."
        pose="dig"
        bg={<BgSoil />}
        pipSide="left"
      />

      <Section
        id="care"
        eyebrow="02 — Maintain"
        title="Care that fits real gardens"
        body="Practical watering, feeding and pruning advice — enough to keep plants thriving without turning weekends into a second job."
        pose="water"
        bg={<BgRain />}
        pipSide="right"
      />

      <Section
        id="harvest"
        eyebrow="03 — Enjoy"
        title="Colour, crop and structure"
        body="From patio pots to full borders, seasonal selections are curated for reliable performance across spring, summer and autumn."
        pose="carry"
        bg={<BgLeaves />}
        pipSide="left"
      />

      <Section
        id="club"
        eyebrow="04 — Belong"
        title="Club access for keen gardeners"
        body="Members receive early releases, seasonal planting notes and exclusive offers — so you plan with confidence, not guesswork."
        pose="cheer"
        bg={<BgDusk />}
        pipSide="right"
        cta={{ label: "Join YouGarden Club", href: "#club" }}
      />

      <footer className="foot">
        <div className="foot__grid">
          <div>
            <p className="foot__brand">YouGarden</p>
            <p className="foot__note">
              Demo site — animated section themes with a consistent brand mascot.
            </p>
          </div>
          <div className="foot__cols">
            <div>
              <p className="foot__label">Explore</p>
              <a href="#grow">Planting</a>
              <a href="#care">Care</a>
              <a href="#harvest">Seasonal</a>
            </div>
            <div>
              <p className="foot__label">Members</p>
              <a href="#club">Club</a>
              <a href="#hero">Home</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
