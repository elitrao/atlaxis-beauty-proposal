"use client";

import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ChatCircleText,
  DownloadSimple,
  Phone,
  TelegramLogo,
} from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { proposalStages, roadmap, type ProposalStage } from "@/content/beauty-proposal";

type TransitionAxis = "x" | "y";
type MotionIntent = { axis: TransitionAxis; direction: number; reduce: boolean };

const slideCount = proposalStages.length + 3;
const clampIndex = (value: number) => Math.max(0, Math.min(slideCount - 1, value));
const slideHash = (index: number) => `#slide-${index + 1}`;

const slideVariants = {
  enter: ({ axis, direction, reduce }: MotionIntent) => {
    if (reduce) return { opacity: 1, x: 0, y: 0 };
    return axis === "y"
      ? { opacity: 0, x: 0, y: direction > 0 ? "11vh" : "-11vh" }
      : { opacity: 0, x: direction > 0 ? "11vw" : "-11vw", y: 0 };
  },
  center: { opacity: 1, x: 0, y: 0 },
  exit: ({ axis, direction, reduce }: MotionIntent) => {
    if (reduce) return { opacity: 1, x: 0, y: 0 };
    return axis === "y"
      ? { opacity: 0, x: 0, y: direction > 0 ? "-7vh" : "7vh" }
      : { opacity: 0, x: direction > 0 ? "-7vw" : "7vw", y: 0 };
  },
};

