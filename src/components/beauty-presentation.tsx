"use client";

import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ChartLineUp,
  ChatCircleText,
  CheckCircle,
  MagnifyingGlass,
  Target,
  TelegramLogo,
} from "@phosphor-icons/react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { proposalStages, roadmap, type ProposalStage } from "@/content/beauty-proposal";

type TransitionAxis = "x" | "y";
type MotionIntent = { axis: TransitionAxis; direction: number; reduce: boolean };

const extensionSlides = 7;
const slideCount = proposalStages.length + 3 + extensionSlides;
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
  const reduceMotion = useReducedMotion();
  const imageX = useMotionValue(0);
  const imageY = useMotionValue(0);
  const smoothX = useSpring(imageX, { stiffness: 72, damping: 22, mass: 0.75 });
  const smoothY = useSpring(imageY, { stiffness: 72, damping: 22, mass: 0.75 });

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || reduceMotion || !window.matchMedia("(pointer: fine)").matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    imageX.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 18);
    imageY.set(((event.clientY - bounds.top) / bounds.height - 0.5) * 12);
  };

  const resetImagePosition = () => {
    imageX.set(0);
    imageY.set(0);
  };

  return (
    <div className="slide-layout cover-slide" onPointerMove={handlePointerMove} onPointerLeave={resetImagePosition}>
      <div className="cover-copy">
        <p className="slide-eyebrow">Коммерческое предложение</p>
        <h1 data-slide-title tabIndex={-1}>Ценность продукта и маркетинг</h1>
        <p className="cover-summary">Сначала проверяем спрос и ценность. Затем строим маркетинг на подтверждённых данных.</p>
        <div className="cover-metrics" aria-label="Параметры проекта">
          <div><strong>158</strong><span>часов</span></div>
          <div><strong>237 000 ₽</strong><span>стоимость</span></div>
          <div><strong>до 10 недель</strong><span>срок</span></div>
        </div>
      </div>
      <div className="cover-image" aria-hidden="true">
        <motion.div className="cover-image-motion" style={{ x: smoothX, y: smoothY }}>
          <Image src="/beauty/hero-ai-beauty.webp" alt="" fill priority sizes="(max-width: 760px) 100vw, 54vw" />
        </motion.div>
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
      </div>
    </div>
  );
}

function ValueTransitionSlide() {
  return (
    <div className="slide-layout value-transition-slide">
      <div>
        <p className="slide-eyebrow">Этап 1 завершён</p>
        <h2 data-slide-title tabIndex={-1}>Ценность проверена. Теперь реализуем маркетинг.</h2>
        <p>Есть понимание спроса, продукта и аргументов для продаж. Переводим эту основу в упаковку, SEO, сайт, контент и аналитику.</p>
      </div>
      <span className="transition-number" aria-hidden="true">02</span>
    </div>
  );
}

function TwoStagesSlide() {
  return (
    <div className="slide-layout extension-slide two-stages-slide">
      <div className="extension-heading">
        <p className="slide-eyebrow">Полный путь к результату</p>
        <h2 data-slide-title tabIndex={-1}>Сначала ценность. Затем маркетинг.</h2>
        <p>Маркетинг становится предсказуемее, когда команда знает, что нужно рынку и на каких данных строить продажи.</p>
      </div>
      <div className="phase-grid">
        <article>
          <span>Этап 1</span>
          <h3>Проверить ценность продукта</h3>
          <p>Исследуем спрос, намерения и предложения конкурентов. Формируем ценность, УТП и офферы.</p>
          <div><strong>38 ч</strong><strong>57 000 ₽</strong><strong>2 недели</strong></div>
        </article>
        <article className="phase-card-accent">
          <span>Этап 2</span>
          <h3>Реализовать маркетинг</h3>
          <p>Переводим проверенную основу в упаковку, SEO, сайт, контент и управляемую аналитику.</p>
          <div><strong>120 ч</strong><strong>180 000 ₽</strong><strong>2 месяца</strong></div>
        </article>
      </div>
    </div>
  );
}

function ValueResearchSlide() {
  return (
    <div className="slide-layout extension-slide value-research-slide">
      <div className="extension-heading">
        <p className="slide-eyebrow">Этап 1 / исследование</p>
        <h2 data-slide-title tabIndex={-1}>Не придумываем ценность. Находим её в спросе.</h2>
      </div>
      <div className="research-grid">
        <article><MagnifyingGlass size={30} aria-hidden="true" /><span>01 / 20 ч</span><h3>Спрос и намерения</h3><p>Какие задачи люди уже пытаются решить и какими словами формулируют желаемый результат.</p></article>
        <article><Target size={30} aria-hidden="true" /><span>02 / 18 ч</span><h3>Предложения конкурентов</h3><p>Что рынок обещает сейчас, где предложения похожи друг на друга и какие ожидания остаются без ответа.</p></article>
        <article><ChartLineUp size={30} aria-hidden="true" /><span>Опционально / 14 ч</span><h3>Неудовлетворённый спрос</h3><p>Ищем продуктовую возможность, которая ценнее привычного решения и лучше ведёт клиента к выбору.</p></article>
      </div>
      <p className="extension-result"><span>Результат</span>Подтверждённая логика продукта вместо гипотез, построенных только на внутреннем видении.</p>
    </div>
  );
}

