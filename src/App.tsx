import React, { useEffect, useState } from "react";

type Screen =
  | "register"
  | "otp"
  | "team"
  | "confirmation"
  | "dashboard"
  | "shortlisting"
  | "result"
  | "ep1"
  | "ep2"
  | "ep3"
  | "finalResult"
  | "wrapped";

type RoundKey = "shortlisting" | "ep1" | "ep2" | "ep3";
type RoundStatus = "locked" | "live" | "ended";

type ScheduleItem = {
  title: string;
  subtitle: string;
  start: string;
  end: string;
};

const API_BASE = "http://localhost:3000";

/*
=========================================================
 PANDORA EVENT SCHEDULE
=========================================================

CHANGE THESE DATES/TIMES TO YOUR REAL EVENT TIMINGS.

Format:
YYYY-MM-DDTHH:MM:SS+05:30

+05:30 = IST
=========================================================
*/

const EVENT_SCHEDULE: Record<RoundKey, ScheduleItem> = {
  shortlisting: {
    title: "SHORTLISTING",
    subtitle: "The teams are being evaluated.",
    start: "2026-09-26T10:00:00+05:30",
    end: "2026-09-26T18:00:00+05:30",
  },

  ep1: {
    title: "EPISODE 01",
    subtitle: "The first door opens.",
    start: "2026-09-27T10:00:00+05:30",
    end: "2026-09-27T18:00:00+05:30",
  },

  ep2: {
    title: "EPISODE 02",
    subtitle: "Go deeper into Pandora.",
    start: "2026-09-28T10:00:00+05:30",
    end: "2026-09-28T18:00:00+05:30",
  },

  ep3: {
    title: "EPISODE 03",
    subtitle: "The final trial begins.",
    start: "2026-09-29T10:00:00+05:30",
    end: "2026-09-29T18:00:00+05:30",
  },
};