function indexFromHash() {
  if (typeof window === "undefined") return 0;
  const match = window.location.hash.match(/^#slide-(\d+)$/);
  return match ? clampIndex(Number(match[1]) - 1) : 0;
}

function Brand() {
  return (
    <div className="beauty-brand" aria-label="ATLAXIS BEAUTY">
      <span className="beauty-brand-mark" aria-hidden="true">A</span>
      <span>ATLAXIS <b>BEAUTY</b></span>
    </div>
  );
}

function CoverSlide() {
  return (
    <div className="slide-layout cover-slide">
      <div className="cover-copy">
        <p className="slide-eyebrow">Коммерческое предложение</p>
        <h1 data-slide-title tabIndex={-1}>Маркетинговая упаковка проекта</h1>
        <p className="cover-summary">Упаковка, SEO, сайт и контент для запуска ATLAXIS BEAUTY.</p>
        <div className="cover-metrics" aria-label="Параметры проекта">
          <div><strong>120</strong><span>часов</span></div>
          <div><strong>180 000 ₽</strong><span>стоимость</span></div>
          <div><strong>2 месяца</strong><span>срок</span></div>
        </div>
      </div>
      <div className="cover-image" aria-hidden="true">
        <Image src="/beauty/hero-ai-beauty.webp" alt="" fill priority sizes="(max-width: 760px) 100vw, 54vw" />
      </div>
    </div>
  );
}

function StageSlide({ stage }: { stage: ProposalStage }) {
  const hasVisual = Boolean(stage.visual);
  return (
    <div className={`slide-layout stage-slide ${hasVisual ? "stage-slide-with-visual" : ""}`}>
      <div className="stage-heading">
        <div>
          <p className="slide-eyebrow">{stage.number} / {stage.shortTitle}</p>
          <h2 data-slide-title tabIndex={-1}>{stage.title}</h2>
          <p className="stage-subtitle">{stage.subtitle}</p>
        </div>
        <div className="hours-badge"><strong>{stage.hours}</strong><span>работы</span></div>
      </div>

      <div className="stage-body">
        {hasVisual && (
          <div className={`stage-visual stage-visual-${stage.visual}`}>
            <Image
              src={stage.visual === "ugc" ? "/beauty/ugc-ai-analysis-v2.webp" : "/beauty/packaging-ai-concept.webp"}
              alt={stage.visual === "ugc" ? "Создатель контента использует ИИ-анализ внешности на смартфоне" : "Концепция маркетинговой упаковки beauty-tech проекта с ИИ-анализом"}
              fill
              sizes="(max-width: 760px) 100vw, 38vw"
            />
          </div>
        )}

        <div className="stage-content">
          <blockquote>{stage.plainLanguage}</blockquote>
          <div className="stage-columns">
            <section>
              <h3>Зачем</h3>
              <ul>{stage.why.map((item) => <li key={item}>{item}</li>)}</ul>
            </section>
            <section>
              <h3>Что делаем</h3>
              <ul>{stage.work.map((item) => <li key={item}>{item}</li>)}</ul>
            </section>
          </div>
          <div className="benefit-strip">
            {stage.benefits.map((benefit) => (
              <article key={benefit.title}><strong>{benefit.title}</strong><span>{benefit.description}</span></article>
            ))}
          </div>
        </div>
      </div>

      <p className="stage-result"><span>Результат</span>{stage.result}</p>
    </div>
  );
}

function RoadmapSlide() {
  return (
    <div className="slide-layout roadmap-slide">
      <div className="roadmap-heading">
        <p className="slide-eyebrow">После запуска</p>
        <h2 data-slide-title tabIndex={-1}>Рост начинается с измерения</h2>
        <p>Смотрим, какие страницы появляются в поиске, откуда приходят люди и где теряются заявки.</p>
      </div>
      <div className="roadmap-track">
        {roadmap.map((item, index) => (
          <article key={item.period} style={{ "--step": index } as React.CSSProperties}>
            <span>{item.period}</span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
      <div className="roadmap-footer">
        <p>Запускаем. Измеряем. Усиливаем то, что приносит заявки. Масштабируем.</p>
        <a className="download-link" href="/ATLAXIS-BEAUTY-proposal.pptx" download>
          <DownloadSimple size={20} weight="bold" aria-hidden="true" />
          Скачать КП
        </a>
      </div>
    </div>
  );
}

function ContactSlide() {
  return (
    <div className="slide-layout contact-slide">
      <div className="contact-message">
        <p className="slide-eyebrow">Следующий шаг</p>
        <h2 data-slide-title tabIndex={-1}>Давайте обсудим запуск</h2>
        <div className="proposal-validity">
          <span>КП действует до</span>
          <strong>28.09.2026 г.</strong>
        </div>
      </div>

      <div className="contact-panel">
        <div className="contact-person">
          <span>Контакты для связи</span>
          <strong>Екатерина</strong>
          <a href="tel:+79688663960">+7 (968) 866-39-60</a>
        </div>

        <div className="contact-actions">
          <a href="https://t.me/kitciune" target="_blank" rel="noreferrer">
            <TelegramLogo size={24} weight="fill" aria-hidden="true" />
            <span><small>Написать в</small>Telegram</span>
            <ArrowUpRight size={20} weight="bold" aria-hidden="true" />
          </a>
          <a href="https://max.ru/u/f9LHodD0cOKuvO7Pt3zS0Puc3guQ4SPZsPHIvbERTa0RWA5Lmy4Wjv96dPU" target="_blank" rel="noreferrer">
            <ChatCircleText size={24} weight="fill" aria-hidden="true" />
            <span><small>Написать в</small>MAX</span>
            <ArrowUpRight size={20} weight="bold" aria-hidden="true" />
          </a>
        </div>

        <a className="contact-phone" href="tel:+79688663960">
          <Phone size={20} weight="fill" aria-hidden="true" />
          Позвонить Екатерине
        </a>
      </div>
    </div>
  );
}

function SlideContent({ index }: { index: number }) {
  if (index === 0) return <CoverSlide />;
  if (index === slideCount - 2) return <RoadmapSlide />;
  if (index === slideCount - 1) return <ContactSlide />;
  return <StageSlide stage={proposalStages[index - 1]} />;
}

export function BeautyPresentation() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [axis, setAxis] = useState<TransitionAxis>("x");
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const wheelLocked = useRef(false);
  const slideRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  const goTo = useCallback((target: number, nextAxis: TransitionAxis = "x", updateHistory = true) => {
    const nextIndex = clampIndex(target);
    if (nextIndex === activeIndex) return;
    setDirection(nextIndex > activeIndex ? 1 : -1);
    setAxis(nextAxis);
    setActiveIndex(nextIndex);
    if (updateHistory) window.history.pushState(null, "", slideHash(nextIndex));
  }, [activeIndex]);

  const next = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const previous = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  useEffect(() => {
    const sync = () => {
      const nextIndex = indexFromHash();
      setAxis("x");
      setActiveIndex((currentIndex) => {
        setDirection(nextIndex >= currentIndex ? 1 : -1);
        return nextIndex;
      });
    };

    const hasSlideHash = window.location.hash.match(/^#slide-(\d+)$/);
    if (!hasSlideHash) window.history.replaceState(null, "", slideHash(0));
    else queueMicrotask(sync);

    window.addEventListener("popstate", sync);
    window.addEventListener("hashchange", sync);
    return () => {
      window.removeEventListener("popstate", sync);
      window.removeEventListener("hashchange", sync);
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Home") { event.preventDefault(); goTo(0); }
      else if (event.key === "End") { event.preventDefault(); goTo(slideCount - 1); }
      else if ((event.target as HTMLElement | null)?.closest("button, a, input, textarea, select")) return;
      else if (["ArrowRight", "PageDown", " "].includes(event.key)) { event.preventDefault(); next(); }
      else if (["ArrowLeft", "PageUp"].includes(event.key)) { event.preventDefault(); previous(); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goTo, next, previous]);

  const handlePointerDown = (event: React.PointerEvent) => {
    if (event.pointerType === "mouse") return;
    pointerStart.current = { x: event.clientX, y: event.clientY };
  };

  const handlePointerUp = (event: React.PointerEvent) => {
    if (!pointerStart.current) return;
    const deltaX = event.clientX - pointerStart.current.x;
    const deltaY = event.clientY - pointerStart.current.y;
    pointerStart.current = null;
    if (Math.abs(deltaY) > 52 && Math.abs(deltaY) > Math.abs(deltaX)) goTo(activeIndex + (deltaY < 0 ? 1 : -1), "y");
    else if (Math.abs(deltaX) > 52) goTo(activeIndex + (deltaX < 0 ? 1 : -1));
  };

  const handleWheel = (event: React.WheelEvent) => {
    if (!window.matchMedia("(max-width: 760px)").matches || Math.abs(event.deltaY) < 28) return;
    event.preventDefault();
    if (wheelLocked.current) return;
    wheelLocked.current = true;
    goTo(activeIndex + (event.deltaY > 0 ? 1 : -1), "y");
    window.setTimeout(() => { wheelLocked.current = false; }, 700);
  };

  const intent: MotionIntent = { axis, direction, reduce: Boolean(reduceMotion) };

  return (
    <div className="beauty-presentation" onPointerDown={handlePointerDown} onPointerUp={handlePointerUp} onPointerCancel={() => { pointerStart.current = null; }} onWheel={handleWheel}>
      <div className="beauty-grain" aria-hidden="true" />
      <motion.div className="beauty-glow" aria-hidden="true" animate={{ x: `${(activeIndex % 3) * 12 - 10}vw`, y: `${((activeIndex + 1) % 3) * 5 - 6}vh`, opacity: activeIndex === 0 ? 0.4 : 0.2 }} transition={{ duration: reduceMotion ? 0 : 1.1, ease: [0.16, 1, 0.3, 1] }} />
      <header className="beauty-header">
        <Brand />
        <span className="header-caption">Маркетинговая упаковка</span>
      </header>

      <main className="beauty-viewport" aria-live="polite">
        <AnimatePresence mode="wait" initial={false} custom={intent}>
          <motion.section
            ref={slideRef}
            key={activeIndex}
            id={`slide-${activeIndex + 1}`}
            className="beauty-slide"
            aria-label={`${activeIndex + 1} из ${slideCount}`}
            custom={intent}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: reduceMotion ? 0.01 : 0.55, ease: [0.16, 1, 0.3, 1] }}
            onAnimationComplete={() => slideRef.current?.querySelector<HTMLElement>("[data-slide-title]")?.focus({ preventScroll: true })}
          >
            <SlideContent index={activeIndex} />
          </motion.section>
        </AnimatePresence>
      </main>

      <nav className="beauty-nav" aria-label="Навигация по коммерческому предложению">
        <span className="slide-counter">{String(activeIndex + 1).padStart(2, "0")} / {String(slideCount).padStart(2, "0")}</span>
        <div className="slide-rail" aria-label="Перейти к экрану">
          {Array.from({ length: slideCount }, (_, index) => (
            <button key={index} type="button" className={index === activeIndex ? "is-active" : ""} onClick={() => goTo(index)} aria-label={`Экран ${index + 1}`} aria-current={index === activeIndex ? "step" : undefined} />
          ))}
        </div>
        <div className="nav-arrows">
          <button type="button" onClick={previous} disabled={activeIndex === 0} aria-label="Предыдущий экран"><ArrowLeft size={24} weight="bold" aria-hidden="true" /></button>
          <button type="button" onClick={next} disabled={activeIndex === slideCount - 1} aria-label="Следующий экран"><ArrowRight size={24} weight="bold" aria-hidden="true" /></button>
        </div>
      </nav>
    </div>
  );
}