function DecisionToolSlide() {
  return (
    <div className="slide-layout extension-slide decision-slide">
      <div className="decision-copy">
        <p className="slide-eyebrow">Пример продуктовой ценности</p>
        <h2 data-slide-title tabIndex={-1}>От симулятора к инструменту выбора</h2>
        <div className="scenario-list">
          <article><span>Слабее</span><p>Показать, как будут выглядеть губы после 2 мл. Клиент уже должен выбрать процедуру и объём.</p></article>
          <article className="scenario-strong"><span>Сильнее</span><p>Показать желаемую форму, а затем рекомендовать процедуру и объём для её достижения.</p></article>
        </div>
        <div className="demand-row"><p><strong>114 111</strong><span>запросов «губы после увеличения»</span></p><p><strong>16 638</strong><span>запросов «формы губ»</span></p></div>
      </div>
      <div className="decision-image">
        <Image src="/beauty/value-consultation-ai.webp" alt="Консультация по выбору результата процедуры с помощью ИИ" fill sizes="(max-width: 760px) 100vw, 45vw" />
      </div>
    </div>
  );
}

function ValueOutcomeSlide() {
  const outcomes = [
    "Карта спроса и намерений аудитории",
    "Понимание сильных и слабых предложений рынка",
    "Сегменты и потребности, на которых строятся продажи",
    "Ценность продукта, УТП и система офферов",
  ];
  return (
    <div className="slide-layout extension-slide value-outcome-slide">
      <div className="extension-heading">
        <p className="slide-eyebrow">Результат этапа 1</p>
        <h2 data-slide-title tabIndex={-1}>Команда знает, что продавать и почему это покупают</h2>
      </div>
      <div className="outcome-layout">
        <div className="outcome-list">{outcomes.map((item) => <p key={item}><CheckCircle size={24} weight="fill" aria-hidden="true" />{item}</p>)}</div>
        <aside><span>Стоимость этапа</span><strong>57 000 ₽</strong><p>38 часов работы<br />до 2 недель</p><small>Дополнительный анализ неудовлетворённого спроса: 14 часов.</small></aside>
      </div>
    </div>
  );
}

function PredictableBenefitSlide() {
  const steps = [
    ["01", "Ценность проверена", "Есть подтверждённая потребность и понятный результат для клиента."],
    ["02", "Есть данные для продаж", "Офферы и аргументы опираются на спрос, а не на догадки."],
    ["03", "Маркетинг реализован", "Сайт, SEO, контент и аналитика работают как одна система."],
    ["04", "Выгода планируется", "Решения можно измерять, усиливать и масштабировать."],
  ];
  return (
    <div className="slide-layout extension-slide benefit-slide">
      <div className="extension-heading">
        <p className="slide-eyebrow">Главный эффект</p>
        <h2 data-slide-title tabIndex={-1}>Проверенная ценность делает маркетинг управляемым</h2>
      </div>
      <div className="benefit-flow">{steps.map(([number, title, text]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
      <p className="benefit-thesis">Когда ценность подтверждена и у команды есть данные для продаж, реализованный маркетинг приносит не случайный эффект, а планируемую выгоду.</p>
    </div>
  );
}

function FinalSummarySlide() {
  return (
    <div className="slide-layout extension-slide final-summary-slide">
      <div className="extension-heading">
        <p className="slide-eyebrow">Итог предложения</p>
        <h2 data-slide-title tabIndex={-1}>Два этапа. Одна логика результата.</h2>
      </div>
      <div className="summary-stages">
        <article>
          <span>01</span>
          <div><small>Сначала</small><h3>Проверяем ценность</h3><p>Спрос, намерения, конкуренты, УТП и офферы.</p></div>
          <strong>57 000 ₽<small>38 часов / до 2 недель</small></strong>
        </article>
        <article>
          <span>02</span>
          <div><small>Затем</small><h3>Реализуем маркетинг</h3><p>Упаковка, SEO, сайт, UGC и аналитика.</p></div>
          <strong>180 000 ₽<small>120 часов / 2 месяца</small></strong>
        </article>
      </div>
      <div className="summary-total">
        <p>Проверенная ценность даёт данные для продаж. Реализованный на них маркетинг помогает получать планируемую выгоду.</p>
        <div><span>Весь проект</span><strong>237 000 ₽</strong><small>158 часов / до 10 недель</small></div>
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

      </div>
    </div>
  );
}

function SlideContent({ index }: { index: number }) {
  if (index === 0) return <CoverSlide />;
  if (index === 1) return <TwoStagesSlide />;
  if (index === 2) return <ValueResearchSlide />;
  if (index === 3) return <DecisionToolSlide />;
  if (index === 4) return <ValueOutcomeSlide />;
  if (index === 5) return <ValueTransitionSlide />;
  if (index >= 6 && index <= 10) return <StageSlide stage={proposalStages[index - 6]} />;
  if (index === 11) return <RoadmapSlide />;
  if (index === 12) return <PredictableBenefitSlide />;
  if (index === 13) return <FinalSummarySlide />;
  if (index === slideCount - 1) return <ContactSlide />;
  return null;
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
        <span className="header-caption">Ценность и маркетинг</span>
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
