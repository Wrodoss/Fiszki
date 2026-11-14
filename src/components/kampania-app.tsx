import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Check, Download, RotateCcw, Search, Volume2 } from "lucide-react";
import { SECTIONS, TERMS, sectionOf, type Section, type Term } from "../data/vocab";

type Direction = "en-pl" | "pl-en" | "mix";
type Pool = "all" | "open";
type Length = 10 | 20 | 50 | 300;
type View = "home" | "study" | "quiz" | "list";
type Grade = "known" | "learning";
type Lang = "en" | "pl";

const STORAGE_KEY = "kampania-progress-v1";

type Saved = {
  known: number[];
  learning: number[];
  direction: Direction;
  pool: Pool;
  length: Length;
  section: number;
};

const EMPTY: Saved = {
  known: [],
  learning: [],
  direction: "en-pl",
  pool: "all",
  length: 20,
  section: 0,
};

function shuffle<T>(items: T[]): T[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const swap = next[i];
    next[i] = next[j];
    next[j] = swap;
  }
  return next;
}

function fold(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

function pad(id: number): string {
  return String(id).padStart(3, "0");
}

function promptOf(direction: Direction): Lang {
  if (direction === "pl-en") return "pl";
  if (direction === "mix") return Math.random() < 0.5 ? "en" : "pl";
  return "en";
}

function faceText(term: Term, lang: Lang): string {
  return lang === "en" ? term.en : term.pl;
}

function other(lang: Lang): Lang {
  return lang === "en" ? "pl" : "en";
}

function langName(lang: Lang): string {
  return lang === "en" ? "angielski" : "polski";
}

function termSize(text: string): string {
  if (text.length > 52) return "text-2xl md:text-3xl";
  if (text.length > 28) return "text-3xl md:text-4xl";
  return "text-4xl md:text-5xl";
}

function inPool(term: Term, section: number, pool: Pool, known: Set<number>): boolean {
  if (section !== 0 && term.section !== section) return false;
  if (pool === "open" && known.has(term.id)) return false;
  return true;
}

function buildDeck(section: number, pool: Pool, length: Length, known: Set<number>): Term[] {
  const list = shuffle(TERMS.filter((term) => inPool(term, section, pool, known)));
  return length >= TERMS.length ? list : list.slice(0, length);
}

function speakEnglish(text: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-GB";
  utterance.rate = 0.92;
  window.speechSynthesis.speak(utterance);
}

function csvCell(value: string): string {
  if (/[;"\n]/.test(value)) return `"${value.replaceAll('"', '""')}"`;
  return value;
}

function downloadCsv() {
  const header = "Numer;Angielski;Polski;Dział";
  const rows = TERMS.map((term) =>
    [String(term.id), term.en, term.pl, sectionOf(term.id).title].map(csvCell).join(";"),
  );
  const blob = new Blob(["\uFEFF" + [header, ...rows].join("\n")], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "kampania-fiszki.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function useStudio() {
  const [known, setKnown] = useState<Set<number>>(() => new Set());
  const [learning, setLearning] = useState<Set<number>>(() => new Set());
  const [direction, setDirection] = useState<Direction>(EMPTY.direction);
  const [pool, setPool] = useState<Pool>(EMPTY.pool);
  const [length, setLength] = useState<Length>(EMPTY.length);
  const [section, setSection] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Partial<Saved>;
        setKnown(new Set(saved.known ?? []));
        setLearning(new Set(saved.learning ?? []));
        if (saved.direction) setDirection(saved.direction);
        if (saved.pool) setPool(saved.pool);
        if (saved.length) setLength(saved.length);
        if (typeof saved.section === "number") setSection(saved.section);
      }
    } catch {
      /* ignore broken local storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const payload: Saved = {
      known: [...known],
      learning: [...learning],
      direction,
      pool,
      length,
      section,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [known, learning, direction, pool, length, section, hydrated]);

  function mark(id: number, grade: Grade | "new") {
    setKnown((prev) => {
      const next = new Set(prev);
      if (grade === "known") next.add(id);
      else next.delete(id);
      return next;
    });
    setLearning((prev) => {
      const next = new Set(prev);
      if (grade === "learning") next.add(id);
      else next.delete(id);
      return next;
    });
  }

  function reset() {
    setKnown(new Set());
    setLearning(new Set());
  }

  return {
    known,
    learning,
    direction,
    setDirection,
    pool,
    setPool,
    length,
    setLength,
    section,
    setSection,
    mark,
    reset,
  };
}

export function KampaniaApp() {
  const studio = useStudio();
  const [view, setView] = useState<View>("home");
  const [deck, setDeck] = useState<Term[]>([]);
  const [session, setSession] = useState(0);
  const [notice, setNotice] = useState("");

  const available = useMemo(
    () => TERMS.filter((term) => inPool(term, studio.section, studio.pool, studio.known)).length,
    [studio.section, studio.pool, studio.known],
  );

  function start(next: View, custom?: Term[]) {
    const cards = custom ?? buildDeck(studio.section, studio.pool, studio.length, studio.known);
    if (cards.length === 0) {
      setNotice("W tym zestawie nie ma już haseł. Wybierz „Wszystkie” albo zresetuj postęp.");
      setView("home");
      return;
    }
    setNotice("");
    setDeck(cards);
    setSession((value) => value + 1);
    setView(next);
  }

  return (
    <main className="min-h-screen bg-paper text-ink">
      {view === "home" ? (
        <Home
          known={studio.known}
          learning={studio.learning}
          direction={studio.direction}
          pool={studio.pool}
          length={studio.length}
          section={studio.section}
          available={available}
          notice={notice}
          onDirection={studio.setDirection}
          onPool={studio.setPool}
          onLength={studio.setLength}
          onSection={studio.setSection}
          onStart={() => start("study")}
          onQuiz={() => start("quiz")}
          onList={() => setView("list")}
          onReset={studio.reset}
        />
      ) : null}
      {view === "study" ? (
        <Study
          key={session}
          deck={deck}
          direction={studio.direction}
          onGrade={studio.mark}
          onClose={() => setView("home")}
          onAgain={(cards) => start("study", cards)}
        />
      ) : null}
      {view === "quiz" ? (
        <Quiz
          key={session}
          deck={deck}
          direction={studio.direction}
          onGrade={studio.mark}
          onClose={() => setView("home")}
          onAgain={(cards) => start("quiz", cards)}
        />
      ) : null}
      {view === "list" ? (
        <Glossary
          known={studio.known}
          learning={studio.learning}
          section={studio.section}
          onSection={studio.setSection}
          onMark={studio.mark}
          onClose={() => setView("home")}
        />
      ) : null}
    </main>
  );
}

function Home({
  known,
  learning,
  direction,
  pool,
  length,
  section,
  available,
  notice,
  onDirection,
  onPool,
  onLength,
  onSection,
  onStart,
  onQuiz,
  onList,
  onReset,
}: {
  known: Set<number>;
  learning: Set<number>;
  direction: Direction;
  pool: Pool;
  length: Length;
  section: number;
  available: number;
  notice: string;
  onDirection: (value: Direction) => void;
  onPool: (value: Pool) => void;
  onLength: (value: Length) => void;
  onSection: (value: number) => void;
  onStart: () => void;
  onQuiz: () => void;
  onList: () => void;
  onReset: () => void;
}) {
  const [confirmReset, setConfirmReset] = useState(false);
  const sessionCount = Math.min(available, length);
  const sample = TERMS[61];

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-6 md:px-8 md:py-10">
      <header className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium tracking-widest text-muted uppercase">Grupa 2</p>
          <h1 className="font-display text-4xl tracking-tight text-balance md:text-5xl">Kampania</h1>
          <p className="mt-1 max-w-md text-pretty text-muted">
            300 haseł z reklamy. Angielski i polski — fiszki, quiz albo cały słownik.
          </p>
        </div>
        <p className="text-right">
          <span className="font-display text-4xl tabular-nums md:text-5xl">{known.size}</span>
          <span className="block text-sm text-muted tabular-nums">z 300 umiem</span>
        </p>
      </header>

      <div className="h-1 overflow-hidden rounded-full bg-line">
        <div
          className="h-full bg-accent"
          style={{ width: `${(known.size / TERMS.length) * 100}%` }}
        />
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <section className="flex flex-col gap-5">
          <fieldset className="flex flex-col gap-2">
            <legend className="text-sm font-medium">Kierunek</legend>
            <Segmented
              value={direction}
              onChange={onDirection}
              options={[
                { value: "en-pl", label: "EN → PL" },
                { value: "pl-en", label: "PL → EN" },
                { value: "mix", label: "Mix" },
              ]}
            />
          </fieldset>

          <div className="grid gap-4 sm:grid-cols-2">
            <fieldset className="flex flex-col gap-2">
              <legend className="text-sm font-medium">Ile haseł</legend>
              <Segmented
                value={length}
                onChange={onLength}
                options={[
                  { value: 10, label: "10" },
                  { value: 20, label: "20" },
                  { value: 50, label: "50" },
                  { value: 300, label: "Wszystkie" },
                ]}
              />
            </fieldset>
            <fieldset className="flex flex-col gap-2">
              <legend className="text-sm font-medium">Zestaw</legend>
              <Segmented
                value={pool}
                onChange={onPool}
                options={[
                  { value: "all", label: "Całość" },
                  { value: "open", label: "Bez umianych" },
                ]}
              />
            </fieldset>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={onStart}
              disabled={sessionCount === 0}
              className="h-12 rounded-full bg-ink px-5 font-medium text-paper disabled:opacity-40"
            >
              Zacznij fiszki · {sessionCount}
            </button>
            <button
              type="button"
              onClick={onQuiz}
              disabled={sessionCount === 0}
              className="h-12 rounded-full border border-ink bg-card px-5 font-medium text-ink disabled:opacity-40"
            >
              Quiz · {sessionCount}
            </button>
          </div>
          {notice ? <p className="text-sm text-accent">{notice}</p> : null}

          <div className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between">
              <h2 className="text-sm font-medium">Dział</h2>
              <p className="text-sm text-muted tabular-nums">{learning.size} w nauce</p>
            </div>
            <button
              type="button"
              aria-pressed={section === 0}
              onClick={() => onSection(0)}
              className={
                "flex h-12 items-center justify-between rounded-2xl border px-4 text-left " +
                (section === 0 ? "border-ink bg-ink text-paper" : "border-line bg-card text-ink")
              }
            >
              <span className="font-medium">Wszystkie działy</span>
              <span className={"tabular-nums " + (section === 0 ? "opacity-70" : "text-muted")}>
                {known.size}/300
              </span>
            </button>
            <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {SECTIONS.map((item) => (
                <li key={item.id}>
                  <SectionButton
                    item={item}
                    active={section === item.id}
                    known={TERMS.filter((term) => term.section === item.id && known.has(term.id)).length}
                    onClick={() => onSection(item.id)}
                  />
                </li>
              ))}
            </ul>
          </div>
        </section>

        <aside className="flex flex-col gap-4 lg:sticky lg:top-6">
          <article className="lift relative overflow-hidden rounded-3xl border border-line bg-card p-6">
            <span className="absolute top-4 left-4 h-3 w-3 border-t border-l border-line" />
            <span className="absolute top-4 right-4 h-3 w-3 border-t border-r border-line" />
            <span className="absolute bottom-4 left-4 h-3 w-3 border-b border-l border-line" />
            <span className="absolute right-4 bottom-4 h-3 w-3 border-r border-b border-line" />
            <p className="text-xs font-medium tracking-widest text-muted uppercase">
              {pad(sample.id)} · {sectionOf(sample.id).title}
            </p>
            <h2 className={`term mt-10 ${termSize(sample.en)}`}>{sample.en}</h2>
            <p className="mt-4 text-lg text-muted">{sample.pl}</p>
            <p className="mt-10 text-xs tracking-widest text-accent uppercase">Próbka fiszki</p>
          </article>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
            <button type="button" onClick={onList} className="underline decoration-line underline-offset-4">
              Lista haseł
            </button>
            <button
              type="button"
              onClick={downloadCsv}
              className="inline-flex items-center gap-1 underline decoration-line underline-offset-4"
            >
              <Download className="size-4" aria-hidden="true" />
              Pobierz CSV
            </button>
            {confirmReset ? (
              <span className="inline-flex items-center gap-2">
                <button type="button" className="text-accent" onClick={() => { onReset(); setConfirmReset(false); }}>
                  Wyczyść postęp
                </button>
                <button type="button" onClick={() => setConfirmReset(false)}>
                  Anuluj
                </button>
              </span>
            ) : (
              <button type="button" className="text-muted" onClick={() => setConfirmReset(true)}>
                Reset
              </button>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

function SectionButton({
  item,
  active,
  known,
  onClick,
}: {
  item: Section;
  active: boolean;
  known: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={
        "flex h-16 w-full flex-col items-start justify-center rounded-2xl border px-3 text-left " +
        (active ? "border-ink bg-ink text-paper" : "border-line bg-card text-ink")
      }
    >
      <span className="w-full truncate text-sm font-medium">{item.short}</span>
      <span className={"text-xs tabular-nums " + (active ? "opacity-70" : "text-muted")}>{known}/20</span>
    </button>
  );
}

function Segmented<T extends string | number>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div className="flex rounded-full border border-line bg-card p-1">
      {options.map((option) => {
        const on = option.value === value;
        return (
          <button
            key={String(option.value)}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(option.value)}
            className={
              "h-10 min-w-0 flex-1 rounded-full px-2 text-sm font-medium " +
              (on ? "bg-ink text-paper" : "text-ink")
            }
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function ScreenHeader({
  title,
  detail,
  onClose,
}: {
  title: string;
  detail: string;
  onClose: () => void;
}) {
  return (
    <header className="mx-auto flex w-full max-w-3xl items-center gap-3 px-4 py-4 md:px-0">
      <button
        type="button"
        onClick={onClose}
        className="inline-flex h-11 items-center gap-1 rounded-full border border-line bg-card px-3 text-sm"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Wróć
      </button>
      <div className="min-w-0">
        <p className="truncate font-medium">{title}</p>
        <p className="truncate text-sm text-muted">{detail}</p>
      </div>
    </header>
  );
}

function Study({
  deck,
  direction,
  onGrade,
  onClose,
  onAgain,
}: {
  deck: Term[];
  direction: Direction;
  onGrade: (id: number, grade: Grade) => void;
  onClose: () => void;
  onAgain: (cards: Term[]) => void;
}) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [prompt, setPrompt] = useState<Lang>(() => promptOf(direction));
  const [knownCount, setKnownCount] = useState(0);
  const [missed, setMissed] = useState<Term[]>([]);
  const live = useRef({ index, flipped, deck, prompt });
  live.current = { index, flipped, deck, prompt };

  function advance(grade: Grade) {
    const current = live.current;
    const card = current.deck[current.index];
    if (!card || !current.flipped) return;
    onGrade(card.id, grade);
    if (grade === "known") setKnownCount((count) => count + 1);
    else setMissed((items) => [...items, card]);
    setFlipped(false);
    setPrompt(promptOf(direction));
    setIndex((value) => value + 1);
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
      if (live.current.index >= live.current.deck.length) return;
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        setFlipped((value) => !value);
      } else if (event.key === "ArrowRight") {
        advance("known");
      } else if (event.key === "ArrowLeft") {
        advance("learning");
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const card = deck[index];
  if (!card) {
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 py-6">
        <ScreenHeader title="Koniec sesji" detail={`${knownCount} umiem · ${missed.length} do powtórki`} onClose={onClose} />
        <div className="flex flex-1 flex-col items-start justify-center gap-4 py-10">
          <p className="font-display text-5xl tabular-nums">
            {knownCount}
            <span className="text-muted">/{deck.length}</span>
          </p>
          <p className="max-w-md text-pretty text-muted">
            {missed.length === 0
              ? "Cała talia bez pomyłki."
              : "Hasła oznaczone jako nieumiane wrócą, gdy wybierzesz zestaw „Bez umianych”."}
          </p>
          <div className="flex flex-wrap gap-3">
            {missed.length > 0 ? (
              <button
                type="button"
                onClick={() => onAgain(shuffle(missed))}
                className="h-12 rounded-full bg-ink px-5 font-medium text-paper"
              >
                Powtórz nieumiane · {missed.length}
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => onAgain(shuffle(deck))}
              className="h-12 rounded-full border border-ink bg-card px-5 font-medium"
            >
              Jeszcze raz
            </button>
          </div>
        </div>
      </div>
    );
  }

  const front = faceText(card, prompt);
  const back = faceText(card, other(prompt));
  const section = sectionOf(card.id);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 pb-8">
      <ScreenHeader
        title="Fiszki"
        detail={`${index + 1} / ${deck.length} · ${knownCount} umiem · ${missed.length} do powtórki`}
        onClose={onClose}
      />
      <div className="mb-4 h-1 overflow-hidden rounded-full bg-line">
        <div className="h-full bg-accent" style={{ width: `${(index / deck.length) * 100}%` }} />
      </div>
      <div className="scene relative">
        <button
          type="button"
          aria-label={flipped ? "Ukryj tłumaczenie" : "Pokaż tłumaczenie"}
          onClick={() => setFlipped((value) => !value)}
          className="block w-full text-left"
        >
          <div className={"flipper " + (flipped ? "is-flipped" : "")}>
            <CardFace
              kicker={`${pad(card.id)} · ${section.title}`}
              label={langName(prompt)}
              text={front}
            />
            <CardFace
              back
              kicker="tłumaczenie"
              label={langName(other(prompt))}
              text={back}
            />
          </div>
        </button>
        <button
          type="button"
          onClick={() => speakEnglish(card.en)}
          aria-label="Odsłuchaj angielskie hasło"
          className="absolute top-4 right-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-card"
        >
          <Volume2 className="size-4" aria-hidden="true" />
        </button>
      </div>
      <p className="sr-only" aria-live="polite">
        {flipped ? `Tłumaczenie: ${back}` : `Hasło: ${front}`}
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          type="button"
          disabled={!flipped}
          onClick={() => advance("learning")}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-line bg-card font-medium disabled:opacity-40"
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          Nie umiem
        </button>
        <button
          type="button"
          disabled={!flipped}
          onClick={() => advance("known")}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ink font-medium text-paper disabled:opacity-40"
        >
          <Check className="size-4" aria-hidden="true" />
          Umiem
        </button>
      </div>
      <p className="mt-3 hidden text-center text-sm text-muted md:block">
        Spacja odwraca kartę · strzałka w lewo: nie umiem · strzałka w prawo: umiem
      </p>
    </div>
  );
}

function CardFace({
  kicker,
  label,
  text,
  back = false,
}: {
  kicker: string;
  label: string;
  text: string;
  back?: boolean;
}) {
  return (
    <div
      className={
        "face lift flex flex-col justify-between rounded-3xl border border-line p-6 md:p-8 " +
        (back ? "face-back bg-ink text-paper" : "bg-card text-ink")
      }
    >
      <div className="flex items-center justify-between gap-3 pr-12">
        <p className={"text-xs font-medium tracking-widest uppercase " + (back ? "text-paper/70" : "text-muted")}>
          {kicker}
        </p>
      </div>
      <h2 className={`term ${termSize(text)}`}>{text}</h2>
      <p className={"text-sm tracking-widest uppercase " + (back ? "text-paper/70" : "text-accent")}>{label}</p>
    </div>
  );
}

function optionsFor(card: Term, ask: Lang): string[] {
  const answerKey = other(ask);
  const answer = faceText(card, answerKey);
  const seen = new Set([fold(answer)]);
  const picked: string[] = [];
  const sources = [
    shuffle(TERMS.filter((term) => term.section === card.section && term.id !== card.id)),
    shuffle(TERMS.filter((term) => term.id !== card.id)),
  ];
  for (const source of sources) {
    for (const term of source) {
      const value = faceText(term, answerKey);
      const key = fold(value);
      if (seen.has(key)) continue;
      seen.add(key);
      picked.push(value);
      if (picked.length === 3) return shuffle([answer, ...picked]);
    }
  }
  return shuffle([answer, ...picked]);
}

function Quiz({
  deck,
  direction,
  onGrade,
  onClose,
  onAgain,
}: {
  deck: Term[];
  direction: Direction;
  onGrade: (id: number, grade: Grade) => void;
  onClose: () => void;
  onAgain: (cards: Term[]) => void;
}) {
  const [setup] = useState(() => {
    const lang = promptOf(direction);
    return { ask: lang, choices: optionsFor(deck[0], lang) };
  });
  const [index, setIndex] = useState(0);
  const [ask, setAsk] = useState<Lang>(setup.ask);
  const [choices, setChoices] = useState<string[]>(setup.choices);
  const [picked, setPicked] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [missed, setMissed] = useState<Term[]>([]);

  const card = deck[index];

  function load(nextIndex: number) {
    const nextCard = deck[nextIndex];
    const lang = promptOf(direction);
    setIndex(nextIndex);
    setAsk(lang);
    setChoices(nextCard ? optionsFor(nextCard, lang) : []);
    setPicked(null);
  }

  if (!card) {
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 py-6">
        <ScreenHeader title="Wynik quizu" detail={`${correctCount} dobrych odpowiedzi`} onClose={onClose} />
        <div className="flex flex-1 flex-col items-start justify-center gap-4 py-8">
          <p className="font-display text-5xl tabular-nums">
            {correctCount}
            <span className="text-muted">/{deck.length}</span>
          </p>
          {missed.length > 0 ? (
            <ul className="flex w-full flex-col gap-2">
              {missed.map((term) => (
                <li key={term.id} className="rounded-2xl border border-line bg-card px-4 py-3">
                  <p className="font-medium">{term.en}</p>
                  <p className="text-muted">{term.pl}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">Bez błędu.</p>
          )}
          <div className="flex flex-wrap gap-3">
            {missed.length > 0 ? (
              <button
                type="button"
                onClick={() => onAgain(shuffle(missed))}
                className="h-12 rounded-full bg-ink px-5 font-medium text-paper"
              >
                Powtórz błędy · {missed.length}
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => onAgain(shuffle(deck))}
              className="h-12 rounded-full border border-ink bg-card px-5 font-medium"
            >
              Nowy quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  const prompt = faceText(card, ask);
  const answer = faceText(card, other(ask));

  function choose(value: string) {
    if (picked) return;
    setPicked(value);
    const ok = fold(value) === fold(answer);
    onGrade(card.id, ok ? "known" : "learning");
    if (ok) setCorrectCount((count) => count + 1);
    else setMissed((items) => [...items, card]);
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 pb-8">
      <ScreenHeader
        title="Quiz"
        detail={`${index + 1} / ${deck.length} · ${correctCount} dobrze`}
        onClose={onClose}
      />
      <div className="mb-4 h-1 overflow-hidden rounded-full bg-line">
        <div className="h-full bg-accent" style={{ width: `${(index / deck.length) * 100}%` }} />
      </div>
      <div className="rounded-3xl border border-line bg-card p-6">
        <p className="text-xs font-medium tracking-widest text-muted uppercase">
          {pad(card.id)} · {langName(ask)}
        </p>
        <h2 className={`term mt-6 ${termSize(prompt)}`}>{prompt}</h2>
      </div>
      <ul className="mt-4 flex flex-col gap-2">
        {choices.map((choice, choiceIndex) => {
          const isAnswer = fold(choice) === fold(answer);
          const isPicked = picked === choice;
          let tone = "border-line bg-card text-ink";
          if (picked && isAnswer) tone = "border-ink bg-ink text-paper";
          else if (picked && isPicked) tone = "border-accent bg-card text-accent";
          return (
            <li key={choice}>
              <button
                type="button"
                disabled={picked !== null}
                onClick={() => choose(choice)}
                className={`flex min-h-12 w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left ${tone}`}
              >
                <span className="w-5 shrink-0 text-sm tabular-nums opacity-70">{choiceIndex + 1}</span>
                <span className="font-medium">{choice}</span>
                {picked && isAnswer ? <span className="ml-auto text-sm">Dobrze</span> : null}
                {picked && isPicked && !isAnswer ? <span className="ml-auto text-sm">Źle</span> : null}
              </button>
            </li>
          );
        })}
      </ul>
      {picked ? (
        <button
          type="button"
          onClick={() => load(index + 1)}
          className="mt-4 h-12 rounded-full bg-accent font-medium text-on-accent"
        >
          Dalej
        </button>
      ) : (
        <p className="mt-4 text-sm text-muted">Wybierz tłumaczenie. Dobre odpowiedzi zapisują się jako umiane.</p>
      )}
    </div>
  );
}

function Glossary({
  known,
  learning,
  section,
  onSection,
  onMark,
  onClose,
}: {
  known: Set<number>;
  learning: Set<number>;
  section: number;
  onSection: (value: number) => void;
  onMark: (id: number, grade: Grade | "new") => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [hide, setHide] = useState(false);
  const [open, setOpen] = useState<Set<number>>(() => new Set());
  const needle = fold(query.trim());

  const groups = SECTIONS.filter((item) => section === 0 || item.id === section)
    .map((item) => ({
      item,
      terms: TERMS.filter((term) => {
        if (term.section !== item.id) return false;
        if (!needle) return true;
        return fold(term.en).includes(needle) || fold(term.pl).includes(needle) || String(term.id) === query.trim();
      }),
    }))
    .filter((group) => group.terms.length > 0);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 pb-10">
      <ScreenHeader title="Słownik" detail={`${TERMS.length} haseł · ${known.size} umiem`} onClose={onClose} />
      <div className="flex flex-col gap-3">
        <label className="relative block">
          <span className="sr-only">Szukaj hasła</span>
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Szukaj po angielsku lub polsku"
            className="h-12 w-full rounded-full border border-line bg-card pr-4 pl-10 text-ink outline-none placeholder:text-muted"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          <FilterChip active={section === 0} onClick={() => onSection(0)}>
            Wszystkie
          </FilterChip>
          {SECTIONS.map((item) => (
            <FilterChip key={item.id} active={section === item.id} onClick={() => onSection(item.id)}>
              {item.short}
            </FilterChip>
          ))}
        </div>
        <button
          type="button"
          aria-pressed={hide}
          onClick={() => setHide((value) => !value)}
          className="h-10 self-start rounded-full border border-line bg-card px-4 text-sm"
        >
          {hide ? "Pokaż tłumaczenia" : "Ukryj tłumaczenia"}
        </button>
      </div>

      {groups.length === 0 ? (
        <p className="mt-8 text-muted">Nic nie pasuje do „{query}”.</p>
      ) : (
        groups.map((group) => (
          <section key={group.item.id} className="mt-8">
            <h2 className="font-display text-2xl text-balance">{group.item.title}</h2>
            <p className="text-sm text-muted">{group.item.en}</p>
            <ul className="mt-3 divide-y divide-line border-y border-line">
              {group.terms.map((term) => {
                const shown = !hide || open.has(term.id) || needle.length > 0;
                const status = known.has(term.id) ? "known" : learning.has(term.id) ? "learning" : "new";
                return (
                  <li key={term.id} className="flex items-start gap-3 py-3">
                    <button
                      type="button"
                      aria-label={status === "known" ? "Oznacz jako nieumiane" : "Oznacz jako umiane"}
                      aria-pressed={status === "known"}
                      onClick={() => onMark(term.id, status === "known" ? "new" : "known")}
                      className={
                        "mt-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border " +
                        (status === "known"
                          ? "border-ink bg-ink text-paper"
                          : status === "learning"
                            ? "border-accent text-accent"
                            : "border-line bg-card text-muted")
                      }
                    >
                      {status === "known" ? <Check className="size-4" /> : <span className="text-xs tabular-nums">{term.id}</span>}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setOpen((prev) => {
                          const next = new Set(prev);
                          if (next.has(term.id)) next.delete(term.id);
                          else next.add(term.id);
                          return next;
                        })
                      }
                      className="min-w-0 flex-1 py-2 text-left"
                    >
                      <p className="font-medium text-pretty">{term.en}</p>
                      <p className="text-pretty text-muted">{shown ? term.pl : "kliknij, aby odkryć"}</p>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={
        "h-10 rounded-full border px-3 text-sm " +
        (active ? "border-ink bg-ink text-paper" : "border-line bg-card text-ink")
      }
    >
      {children}
    </button>
  );
}
