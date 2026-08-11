import { useState, useEffect } from "react";
import "./App.css";

/* ---------- Helper: syntax highlight sederhana ---------- */
function escapeHtml(str: string) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function highlight(code: string) {
  const escaped = escapeHtml(code);
  const pattern =
    /(\/\/[^\n]*)|('[^']*'|"[^"]*"|`[^`]*`)|\b(import|export|from|default|const|let|var|function|return|if|else|new|class|extends|useState|useEffect|useRef|useContext|useMemo|useCallback|true|false|null)\b/g;
  return escaped.replace(
    pattern,
    (match: string, comment: string, string: string, keyword: string) => {
    if (comment) return `<span class="tok-comment">${comment}</span>`;
    if (string) return `<span class="tok-string">${string}</span>`;
    if (keyword) return `<span class="tok-keyword">${keyword}</span>`;
    return match;
  });
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="code-block">
      <code dangerouslySetInnerHTML={{ __html: highlight(code) }} />
    </pre>
  );
}

/* ---------- Demo tiap modul ---------- */
function ComponentDemo() {
  return (
    <div className="demo-box">
      <p className="demo-note">Halo! Ini tampilan dari sebuah Component.</p>
    </div>
  );
}

function ProfileCard({ name, role }: { name: string; role: string }) {
  return (
    <div className="mini-card">
      <strong>{name}</strong>
      <span>{role}</span>
    </div>
  );
}
function PropsDemo() {
  return (
    <div className="demo-box demo-row">
      <ProfileCard name="Dinda" role="Frontend Developer" />
      <ProfileCard name="Raka" role="UI Designer" />
    </div>
  );
}

function CounterDemo() {
  const [count, setCount] = useState(0);
  return (
    <div className="demo-box">
      <p className="demo-value">{count}</p>
      <div className="demo-controls">
        <button onClick={() => setCount((c) => c - 1)}>-</button>
        <button onClick={() => setCount(0)}>Reset</button>
        <button onClick={() => setCount((c) => c + 1)}>+</button>
      </div>
    </div>
  );
}

function EffectDemo() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  return (
    <div className="demo-box">
      <p className="demo-value">{seconds}s</p>
      <div className="demo-controls">
        <button onClick={() => setRunning((r) => !r)}>
          {running ? "Jeda" : "Lanjut"}
        </button>
        <button onClick={() => setSeconds(0)}>Reset</button>
      </div>
    </div>
  );
}

function ToggleDemo() {
  const [show, setShow] = useState(true);
  return (
    <div className="demo-box">
      <button onClick={() => setShow((s) => !s)}>
        {show ? "Sembunyikan" : "Tampilkan"}
      </button>
      {show && (
        <p className="demo-note">Elemen ini muncul karena kondisinya true.</p>
      )}
    </div>
  );
}

function ListDemo() {
  const [items, setItems] = useState([
    "Belajar Component",
    "Belajar Props",
    "Belajar State",
  ]);
  const [text, setText] = useState("");

  function addItem() {
    if (!text.trim()) return;
    setItems((prev) => [...prev, text.trim()]);
    setText("");
  }
  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="demo-box">
      <div className="demo-input-row">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addItem()}
          placeholder="Tambah tugas..."
        />
        <button onClick={addItem}>Tambah</button>
      </div>
      <ul className="demo-list">
        {items.map((item, index) => (
          <li key={item + index}>
            <span>{item}</span>
            <button onClick={() => removeItem(index)} aria-label="Hapus">
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function EventDemo() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  return (
    <div
      className="demo-box demo-track"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setPos({
          x: Math.round(e.clientX - rect.left),
          y: Math.round(e.clientY - rect.top),
        });
      }}
    >
      <p className="demo-note">Gerakkan mouse di area ini</p>
      <p className="demo-value">
        x: {pos.x}, y: {pos.y}
      </p>
    </div>
  );
}

function useToggle(initial = false): [boolean, () => void] {
  const [value, setValue] = useState(initial);
  const toggle = () => setValue((v) => !v);
  return [value, toggle];
}
function CustomHookDemo() {
  const [isOn, toggle] = useToggle(false);
  return (
    <div className="demo-box">
      <button
        onClick={toggle}
        className={isOn ? "demo-switch on" : "demo-switch"}
      >
        {isOn ? "Menyala" : "Mati"}
      </button>
    </div>
  );
}

