import { useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Radio,
  Check,
  Cable,
  LockKeyhole,
} from "lucide-react";
import { useApp } from "../state/context";
import { IconButton, Brand, Primary } from "../components/ui";
import { ConnectionTopology } from "../components/ConnectionTopology";

export function Setup({ initialStep = 1 }: { initialStep?: number }) {
  const { go, toast } = useApp();
  const [step, setStep] = useState(initialStep);
  const [address, setAddress] = useState("http://127.0.0.1:8000");
  const [mode, setMode] = useState<"demo" | "hardware">("demo");
  function check() {
    let valid = false;
    try {
      const url = new URL(address);
      valid =
        ["http:", "https:"].includes(url.protocol) && Boolean(url.hostname);
    } catch {
      /* Keep invalid input visible. */
    }
    if (!valid) {
      toast("Укажите адрес, начинающийся с http:// или https://");
      return;
    }
    setStep(3);
  }
  return (
    <>
      <main className="screen-content setup-content">
        <div className="setup-top">
          <IconButton
            icon={ArrowLeft}
            label="Назад"
            onClick={() => (step > 1 ? setStep(step - 1) : go("welcome"))}
          />
          <Brand small />
          <span>0{step} / 03</span>
        </div>
        <div className="setup-step-track">
          {[1, 2, 3].map((n) => (
            <i key={n} className={step >= n ? "active" : ""} />
          ))}
        </div>
        <ConnectionTopology step={step} />
        {step === 1 ? (
          <>
            <span className="eyebrow">01 / ЗНАКОМСТВО</span>
            <h1>
              Начните с демо.
              <br />
              Подключайте осознанно.
            </h1>
            <p className="setup-description">
              Один контроллер. Три канала.
              <br />
              Вся энергия — в понятном интерфейсе.
            </p>
            <div className="setup-modes">
              <button
                className={mode === "demo" ? "selected" : ""}
                aria-pressed={mode === "demo"}
                onClick={() => setMode("demo")}
              >
                <Radio size={23} />
                <span>
                  <b>Изучить демонстрацию</b>
                  <small>Без оборудования · локальные данные</small>
                </span>
                {mode === "demo" && <Check size={18} />}
              </button>
              <button
                className={mode === "hardware" ? "selected" : ""}
                aria-pressed={mode === "hardware"}
                onClick={() => setMode("hardware")}
              >
                <Cable size={23} />
                <span>
                  <b>У меня есть контроллер</b>
                  <small>Посмотреть требования к подключению</small>
                </span>
                {mode === "hardware" && <Check size={18} />}
              </button>
            </div>
            <Primary onClick={() => setStep(2)}>Посмотреть настройку</Primary>
            <button className="text-link" onClick={() => go("home")}>
              Пока изучить демо
              <ArrowRight size={15} />
            </button>
          </>
        ) : step === 2 ? (
          mode === "hardware" ? (
            <>
              <span className="eyebrow">02 / РЕАЛЬНЫЙ КОНТРОЛЛЕР</span>
              <h1>
                Подключение требует
                <br />
                настоящего протокола.
              </h1>
              <section className="hardware-unavailable">
                <LockKeyhole size={28} />
                <h2>Сопряжение пока недоступно</h2>
                <p>
                  Этот веб-прототип не отправляет запросы ESP32. Для подключения
                  нужны проверенные адрес сервера, протокол и подтверждение
                  состояния оборудования.
                </p>
                <Primary disabled onClick={() => {}} icon={LockKeyhole}>
                  Подключение недоступно
                </Primary>
              </section>
              <button className="text-link" onClick={() => setMode("demo")}>
                Продолжить в демо
                <ArrowRight size={15} />
              </button>
            </>
          ) : (
            <>
              <span className="eyebrow">02 / ПАРАМЕТРЫ</span>
              <h1>
                Задайте точку
                <br />
                подключения.
              </h1>
              <p className="setup-description">
                Это демонстрация настройки. Прототип
                <br />
                не отправляет сетевые запросы на этот адрес.
              </p>
              <label className="form-label setup-address">
                Адрес сервера
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="https://your-server.example"
                  type="url"
                />
              </label>
              <p className="fine-note">
                Адрес не сохраняется и не передаётся третьим лицам. Реальное
                сопряжение требует подтверждённого протокола ESP32.
              </p>
              <Primary onClick={check} icon={ArrowRight}>
                Продолжить настройку
              </Primary>
            </>
          )
        ) : (
          <>
            <span className="eyebrow">03 / ГОТОВО К ЗНАКОМСТВУ</span>
            <h1>
              Ваш интерфейс
              <br />
              готов к исследованию.
            </h1>
            <p className="setup-description">
              Открываем локальную демо-сессию.
              <br />
              Физическое устройство не подключено.
            </p>
            <div className="setup-result">
              <Radio size={22} />
              <span>
                <strong>Демонстрационный стенд</strong>
                <small>CH1 · CH2 · CH3 protected</small>
              </span>
              <Check size={20} />
            </div>
            <Primary
              onClick={() => {
                go("home");
                toast("Открыта демо-сессия без оборудования");
              }}
            >
              Начать знакомство
            </Primary>
          </>
        )}
      </main>
    </>
  );
}