const MAX_PHOTO_SIZE = 5 * 1024 * 1024;

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>("register");
  const [now, setNow] = useState(Date.now());
  const [transitioning, setTransitioning] = useState(false);

  // Registration
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // OTP
  const [otp, setOtp] = useState("");
  const [demoOtp, setDemoOtp] = useState("");

  // Team
  const [teamName, setTeamName] = useState("");
  const [member2, setMember2] = useState("");
  const [member3, setMember3] = useState("");
  const [member4, setMember4] = useState("");

  // Team photos
  const [leaderPhoto, setLeaderPhoto] = useState<File | null>(null);
  const [member2Photo, setMember2Photo] = useState<File | null>(null);
  const [member3Photo, setMember3Photo] = useState<File | null>(null);
  const [member4Photo, setMember4Photo] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  /*
  ========================================================
  CLOCK
  ========================================================
  */

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  /*
  ========================================================
  GLOBAL STYLING
  ========================================================
  */

  useEffect(() => {
    const style = document.createElement("style");

    style.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Orbitron:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap');

      * {
        box-sizing: border-box;
      }

      html {
        scroll-behavior: smooth;
      }

      body {
        margin: 0;
        background: #07030d;
        color: white;
        font-family: 'DM Sans', sans-serif;
      }

      button,
      input {
        font-family: inherit;
      }

      button {
        -webkit-tap-highlight-color: transparent;
      }

      .pandora {
        position: relative;
        min-height: 100vh;
        overflow-x: hidden;

        background:
          radial-gradient(
            circle at 15% 15%,
            rgba(135, 53, 255, .18),
            transparent 28%
          ),
          radial-gradient(
            circle at 88% 30%,
            rgba(219, 96, 255, .13),
            transparent 25%
          ),
          radial-gradient(
            circle at 50% 100%,
            rgba(89, 29, 167, .18),
            transparent 35%
          ),
          #07030d;
      }

      .pandora::before {
        content: "";
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 0;
        opacity: .35;

        background-image:
          linear-gradient(
            rgba(255,255,255,.018) 1px,
            transparent 1px
          ),
          linear-gradient(
            90deg,
            rgba(255,255,255,.018) 1px,
            transparent 1px
          );

        background-size: 60px 60px;
      }

      .orb {
        position: fixed;
        pointer-events: none;
        border-radius: 50%;
        filter: blur(3px);
        z-index: 0;
      }

      .orb-a {
        width: 380px;
        height: 380px;
        left: -180px;
        top: 22%;

        background:
          radial-gradient(
            circle,
            rgba(139,61,255,.20),
            transparent 70%
          );

        animation: orbFloatA 12s ease-in-out infinite;
      }

      .orb-b {
        width: 450px;
        height: 450px;
        right: -210px;
        top: 45%;

        background:
          radial-gradient(
            circle,
            rgba(205,76,255,.14),
            transparent 70%
          );

        animation: orbFloatB 15s ease-in-out infinite;
      }

      .orb-c {
        width: 280px;
        height: 280px;
        left: 42%;
        top: -150px;

        background:
          radial-gradient(
            circle,
            rgba(112,45,255,.13),
            transparent 70%
          );

        animation: orbFloatC 11s ease-in-out infinite;
      }

      @keyframes orbFloatA {
        0%,100% {
          transform: translate(0,0) scale(1);
        }

        50% {
          transform: translate(45px,-35px) scale(1.12);
        }
      }

      @keyframes orbFloatB {
        0%,100% {
          transform: translate(0,0);
        }

        50% {
          transform: translate(-40px,35px);
        }
      }

      @keyframes orbFloatC {
        0%,100% {
          transform: translate(0,0);
        }

        50% {
          transform: translate(20px,55px) scale(1.15);
        }
      }

      .particle {
        position: fixed;
        width: 3px;
        height: 3px;
        border-radius: 50%;

        background: #d7b0ff;

        box-shadow:
          0 0 8px #a855f7,
          0 0 18px rgba(168,85,247,.8);

        pointer-events: none;
        z-index: 1;

        animation:
          particleFloat 5s ease-in-out infinite;
      }

      @keyframes particleFloat {
        0%,100% {
          opacity: .15;
          transform: translateY(0) scale(.7);
        }

        50% {
          opacity: .95;
          transform: translateY(-24px) scale(1.3);
        }
      }

      .navbar {
        position: relative;
        z-index: 20;

        width: min(
          1240px,
          calc(100% - 50px)
        );

        margin: auto;
        padding: 27px 0;

        display: flex;
        align-items: center;
        justify-content: space-between;

        gap: 25px;
      }

      .brand {
        font-family: 'Orbitron', sans-serif;
        font-size: 19px;
        font-weight: 900;
        letter-spacing: .22em;
      }

      .brand span {
        color: #bd6cff;

        text-shadow:
          0 0 15px #a855f7,
          0 0 30px rgba(168,85,247,.5);
      }

      .journey {
        display: flex;
        align-items: center;
        gap: 11px;

        padding: 11px 17px;

        border: 1px solid rgba(255,255,255,.09);

        background: rgba(255,255,255,.035);

        backdrop-filter: blur(25px);

        border-radius: 999px;

        color: rgba(255,255,255,.28);

        font-size: 9px;
        font-weight: 800;
        letter-spacing: .13em;
      }

      .journey-active {
        color: #d9a8ff;

        text-shadow:
          0 0 15px rgba(192,132,252,.9);
      }

      .page {
        position: relative;
        z-index: 5;

        width: min(
          1180px,
          calc(100% - 50px)
        );

        min-height: calc(100vh - 95px);

        margin: auto;
        padding: 55px 0 100px;

        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      .screen-enter {
        animation:
          screenEnter .75s
          cubic-bezier(.16,1,.3,1);
      }

      .screen-exit {
        animation:
          screenExit .25s ease forwards;
      }

      @keyframes screenEnter {
        from {
          opacity: 0;
          transform: translateY(30px) scale(.985);
          filter: blur(8px);
        }

        to {
          opacity: 1;
          transform: translateY(0) scale(1);
          filter: blur(0);
        }
      }

      @keyframes screenExit {
        to {
          opacity: 0;
          transform: translateY(-15px) scale(.99);
          filter: blur(5px);
        }
      }

      .split {
        display: grid;
        grid-template-columns: 1.05fr .95fr;
        align-items: center;
        gap: 90px;
      }

      .hero {
        max-width: 650px;
      }

      .eyebrow {
        margin: 0 0 22px;

        color: #bd6cff;

        font-family: 'Space Grotesk', sans-serif;

        font-size: 10px;
        font-weight: 800;

        letter-spacing: .35em;
        text-transform: uppercase;
      }

      .hero h1,
      .center h1 {
        margin: 0;

        font-family: 'Orbitron', sans-serif;

        font-size:
          clamp(
            54px,
            7vw,
            102px
          );

        line-height: .92;
        letter-spacing: -.065em;
        font-weight: 900;
      }

      .gradient {
        background:
          linear-gradient(
            100deg,
            #ffffff 0%,
            #e6c4ff 35%,
            #bd68ff 68%,
            #7134ff 100%
          );

        -webkit-background-clip: text;
        background-clip: text;

        color: transparent;

        background-size: 200% auto;

        animation:
          gradientMove 5s linear infinite;
      }

      @keyframes gradientMove {
        to {
          background-position: 200% center;
        }
      }

      .subtitle {
        margin: 30px 0 0;

        max-width: 530px;

        color: rgba(255,255,255,.53);

        font-size: 15px;
        line-height: 1.9;
      }

      .hero-line {
        display: flex;
        align-items: center;

        gap: 12px;

        margin-top: 36px;

        color: rgba(255,255,255,.27);

        font-size: 9px;
        font-weight: 700;
        letter-spacing: .18em;
      }

      .hero-line::before {
        content: "";

        width: 55px;
        height: 1px;

        background:
          linear-gradient(
            90deg,
            #a855f7,
            transparent
          );
      }

      .glass {
        padding: 39px;

        border-radius: 30px;

        border:
          1px solid rgba(255,255,255,.10);

        background:
          linear-gradient(
            145deg,
            rgba(255,255,255,.075),
            rgba(255,255,255,.025)
          );

        backdrop-filter: blur(28px);

        box-shadow:
          0 35px 100px rgba(0,0,0,.48),
          inset 0 1px 0 rgba(255,255,255,.08);

        animation:
          cardFloat 7s ease-in-out infinite;
      }

      @keyframes cardFloat {
        0%,100% {
          transform: translateY(0);
        }

        50% {
          transform: translateY(-7px);
        }
      }

      .card-head {
        display: flex;
        align-items: flex-start;

        gap: 17px;

        margin-bottom: 30px;
      }

      .step {
        width: 46px;
        height: 46px;

        flex-shrink: 0;

        display: grid;
        place-items: center;

        border-radius: 14px;

        color: white;

        font-family: 'Orbitron', sans-serif;

        font-size: 11px;
        font-weight: 800;

        background:
          linear-gradient(
            135deg,
            #b65cff,
            #6525c7
          );

        box-shadow:
          0 12px 35px rgba(139,92,246,.30),
          inset 0 1px 0 rgba(255,255,255,.25);
      }

      .card-head h2 {
        margin: 0 0 6px;

        font-family: 'Space Grotesk', sans-serif;

        font-size: 19px;
      }

      .card-head p {
        margin: 0;

        color: rgba(255,255,255,.38);

        font-size: 12px;
      }

      .field {
        margin-bottom: 18px;
      }

      .field label {
        display: block;

        margin-bottom: 8px;

        color: rgba(255,255,255,.39);

        font-size: 9px;
        font-weight: 900;

        letter-spacing: .18em;
      }

      .field input {
        width: 100%;
        height: 55px;

        padding: 0 17px;

        border:
          1px solid rgba(255,255,255,.085);

        border-radius: 14px;

        outline: none;

        background: rgba(0,0,0,.19);

        color: white;

        font-size: 14px;

        transition:
          border .25s ease,
          box-shadow .25s ease,
          transform .25s ease;
      }

      .field input::placeholder {
        color: rgba(255,255,255,.20);
      }

      .field input:focus {
        transform: translateY(-2px);

        border-color:
          rgba(190,105,255,.65);

        box-shadow:
          0 0 0 4px rgba(168,85,247,.08),
          0 0 30px rgba(168,85,247,.12);
      }

      .field input:disabled {
        opacity: .5;
      }

      /*
      =====================================================
      PHOTO UPLOAD
      =====================================================
      */

      .photo-field {
        margin: 15px 0 20px;

        padding: 16px;

        border:
          1px dashed rgba(192,132,252,.28);

        border-radius: 16px;

        background:
          rgba(168,85,247,.045);

        transition:
          transform .25s ease,
          border-color .25s ease,
          background .25s ease;
      }

      .photo-field:hover {
        transform: translateY(-2px);

        border-color:
          rgba(192,132,252,.55);

        background:
          rgba(168,85,247,.075);
      }

      .photo-row {
        display: flex;
        align-items: center;

        gap: 14px;
      }

      .photo-preview {
        width: 58px;
        height: 58px;

        flex-shrink: 0;

        border-radius: 16px;

        object-fit: cover;

        border:
          1px solid rgba(192,132,252,.35);

        box-shadow:
          0 0 25px rgba(168,85,247,.15);

        animation:
          photoPop .35s ease;
      }

      @keyframes photoPop {
        from {
          opacity: 0;
          transform: scale(.7);
        }

        to {
          opacity: 1;
          transform: scale(1);
        }
      }

      .photo-placeholder {
        width: 58px;
        height: 58px;

        flex-shrink: 0;

        display: grid;
        place-items: center;

        border-radius: 16px;

        color: rgba(255,255,255,.35);

        background:
          rgba(255,255,255,.04);

        font-size: 20px;
      }

      .photo-copy {
        min-width: 0;
        flex: 1;
      }

      .photo-copy strong {
        display: block;

        color: #ead8ff;

        font-size: 12px;

        margin-bottom: 4px;
      }

      .photo-copy span {
        display: block;

        color: rgba(255,255,255,.28);

        font-size: 9px;

        line-height: 1.5;
      }

      .file-input {
        width: 100%;

        margin-top: 12px;

        color: rgba(255,255,255,.45);

        font-size: 10px;
      }

      .file-input::file-selector-button {
        margin-right: 10px;

        padding: 8px 12px;

        border:
          1px solid rgba(168,85,247,.28);

        border-radius: 9px;

        background:
          rgba(168,85,247,.10);

        color: #e0c2ff;

        cursor: pointer;

        transition: .2s ease;
      }

      .file-input::file-selector-button:hover {
        background:
          rgba(168,85,247,.20);

        transform: translateY(-1px);
      }

      .button {
        position: relative;

        overflow: hidden;

        width: 100%;
        min-height: 59px;

        margin-top: 10px;

        border: none;

        border-radius: 15px;

        color: white;

        cursor: pointer;

        font-family: 'Space Grotesk', sans-serif;

        font-size: 10px;
        font-weight: 800;

        letter-spacing: .16em;

        background:
          linear-gradient(
            110deg,
            #6726c9,
            #a855f7,
            #7128d7
          );

        background-size: 220% 100%;

        box-shadow:
          0 15px 38px rgba(111,48,207,.28),
          inset 0 1px 0 rgba(255,255,255,.25);

        transition:
          transform .22s ease,
          box-shadow .22s ease,
          background-position .6s ease;
      }

      .button::before {
        content: "";

        position: absolute;

        top: 0;
        left: -110%;

        width: 70%;
        height: 100%;

        transform: skewX(-22deg);

        background:
          linear-gradient(
            90deg,
            transparent,
            rgba(255,255,255,.30),
            transparent
          );

        transition:
          left .65s ease;
      }

      .button:hover {
        transform: translateY(-4px);

        background-position: 100% 0;

        box-shadow:
          0 22px 50px rgba(111,48,207,.42),
          0 0 35px rgba(168,85,247,.18);
      }

      .button:hover::before {
        left: 145%;
      }

      .button:active {
        transform:
          scale(.965)
          translateY(2px);

        box-shadow:
          0 7px 18px rgba(111,48,207,.28);
      }

      .button:disabled {
        cursor: not-allowed;

        opacity: .42;

        transform: none;

        box-shadow: none;

        background:
          linear-gradient(
            110deg,
            #24202b,
            #302638
          );
      }

      .arrow {
        margin-left: 12px;

        font-size: 17px;

        transition:
          transform .25s ease;
      }

      .button:hover .arrow {
        transform:
          translateX(6px);
      }

      .error {
        margin: 12px 0;

        padding: 12px 14px;

        border:
          1px solid rgba(248,113,113,.22);

        border-radius: 12px;

        background:
          rgba(127,29,29,.15);

        color: #fca5a5;

        font-size: 12px;
      }

      .demo-otp {
        margin-bottom: 22px;

        padding: 17px;

        text-align: center;

        border:
          1px solid rgba(168,85,247,.18);

        border-radius: 15px;

        background:
          rgba(168,85,247,.065);

        color: rgba(255,255,255,.42);

        font-size: 9px;
        font-weight: 700;

        letter-spacing: .17em;
      }

      .demo-otp strong {
        display: block;

        margin-top: 8px;

        color: #ddb6ff;

        font-family: 'Orbitron', sans-serif;

        font-size: 27px;

        letter-spacing: .23em;

        text-shadow:
          0 0 20px rgba(168,85,247,.6);
      }

      .center {
        width: 100%;
        max-width: 900px;

        margin: auto;

        text-align: center;
      }

      .center .subtitle {
        margin-left: auto;
        margin-right: auto;
      }

      .success {
        display: flex;
        align-items: center;

        gap: 17px;

        max-width: 620px;

        margin: 38px auto 25px;

        padding: 24px;

        text-align: left;

        border-radius: 20px;

        border:
          1px solid rgba(168,85,247,.19);

        background:
          rgba(168,85,247,.06);

        animation:
          successPop .7s
          cubic-bezier(.16,1,.3,1);
      }

      @keyframes successPop {
        from {
          opacity: 0;
          transform: scale(.8);
        }

        to {
          opacity: 1;
          transform: scale(1);
        }
      }

      .success-icon {
        width: 50px;
        height: 50px;

        flex-shrink: 0;

        display: grid;
        place-items: center;

        border-radius: 50%;

        background:
          linear-gradient(
            135deg,
            #bd6cff,
            #7026d8
          );

        box-shadow:
          0 0 35px rgba(168,85,247,.35);

        font-size: 21px;
      }

      .success strong {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 16px;
      }

      .success p {
        margin: 5px 0 0;

        color: rgba(255,255,255,.40);

        font-size: 12px;
      }

      .grid {
        display: grid;

        grid-template-columns:
          repeat(2,1fr);

        gap: 14px;

        margin: 35px auto;

        max-width: 850px;
      }

      .info {
        padding: 24px;

        text-align: left;

        border-radius: 19px;

        border:
          1px solid rgba(255,255,255,.075);

        background:
          rgba(255,255,255,.035);

        transition: .3s ease;
      }

      .info:hover {
        transform:
          translateY(-6px);

        border-color:
          rgba(168,85,247,.25);

        background:
          rgba(168,85,247,.05);
      }

      .info span {
        display: block;

        margin-bottom: 9px;

        color:
          rgba(255,255,255,.31);

        font-size: 9px;

        font-weight: 900;

        letter-spacing: .18em;
      }

      .info strong {
        color: #ead8ff;

        font-size: 17px;

        word-break: break-word;
      }

      .round-card {
        max-width: 850px;

        margin: 42px auto 26px;

        padding: 32px;

        border-radius: 25px;

        border:
          1px solid rgba(255,255,255,.09);

        background:
          radial-gradient(
            circle at 50% 0%,
            rgba(168,85,247,.11),
            transparent 65%
          ),
          rgba(255,255,255,.035);

        backdrop-filter: blur(20px);
      }

      .round-top {
        display: flex;
        align-items: center;
        justify-content: space-between;

        gap: 20px;

        margin-bottom: 28px;
      }

      .round-title {
        text-align: left;
      }

      .round-title small {
        display: block;

        margin-bottom: 8px;

        color:
          rgba(255,255,255,.32);

        font-size: 9px;

        font-weight: 900;

        letter-spacing: .18em;
      }

      .round-title h2 {
        margin: 0;

        font-family: 'Orbitron', sans-serif;

        font-size: 21px;
      }

      .live-badge {
        display: inline-flex;
        align-items: center;

        gap: 8px;

        padding: 8px 13px;

        border-radius: 999px;

        color: #dcb7ff;

        background:
          rgba(168,85,247,.10);

        border:
          1px solid rgba(168,85,247,.18);

        font-size: 8px;

        font-weight: 900;

        letter-spacing: .14em;
      }

      .live-dot {
        width: 7px;
        height: 7px;

        border-radius: 50%;

        background: #c084fc;

        box-shadow:
          0 0 12px #a855f7;

        animation:
          livePulse 1.2s infinite;
      }

      @keyframes livePulse {
        50% {
          transform: scale(1.5);
          opacity: .45;
        }
      }

      .countdown {
        display: grid;

        grid-template-columns:
          repeat(4,1fr);

        gap: 10px;
      }

      .time-box {
        padding: 18px 10px;

        border-radius: 15px;

        text-align: center;

        border:
          1px solid rgba(255,255,255,.07);

        background:
          rgba(0,0,0,.20);
      }

      .time-box strong {
        display: block;

        color: #e2c5ff;

        font-family: 'Orbitron', sans-serif;

        font-size: 23px;
      }

      .time-box span {
        display: block;

        margin-top: 5px;

        color:
          rgba(255,255,255,.28);

        font-size: 7px;

        font-weight: 800;

        letter-spacing: .14em;
      }

      .locked {
        opacity: .75;
      }

      .lock-icon {
        font-size: 31px;

        margin-bottom: 13px;

        animation:
          lockFloat 3s
          ease-in-out infinite;
      }

      @keyframes lockFloat {
        50% {
          transform:
            translateY(-5px);
        }
      }

      .round-message {
        color:
          rgba(255,255,255,.42);

        font-size: 12px;

        line-height: 1.7;
      }

      .episode-number {
        display: inline-flex;

        padding: 9px 15px;

        border:
          1px solid rgba(168,85,247,.18);

        border-radius: 999px;

        color: #ca91ff;

        background:
          rgba(168,85,247,.07);

        font-family: 'Orbitron', sans-serif;

        font-size: 8px;

        font-weight: 800;

        letter-spacing: .18em;
      }

      .episode-card {
        max-width: 760px;

        margin: 38px auto 26px;

        padding: 50px 40px;

        border-radius: 28px;

        border:
          1px solid rgba(255,255,255,.08);

        background:
          radial-gradient(
            circle at 50% 0%,
            rgba(168,85,247,.13),
            transparent 65%
          ),
          rgba(255,255,255,.035);

        box-shadow:
          0 35px 90px rgba(0,0,0,.30);
      }

      .episode-card h2 {
        margin: 20px 0 12px;

        font-family: 'Orbitron', sans-serif;

        font-size: 28px;
      }

      .episode-card p {
        max-width: 560px;

        margin: auto;

        color:
          rgba(255,255,255,.43);

        line-height: 1.8;
      }

      .result-card {
        max-width: 620px;

        margin: 40px auto 25px;

        padding: 45px;

        border-radius: 28px;

        border:
          1px solid rgba(168,85,247,.22);

        background:
          radial-gradient(
            circle at center,
            rgba(168,85,247,.13),
            transparent 65%
          ),
          rgba(255,255,255,.035);

        box-shadow:
          0 30px 90px rgba(0,0,0,.35);
      }

      .result-label {
        color:
          rgba(255,255,255,.30);

        font-size: 9px;

        font-weight: 900;

        letter-spacing: .18em;
      }

      .result-card h2 {
        margin: 12px 0 25px;

        color: #ecd9ff;

        font-family: 'Orbitron', sans-serif;

        font-size: 29px;
      }

      .divider {
        width: 100%;
        height: 1px;

        margin: 25px 0;

        background:
          linear-gradient(
            90deg,
            transparent,
            rgba(168,85,247,.4),
            transparent
          );
      }

      .result-card h3 {
        margin-top: 13px;

        color: #c084fc;

        font-family: 'Space Grotesk', sans-serif;

        letter-spacing: .10em;
      }

      .wrapped-grid {
        display: grid;

        grid-template-columns:
          repeat(4,1fr);

        gap: 12px;

        max-width: 900px;

        margin: 40px auto 28px;
      }

      .wrapped {
        padding: 26px 15px;

        border-radius: 19px;

        border:
          1px solid rgba(255,255,255,.075);

        background:
          rgba(255,255,255,.035);

        transition: .3s ease;
      }

      .wrapped:hover {
        transform:
          translateY(-7px);

        border-color:
          rgba(168,85,247,.28);

        box-shadow:
          0 15px 40px rgba(0,0,0,.25);
      }

      .wrapped span {
        display: block;

        margin-bottom: 11px;

        color:
          rgba(255,255,255,.27);

        font-size: 8px;

        font-weight: 900;

        letter-spacing: .16em;
      }

      .wrapped strong {
        color: #e1c4ff;

        font-family: 'Space Grotesk', sans-serif;

        font-size: 16px;
      }

      @media (max-width: 900px) {
        .navbar {
          flex-direction: column;
          align-items: flex-start;
        }

        .journey {
          width: 100%;
          justify-content: center;
          overflow-x: auto;
        }

        .split {
          grid-template-columns: 1fr;
          gap: 55px;
        }

        .hero h1,
        .center h1 {
          font-size:
            clamp(50px,12vw,90px);
        }

        .wrapped-grid {
          grid-template-columns:
            repeat(2,1fr);
        }
      }

      @media (max-width: 580px) {
        .navbar,
        .page {
          width:
            min(
              100% - 28px,
              1180px
            );
        }

        .page {
          padding-top: 25px;
        }

        .glass {
          padding: 25px;
          border-radius: 22px;
        }

        .journey {
          gap: 7px;
          font-size: 7px;
        }

        .grid {
          grid-template-columns: 1fr;
        }

        .countdown {
          grid-template-columns:
            repeat(2,1fr);
        }

        .wrapped-grid {
          grid-template-columns:
            1fr 1fr;
        }

        .round-top {
          align-items: flex-start;
          flex-direction: column;
        }

        .episode-card {
          padding: 35px 22px;
        }
      }
    `;

    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  /*
  ========================================================
  ROUND TIMING
  ========================================================
  */

  const getRoundStatus = (
    round: RoundKey
  ): RoundStatus => {
    const item = EVENT_SCHEDULE[round];

    const start =
      new Date(item.start).getTime();

    const end =
      new Date(item.end).getTime();

    if (now < start) {
      return "locked";
    }

    if (now < end) {
      return "live";
    }

    return "ended";
  };

  const getRemaining = (
    target: string
  ) => {
    const difference = Math.max(
      0,
      new Date(target).getTime() - now
    );

    const totalSeconds =
      Math.floor(difference / 1000);

    return {
      days: Math.floor(
        totalSeconds / 86400
      ),

      hours: Math.floor(
        (totalSeconds % 86400) / 3600
      ),

      minutes: Math.floor(
        (totalSeconds % 3600) / 60
      ),

      seconds:
        totalSeconds % 60,
    };
  };

  const canEnterRound = (
    round: RoundKey
  ) => {
    return (
      getRoundStatus(round) ===
      "live"
    );
  };

  /*
  ========================================================
  SCREEN TRANSITION
  ========================================================
  */

  const goTo = (
    next: Screen
  ) => {
    setTransitioning(true);

    setTimeout(() => {
      setScreen(next);
      setMessage("");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      setTimeout(() => {
        setTransitioning(false);
      }, 80);
    }, 240);
  };

  /*
  ========================================================
  PHOTO VALIDATION
  ========================================================
  */

  const validatePhoto = (
    file: File | null
  ) => {
    if (!file) {
      return null;
    }

    if (!file.type.startsWith("image/")) {
      return "Please upload an image file.";
    }

    if (file.size > MAX_PHOTO_SIZE) {
      return "Each photo must be 5 MB or smaller.";
    }

    return null;
  };

  const handlePhotoChange = (
    file: File | null,
    setter: React.Dispatch<
      React.SetStateAction<File | null>
    >
  ) => {
    const error =
      validatePhoto(file);

    if (error) {
      setMessage(error);
      setter(null);
      return;
    }

    setMessage("");
    setter(file);
  };

  /*
  ========================================================
  PHOTO UPLOAD COMPONENT
  ========================================================
  */

  const PhotoUpload = ({
    label,
    file,
    onChange,
  }: {
    label: string;
    file: File | null;
    onChange: (
      file: File | null
    ) => void;
  }) => {
    const [preview, setPreview] =
      useState("");

    useEffect(() => {
      if (!file) {
        setPreview("");
        return;
      }

      const url =
        URL.createObjectURL(file);

      setPreview(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    }, [file]);

    return (
      <div className="photo-field">
        <div className="photo-row">
          {preview ? (
            <img
              className="photo-preview"
              src={preview}
              alt={`${label} preview`}
            />
          ) : (
            <div className="photo-placeholder">
              📷
            </div>
          )}

          <div className="photo-copy">
            <strong>
              {label} *
            </strong>

            <span>
              Upload a clear profile photo.
              JPG, PNG or WEBP • Max 5 MB
            </span>
          </div>
        </div>

        <input
          className="file-input"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={(event) => {
            const selected =
              event.target.files?.[0] ??
              null;

            onChange(selected);
          }}
        />
      </div>
    );
  };

  /*
  ========================================================
  REGISTER
  ========================================================
  */

  const handleRegister = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setMessage("");

    if (
      !name.trim() ||
      !email.trim() ||
      !password.trim()
    ) {
      setMessage(
        "Please fill in all the fields."
      );

      return;
    }

    if (
      !email
        .toLowerCase()
        .endsWith("@srmist.edu.in")
    ) {
      setMessage(
        "Please use your SRMIST email address."
      );

      return;
    }

    try {
      setLoading(true);

      const response =
        await fetch(
          `${API_BASE}/api/auth/request-otp`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              full_name: name,
              email,
              password,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        setMessage(
          data.error ||
          "Unable to send OTP."
        );

        return;
      }

      setDemoOtp(
        data.demoOtp
      );

      goTo("otp");
    } catch (error) {
      console.error(error);

      setMessage(
        "Cannot connect to Pandora backend. Make sure port 3000 is running."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  ========================================================
  VERIFY OTP
  ========================================================
  */

  const handleVerifyOtp = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setMessage("");

    if (!otp.trim()) {
      setMessage(
        "Please enter the OTP."
      );

      return;
    }

    try {
      setLoading(true);

      const response =
        await fetch(
          `${API_BASE}/api/auth/verify-otp`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              email,
              otp,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        setMessage(
          data.error ||
          "Invalid OTP."
        );

        return;
      }

      goTo("team");
    } catch (error) {
      console.error(error);

      setMessage(
        "Cannot connect to Pandora backend."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  ========================================================
  CREATE TEAM + PHOTOS
  ========================================================
  */

  const handleCreateTeam = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setMessage("");

    if (!teamName.trim()) {
      setMessage(
        "Please enter a team name."
      );

      return;
    }

    if (
      !member2.trim() ||
      !member3.trim() ||
      !member4.trim()
    ) {
      setMessage(
        "Please enter all four member emails."
      );

      return;
    }

    if (
      !leaderPhoto ||
      !member2Photo ||
      !member3Photo ||
      !member4Photo
    ) {
      setMessage(
        "Please upload a photo for every team member."
      );

      return;
    }

    try {
      setLoading(true);

      /*
       * PHOTOS REQUIRE FormData.
       *
       * Your Express backend currently expects
       * JSON at /api/teams.
       *
       * The backend route must therefore be updated
       * to accept multipart/form-data before these
       * image files can be permanently stored.
       */

      const formData =
        new FormData();

      formData.append(
        "team_name",
        teamName
      );

      formData.append(
        "team_leader_email",
        email
      );

      formData.append(
        "member_2_email",
        member2
      );

      formData.append(
        "member_3_email",
        member3
      );

      formData.append(
        "member_4_email",
        member4
      );

      formData.append(
        "leader_photo",
        leaderPhoto
      );

      formData.append(
        "member_2_photo",
        member2Photo
      );

      formData.append(
        "member_3_photo",
        member3Photo
      );

      formData.append(
        "member_4_photo",
        member4Photo
      );

      const response =
        await fetch(
          `${API_BASE}/api/teams`,
          {
            method: "POST",
            body: formData,
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        setMessage(
          data.error ||
          "Unable to create team."
        );

        return;
      }

      console.log(
        "TEAM CREATED:",
        data
      );

      goTo("confirmation");
    } catch (error) {
      console.error(error);

      setMessage(
        "Cannot connect to Pandora backend."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  ========================================================
  BACKGROUND
  ========================================================
  */

  const Background = () => (
    <>
      <div className="orb orb-a" />
      <div className="orb orb-b" />
      <div className="orb orb-c" />

      {[
        ["12%", "18%", "0s"],
        ["25%", "78%", "1s"],
        ["39%", "31%", "2s"],
        ["52%", "91%", ".5s"],
        ["64%", "15%", "1.5s"],
        ["72%", "66%", "2.5s"],
        ["83%", "38%", "3s"],
        ["91%", "82%", "1.2s"],
        ["16%", "51%", "2.7s"],
        ["47%", "72%", "1.8s"],
      ].map(
        (
          item,
          index
        ) => (
          <div
            key={index}
            className="particle"
            style={{
              top: item[0],
              left: item[1],
              animationDelay:
                item[2],
            }}
          />
        )
      )}
    </>
  );

  /*
  ========================================================
  NAVBAR
  ========================================================
  */

  const Navbar = () => (
    <nav className="navbar">
      <div className="brand">
        PANDORA <span>✦</span>
      </div>

      <div className="journey">
        <span
          className={
            screen === "register"
              ? "journey-active"
              : ""
          }
        >
          REGISTER
        </span>

        <span>→</span>

        <span
          className={
            screen === "otp"
              ? "journey-active"
              : ""
          }
        >
          VERIFY
        </span>

        <span>→</span>

        <span
          className={
            screen === "team"
              ? "journey-active"
              : ""
          }
        >
          TEAM
        </span>

        <span>→</span>

        <span
          className={[
            "confirmation",
            "dashboard",
            "shortlisting",
            "result",
            "ep1",
            "ep2",
            "ep3",
            "finalResult",
            "wrapped",
          ].includes(screen)
            ? "journey-active"
            : ""}
        >
          JOURNEY
        </span>
      </div>
    </nav>
  );

  /*
  ========================================================
  BUTTON
  ========================================================
  */

  const Button = ({
    children,
    onClick,
    disabled = false,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
  }) => (
    <button
      className="button"
      type="button"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
      <span className="arrow">
        →
      </span>
    </button>
  );

  /*
  ========================================================
  COUNTDOWN
  ========================================================
  */

  const Countdown = ({
    target,
  }: {
    target: string;
  }) => {
    const time =
      getRemaining(target);

    return (
      <div className="countdown">
        <div className="time-box">
          <strong>
            {String(
              time.days
            ).padStart(2, "0")}
          </strong>

          <span>DAYS</span>
        </div>

        <div className="time-box">
          <strong>
            {String(
              time.hours
            ).padStart(2, "0")}
          </strong>

          <span>HOURS</span>
        </div>

        <div className="time-box">
          <strong>
            {String(
              time.minutes
            ).padStart(2, "0")}
          </strong>

          <span>MINUTES</span>
        </div>

        <div className="time-box">
          <strong>
            {String(
              time.seconds
            ).padStart(2, "0")}
          </strong>

          <span>SECONDS</span>
        </div>
      </div>
    );
  };

  /*
  ========================================================
  ROUND CARD
  ========================================================
  */

  const RoundCard = ({
    round,
  }: {
    round: RoundKey;
  }) => {
    const item =
      EVENT_SCHEDULE[round];

    const status =
      getRoundStatus(round);

    if (status === "locked") {
      return (
        <div className="round-card locked">
          <div className="round-top">
            <div className="round-title">
              <small>
                NEXT ACCESS
              </small>

              <h2>
                {item.title}
              </h2>
            </div>

            <div className="live-badge">
              🔒 LOCKED
            </div>
          </div>

          <div className="lock-icon">
            🔐
          </div>

          <p className="round-message">
            This round hasn't opened yet.
            <br />
            The door unlocks in:
          </p>

          <Countdown
            target={item.start}
          />
        </div>
      );
    }

    if (status === "live") {
      return (
        <div className="round-card">
          <div className="round-top">
            <div className="round-title">
              <small>
                CURRENT ROUND
              </small>

              <h2>
                {item.title}
              </h2>
            </div>

            <div className="live-badge">
              <span className="live-dot" />
              LIVE NOW
            </div>
          </div>

          <p className="round-message">
            {item.subtitle}
            <br />
            This round closes in:
          </p>

          <Countdown
            target={item.end}
          />
        </div>
      );
    }

    return (
      <div className="round-card">
        <div className="round-top">
          <div className="round-title">
            <small>
              ROUND STATUS
            </small>

            <h2>
              {item.title}
            </h2>
          </div>

          <div className="live-badge">
            ✓ ENDED
          </div>
        </div>

        <p className="round-message">
          This round has ended.
        </p>
      </div>
    );
  };

  /*
  ========================================================
  RENDER
  ========================================================
  */

  return (
    <div className="pandora">
      <Background />

      <Navbar />

      <main
        className={
          transitioning
            ? "page screen-exit"
            : "page screen-enter"
        }
      >

        {/* =================================================
            REGISTER
        ================================================= */}

        {screen === "register" && (
          <div className="split">

            <section className="hero">
              <p className="eyebrow">
                MSA PRESENTS
              </p>

              <h1>
                ENTER THE
                <br />

                <span className="gradient">
                  PANDORA.
                </span>
              </h1>

              <p className="subtitle">
                Something is waiting behind
                the door.
                <br />
                Register with your SRMIST
                identity and discover what
                comes next.
              </p>

              <div className="hero-line">
                THE DOOR IS OPEN
              </div>
            </section>

            <form
              className="glass"
              onSubmit={
                handleRegister
              }
            >
              <div className="card-head">

                <div className="step">
                  01
                </div>

                <div>
                  <h2>
                    CREATE ACCOUNT
                  </h2>

                  <p>
                    Begin your Pandora
                    journey.
                  </p>
                </div>

              </div>

              <div className="field">
                <label>
                  FULL NAME
                </label>

                <input
                  type="text"
                  placeholder="Your full name"
                  value={name}
                  onChange={(event) =>
                    setName(
                      event.target.value
                    )
                  }
                />
              </div>

              <div className="field">
                <label>
                  SRMIST EMAIL
                </label>

                <input
                  type="email"
                  placeholder="you@srmist.edu.in"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value
                    )
                  }
                />
              </div>

              <div className="field">
                <label>
                  PASSWORD
                </label>

                <input
                  type="password"
                  placeholder="Create your password"
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                />
              </div>

              {message && (
                <div className="error">
                  {message}
                </div>
              )}

              <button
                className="button"
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "SENDING OTP..."
                  : "ENTER PANDORA"}

                <span className="arrow">
                  →
                </span>
              </button>
            </form>
          </div>
        )}

        {/* =================================================
            OTP
        ================================================= */}

        {screen === "otp" && (
          <div className="split">

            <section className="hero">
              <p className="eyebrow">
                THE FIRST LOCK
              </p>

              <h1>
                VERIFY
                <br />

                <span className="gradient">
                  YOUR IDENTITY.
                </span>
              </h1>

              <p className="subtitle">
                Pandora needs to know
                you're really you.
                <br />
                Enter the code generated
                for your SRMIST account.
              </p>

              <div className="hero-line">
                ONE CODE. ONE DOOR.
              </div>
            </section>

            <form
              className="glass"
              onSubmit={
                handleVerifyOtp
              }
            >

              <div className="card-head">

                <div className="step">
                  02
                </div>

                <div>
                  <h2>
                    VERIFY EMAIL
                  </h2>

                  <p>
                    Enter your
                    six-digit code.
                  </p>
                </div>

              </div>

              <div className="demo-otp">
                DEMO VERIFICATION CODE

                <strong>
                  {demoOtp}
                </strong>
              </div>

              <div className="field">
                <label>
                  OTP
                </label>

                <input
                  type="text"
                  maxLength={6}
                  placeholder="000000"
                  value={otp}
                  onChange={(event) =>
                    setOtp(
                      event.target.value.replace(
                        /\D/g,
                        ""
                      )
                    )
                  }
                />
              </div>

              {message && (
                <div className="error">
                  {message}
                </div>
              )}

              <button
                className="button"
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "VERIFYING..."
                  : "UNLOCK"}

                <span className="arrow">
                  →
                </span>
              </button>

            </form>
          </div>
        )}

        {/* =================================================
            TEAM + PHOTOS
        ================================================= */}

        {screen === "team" && (
          <div className="split">

            <section className="hero">

              <p className="eyebrow">
                THE SECOND LOCK
              </p>

              <h1>
                FIND YOUR
                <br />

                <span className="gradient">
                  PEOPLE.
                </span>
              </h1>

              <p className="subtitle">
                Pandora isn't meant to be
                entered alone.
                <br />
                Assemble your four-member
                team, upload everyone's
                photo and step inside.
              </p>

              <div className="hero-line">
                FOUR MINDS. ONE JOURNEY.
              </div>

            </section>

            <form
              className="glass"
              onSubmit={
                handleCreateTeam
              }
            >

              <div className="card-head">

                <div className="step">
                  03
                </div>

                <div>
                  <h2>
                    FORM YOUR TEAM
                  </h2>

                  <p>
                    Add all four members
                    and their photos.
                  </p>
                </div>

              </div>

              {/* TEAM NAME */}

              <div className="field">
                <label>
                  TEAM NAME
                </label>

                <input
                  type="text"
                  placeholder="e.g. Pandora Phoenix"
                  value={teamName}
                  onChange={(event) =>
                    setTeamName(
                      event.target.value
                    )
                  }
                />
              </div>

              {/* LEADER */}

              <div className="field">
                <label>
                  TEAM LEADER EMAIL
                </label>

                <input
                  type="email"
                  value={email}
                  disabled
                />
              </div>

              <PhotoUpload
                label="TEAM LEADER PHOTO"
                file={leaderPhoto}
                onChange={(file) =>
                  handlePhotoChange(
                    file,
                    setLeaderPhoto
                  )
                }
              />

              {/* MEMBER 2 */}

              <div className="field">
                <label>
                  MEMBER 02 EMAIL
                </label>

                <input
                  type="email"
                  placeholder="member2@srmist.edu.in"
                  value={member2}
                  onChange={(event) =>
                    setMember2(
                      event.target.value
                    )
                  }
                />
              </div>

              <PhotoUpload
                label="MEMBER 02 PHOTO"
                file={member2Photo}
                onChange={(file) =>
                  handlePhotoChange(
                    file,
                    setMember2Photo
                  )
                }
              />

              {/* MEMBER 3 */}

              <div className="field">
                <label>
                  MEMBER 03 EMAIL
                </label>

                <input
                  type="email"
                  placeholder="member3@srmist.edu.in"
                  value={member3}
                  onChange={(event) =>
                    setMember3(
                      event.target.value
                    )
                  }
                />
              </div>

              <PhotoUpload
                label="MEMBER 03 PHOTO"
                file={member3Photo}
                onChange={(file) =>
                  handlePhotoChange(
                    file,
                    setMember3Photo
                  )
                }
              />

              {/* MEMBER 4 */}

              <div className="field">
                <label>
                  MEMBER 04 EMAIL
                </label>

                <input
                  type="email"
                  placeholder="member4@srmist.edu.in"
                  value={member4}
                  onChange={(event) =>
                    setMember4(
                      event.target.value
                    )
                  }
                />
              </div>

              <PhotoUpload
                label="MEMBER 04 PHOTO"
                file={member4Photo}
                onChange={(file) =>
                  handlePhotoChange(
                    file,
                    setMember4Photo
                  )
                }
              />

              {message && (
                <div className="error">
                  {message}
                </div>
              )}

              <button
                className="button"
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "CREATING TEAM..."
                  : "FORM TEAM"}

                <span className="arrow">
                  →
                </span>
              </button>

            </form>
          </div>
        )}

        {/* =================================================
            CONFIRMATION
        ================================================= */}

        {screen === "confirmation" && (
          <div className="center">

            <p className="eyebrow">
              REGISTRATION COMPLETE
            </p>

            <h1>
              WELCOME TO
              <br />

              <span className="gradient">
                PANDORA.
              </span>
            </h1>

            <p className="subtitle">
              {teamName} has successfully
              entered the system.
              <br />
              Your journey is about to begin.
            </p>

            <div className="success">

              <div className="success-icon">
                ✓
              </div>

              <div>
                <strong>
                  {teamName}
                </strong>

                <p>
                  Team successfully
                  registered.
                </p>
              </div>

            </div>

            <Button
              onClick={() =>
                goTo("dashboard")
              }
            >
              ENTER DASHBOARD
            </Button>

          </div>
        )}

        {/* =================================================
            DASHBOARD
        ================================================= */}

        {screen === "dashboard" && (
          <div className="center">

            <p className="eyebrow">
              PARTICIPANT DASHBOARD
            </p>

            <h1>
              WELCOME,
              <br />

              <span className="gradient">
                {name.toUpperCase()}.
              </span>
            </h1>

            <p className="subtitle">
              Your Pandora journey lives
              here.
              <br />
              Every round opens only when
              its time arrives.
            </p>

            <div className="grid">

              <div className="info">
                <span>
                  TEAM
                </span>

                <strong>
                  {teamName}
                </strong>
              </div>

              <div className="info">
                <span>
                  LEADER
                </span>

                <strong>
                  {email}
                </strong>
              </div>

              <div className="info">
                <span>
                  TEAM SIZE
                </span>

                <strong>
                  04 MEMBERS
                </strong>
              </div>

              <div className="info">
                <span>
                  EVENT
                </span>

                <strong>
                  PANDORA
                </strong>
              </div>

            </div>

            <RoundCard
              round="shortlisting"
            />

            <Button
              disabled={
                !canEnterRound(
                  "shortlisting"
                )
              }
              onClick={() =>
                goTo("shortlisting")
              }
            >
              {canEnterRound(
                "shortlisting"
              )
                ? "ENTER SHORTLISTING"
                : "WAIT FOR SHORTLISTING"}
            </Button>

          </div>
        )}

        {/* =================================================
            SHORTLISTING
        ================================================= */}

        {screen === "shortlisting" && (
          <div className="center">

            <p className="eyebrow">
              ROUND 00
            </p>

            <h1>
              THE WAIT
              <br />

              <span className="gradient">
                BEGINS.
              </span>
            </h1>

            <p className="subtitle">
              Your team is inside the
              selection window.
              <br />
              The clock decides what
              happens next.
            </p>

            <RoundCard
              round="shortlisting"
            />

            <Button
              disabled={
                getRoundStatus(
                  "shortlisting"
                ) !== "ended" ||
                !canEnterRound("ep1")
              }
              onClick={() =>
                goTo("result")
              }
            >
              {getRoundStatus(
                "shortlisting"
              ) === "ended" &&
              canEnterRound("ep1")
                ? "VIEW SHORTLIST RESULT"
                : "WAIT FOR RESULT"}
            </Button>

          </div>
        )}

        {/* =================================================
            RESULT
        ================================================= */}

        {screen === "result" && (
          <div className="center">

            <p className="eyebrow">
              SHORTLIST RESULT
            </p>

            <h1>
              YOU ARE
              <br />

              <span className="gradient">
                IN.
              </span>
            </h1>

            <p className="subtitle">
              Your team has been
              shortlisted.
              <br />
              The first episode will unlock
              at its scheduled time.
            </p>

            <div className="success">

              <div className="success-icon">
                ✓
              </div>

              <div>
                <strong>
                  {teamName}
                </strong>

                <p>
                  SHORTLISTED FOR PANDORA
                </p>
              </div>

            </div>

            <RoundCard
              round="ep1"
            />

            <Button
              disabled={
                !canEnterRound("ep1")
              }
              onClick={() =>
                goTo("ep1")
              }
            >
              {canEnterRound("ep1")
                ? "ENTER EPISODE 01"
                : "EPISODE 01 LOCKED"}
            </Button>

          </div>
        )}

        {/* =================================================
            EPISODE 1
        ================================================= */}

        {screen === "ep1" && (
          <div className="center">

            <span className="episode-number">
              EPISODE 01
            </span>

            <div
              style={{
                height: 20,
              }}
            />

            <h1>
              THE FIRST
              <br />

              <span className="gradient">
                DOOR.
              </span>
            </h1>

            <p className="subtitle">
              The first challenge is live.
              <br />
              The next door won't open until
              this round closes.
            </p>

            <div className="episode-card">

              <span className="episode-number">
                ROUND 01
              </span>

              <h2>
                THE BEGINNING
              </h2>

              <p>
                Your team has entered
                Episode One.
                Complete the challenge
                during the active window.
              </p>

              <RoundCard
                round="ep1"
              />

            </div>

            <Button
              disabled={
                getRoundStatus(
                  "ep1"
                ) !== "ended" ||
                !canEnterRound("ep2")
              }
              onClick={() =>
                goTo("ep2")
              }
            >
              {getRoundStatus(
                "ep1"
              ) === "ended" &&
              canEnterRound("ep2")
                ? "UNLOCK EPISODE 02"
                : "WAIT FOR EPISODE 02"}
            </Button>

          </div>
        )}

        {/* =================================================
            EPISODE 2
        ================================================= */}

        {screen === "ep2" && (
          <div className="center">

            <span className="episode-number">
              EPISODE 02
            </span>

            <div
              style={{
                height: 20,
              }}
            />

            <h1>
              GO
              <br />

              <span className="gradient">
                DEEPER.
              </span>
            </h1>

            <p className="subtitle">
              You've made it past the
              first door.
              <br />
              The second challenge is now
              active.
            </p>

            <div className="episode-card">

              <span className="episode-number">
                ROUND 02
              </span>

              <h2>
                THE DESCENT
              </h2>

              <p>
                The path gets deeper.
                Work together and survive
                the second challenge.
              </p>

              <RoundCard
                round="ep2"
              />

            </div>

            <Button
              disabled={
                getRoundStatus(
                  "ep2"
                ) !== "ended" ||
                !canEnterRound("ep3")
              }
              onClick={() =>
                goTo("ep3")
              }
            >
              {getRoundStatus(
                "ep2"
              ) === "ended" &&
              canEnterRound("ep3")
                ? "UNLOCK EPISODE 03"
                : "WAIT FOR EPISODE 03"}
            </Button>

          </div>
        )}

        {/* =================================================
            EPISODE 3
        ================================================= */}

        {screen === "ep3" && (
          <div className="center">

            <span className="episode-number">
              EPISODE 03
            </span>

            <div
              style={{
                height: 20,
              }}
            />

            <h1>
              THE FINAL
              <br />

              <span className="gradient">
                TRIAL.
              </span>
            </h1>

            <p className="subtitle">
              This is the final round.
              <br />
              Everything comes down to
              this.
            </p>

            <div className="episode-card">

              <span className="episode-number">
                FINAL ROUND
              </span>

              <h2>
                THE LAST DOOR
              </h2>

              <p>
                Complete the final
                challenge.
                The final result becomes
                available only after the
                round closes.
              </p>

              <RoundCard
                round="ep3"
              />

            </div>

            <Button
              disabled={
                getRoundStatus(
                  "ep3"
                ) !== "ended"
              }
              onClick={() =>
                goTo("finalResult")
              }
            >
              {getRoundStatus(
                "ep3"
              ) === "ended"
                ? "REVEAL FINAL RESULT"
                : "ROUND STILL LIVE"}
            </Button>

          </div>
        )}

        {/* =================================================
            FINAL RESULT
        ================================================= */}

        {screen === "finalResult" && (
          <div className="center">

            <p className="eyebrow">
              FINAL RESULT
            </p>

            <h1>
              YOUR
              <br />

              <span className="gradient">
                PANDORA.
              </span>
            </h1>

            <p className="subtitle">
              Three rounds.
              <br />
              One journey.
              <br />
              One final result.
            </p>

            <div className="result-card">

              <span className="result-label">
                TEAM
              </span>

              <h2>
                {teamName}
              </h2>

              <div className="divider" />

              <span className="result-label">
                FINAL STATUS
              </span>

              <h3>
                PANDORA FINALIST
              </h3>

            </div>

            <Button
              onClick={() =>
                goTo("wrapped")
              }
            >
              OPEN PANDORA WRAPPED
            </Button>

          </div>
        )}

        {/* =================================================
            WRAPPED
        ================================================= */}

        {screen === "wrapped" && (
          <div className="center">

            <p className="eyebrow">
              PANDORA WRAPPED
            </p>

            <h1>
              THAT'S A
              <br />

              <span className="gradient">
                WRAP.
              </span>
            </h1>

            <p className="subtitle">
              You entered Pandora.
              <br />
              You made it through every
              door.
            </p>

            <div className="wrapped-grid">

              <div className="wrapped">
                <span>
                  TEAM
                </span>

                <strong>
                  {teamName}
                </strong>
              </div>

              <div className="wrapped">
                <span>
                  ROUNDS
                </span>

                <strong>
                  03
                </strong>
              </div>

              <div className="wrapped">
                <span>
                  JOURNEY
                </span>

                <strong>
                  COMPLETE
                </strong>
              </div>

              <div className="wrapped">
                <span>
                  STATUS
                </span>

                <strong>
                  FINALIST
                </strong>
              </div>

            </div>

            <Button
              onClick={() =>
                goTo("dashboard")
              }
            >
              RETURN TO DASHBOARD
            </Button>

          </div>
        )}

      </main>
    </div>
  );
};

export default App;