/* ---------- Data modul ---------- */
const modules = [
  {
    number: "01",
    id: "component",
    title: "Component",
    tag: "Dasar",
    description:
      "Component adalah blok bangunan paling dasar di React. Setiap component adalah fungsi JavaScript yang mengembalikan tampilan (JSX).",
    code: `function Greeting() {
  return <p>Halo, ini component pertama saya!</p>;
}

export default Greeting;`,
    demo: ComponentDemo,
  },
  {
    number: "02",
    id: "props",
    title: "Props",
    tag: "Data masuk",
    description:
      "Props adalah cara mengirim data dari component induk ke component anak. Sifatnya read-only, tidak boleh diubah dari dalam.",
    code: `function ProfileCard({ name, role }) {
  return (
    <div>
      <strong>{name}</strong>
      <span>{role}</span>
    </div>
  );
}

<ProfileCard name="Dinda" role="Frontend Developer" />`,
    demo: PropsDemo,
  },
  {
    number: "03",
    id: "state",
    title: "State",
    tag: "useState",
    description:
      "State adalah data internal yang bisa berubah dan membuat component render ulang. Dikelola dengan hook useState.",
    code: `import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      {count}
    </button>
  );
}`,
    demo: CounterDemo,
  },
  {
    number: "04",
    id: "effect",
    title: "Effect",
    tag: "useEffect",
    description:
      "useEffect menjalankan efek samping setelah render, misalnya timer, fetch data, atau berlangganan event. Jangan lupa function cleanup.",
    code: `import { useState, useEffect } from 'react';

function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);

    return () => clearInterval(id);
  }, []);

  return <p>{seconds} detik</p>;
}`,
    demo: EffectDemo,
  },
  {
    number: "05",
    id: "conditional",
    title: "Conditional Rendering",
    tag: "Logika tampilan",
    description:
      "Menampilkan atau menyembunyikan elemen berdasarkan kondisi tertentu, biasanya dengan operator && atau ternary.",
    code: `function Toggle() {
  const [show, setShow] = useState(true);

  return (
    <>
      <button onClick={() => setShow(!show)}>Toggle</button>
      {show && <p>Elemen ini kondisional</p>}
    </>
  );
}`,
    demo: ToggleDemo,
  },
  {
    number: "06",
    id: "list",
    title: "List & Keys",
    tag: "Perulangan",
    description:
      "Merender banyak elemen dari array menggunakan .map(). Setiap elemen butuh prop key yang unik agar React bisa melacak perubahan.",
    code: `function TodoList({ items }) {
  return (
    <ul>
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}`,
    demo: ListDemo,
  },
  {
    number: "07",
    id: "event",
    title: "Event Handling",
    tag: "Interaksi",
    description:
      "React membungkus event browser menjadi SyntheticEvent, dipakai lewat prop seperti onClick, onChange, dan onMouseMove.",
    code: `function TrackMouse() {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  function handleMove(e) {
    setPos({ x: e.clientX, y: e.clientY });
  }

  return <div onMouseMove={handleMove}>{pos.x}, {pos.y}</div>;
}`,
    demo: EventDemo,
  },
  {
    number: "08",
    id: "custom-hook",
    title: "Custom Hook",
    tag: "Pakai ulang",
    description:
      "Custom hook adalah cara membungkus logika berulang (biasanya berbasis useState/useEffect) menjadi function yang bisa dipakai di banyak component.",
    code: `function useToggle(initial = false) {
  const [value, setValue] = useState(initial);
  const toggle = () => setValue((v) => !v);
  return [value, toggle];
}

function Switch() {
  const [isOn, toggle] = useToggle();
  return <button onClick={toggle}>{isOn ? 'ON' : 'OFF'}</button>;
}`,
    demo: CustomHookDemo,
  },
];

/* ---------- App utama ---------- */
export default function App() {
  const [activeId, setActiveId] = useState(modules[0].id);
  const active = modules.find((m) => m.id === activeId) ?? modules[0];
  const Demo = active.demo;

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">{"</>"}</span>
          <span className="brand-name">Modul React</span>
        </div>
        <code className="import-badge">
          import {"{"} Component, Props, State, Hooks {"}"} from 'react'
        </code>
      </header>

      <div className="layout">
        <nav className="sidebar" aria-label="Daftar modul">
          <p className="sidebar-label">Daftar Modul</p>
          <ul>
            {modules.map((m) => (
              <li key={m.id}>
                <button
                  className={m.id === activeId ? "nav-item active" : "nav-item"}
                  onClick={() => setActiveId(m.id)}
                >
                  <span className="nav-number">{m.number}</span>
                  <span className="nav-title">{m.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <main className="content" key={active.id}>
          <div className="content-header">
            <span className="content-number">{active.number}</span>
            <div>
              <span className="content-tag">{active.tag}</span>
              <h1>{active.title}</h1>
            </div>
          </div>

          <p className="content-desc">{active.description}</p>

          <div className="panel-grid">
            <div className="panel">
              <p className="panel-label">Contoh Kode</p>
              <CodeBlock code={active.code} />
            </div>
            <div className="panel">
              <p className="panel-label">Coba Langsung</p>
              <Demo />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
