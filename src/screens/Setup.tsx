import { useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Radio,
  Check,
  LoaderCircle,
  Cable,
  Cpu,
} from "lucide-react";
import { useApp } from "../state/context";
import {
  IconButton,
  Brand,
  Primary,
  HomeIndicator,
  DetailRow,
} from "../components/ui";

export function Setup() {
  const { go, toast } = useApp();
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState("http://127.0.0.1:8000");
  const [checking, setChecking] = useState(false);
  function check() {
    if (!/^https?:\/\//.test(address)) {
      toast("Укажите адрес, начинающийся с http:// или https://");
      return;
    }
    setChecking(true);
    setTimeout(() => {
      setChecking(false);
      setStep(3);
    }, 900);
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
        <div className="controller-object">
          <div className="controller-board">
            <span className="board-label">SPECWATT / GRID</span>
            <Cpu size={55} strokeWidth={1} />
            <span className="board-pins" />
            <span className="board-led" />
            <span className="board-tag">ESP32</span>
          </div>
          <div className="controller-shadow" />
        </div>
        {step === 1 ? (
          <>
            <span className="eyebrow">01 / ЗНАКОМСТВО</span>
            <h1>
              Большое начинается
              <br />с подключения.
            </h1>
            <p className="setup-description">
              Один контроллер. Три канала.
              <br />
              Вся энергия — в понятном интерфейсе.
            </p>
            <div className="setup-checklist">
              <DetailRow
                icon={Cable}
                title="ESP32 и сервер"
                detail="Аппаратное подключение ещё в разработке"
              />
              <DetailRow
                icon={ShieldCheck}
                title="Безопасность по умолчанию"
                detail="CH3 исключён из переключения"
              />
            </div>
            <Primary onClick={() => setStep(2)}>Посмотреть настройку</Primary>
            <button className="text-link" onClick={() => go("home")}>
              Пока изучить демо
              <ArrowRight size={15} />
            </button>
          </>
        ) : step === 2 ? (
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
            <Primary
              onClick={check}
              icon={checking ? LoaderCircle : ArrowRight}
            >
              {checking ? "Проверка демо…" : "Продолжить настройку"}
            </Primary>
          </>
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
      <HomeIndicator />
    </>
  );
}
