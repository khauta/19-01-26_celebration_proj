# LifeOS v2.0 - The Geeky Birthday SPA

**Target User:** Khauta John Maliehe Sofe Lijana  
**Version:** 31.0.0 (Birthday Edition)  
**Status:** COMPLETE SUCCESS

## 🎂 Executive Summary

Welcome to **LifeOS v2.0**. This project isn't just a birthday card; it's a procedural, physics-driven, audio-synthesizing celebration of 31 years of existence. It is designed to be as efficient, flexible, and "plug-and-play" as the birthday boy himself.

> "There is no 'ctrl+z' in life, but there is always `git commit -am 'learned lesson'`."

## 🚀 Features

- **No Bloatware:** 0% static assets (no images, no mp3s). 100% Code.
- **Procedural Audio Engine:** All sounds (mechanical typing, retro 8-bit coins, bassy explosions) are synthesized in real-time using the Web Audio API.
- **Physics Kernel:** A custom 2D physics engine handling gravity, velocity, friction, and decay for hundreds of binary-coded particles.
- **Interactive Shell:** Click to unlock the system, watch the boot sequence, and trigger confetti compiled from raw math.

## 🛠 Tech Stack

- **Framework:** Angular (Standalone Components)
- **Graphics:** HTML5 Canvas API
- **Audio:** Web Audio API (Oscillators & GainNodes)
- **Styling:** SCSS, Fira Code Font

## 🤓 The Math Behind the Magic

How do we simulate a birthday explosion?

1.  **Polar to Cartesian Conversion:**
    We generate a random angle $\theta \in [0, 2\pi]$ and velocity $v$.
    $$v_x = \cos(\theta) \cdot v$$
    $$v_y = \sin(\theta) \cdot v$$

2.  **Euler Integration (The Loop):**
    For every frame:
    $$x_{t+1} = x_t + v_x$$
    $$y_{t+1} = y_t + v_y$$

3.  **Entropy (Friction & Gravity):**
    $$v_y = v_y + 0.05 \text{ (Gravity)}$$
    $$v = v \cdot 0.95 \text{ (Air Resistance)}$$

## ▶️ How to Run

1.  **Install Dependencies:**

    ```bash
    npm install
    ```

2.  **Launch Server:**

    ```bash
    ng serve
    ```

3.  **Execute Celebration:**
    Open `http://localhost:4200`.
    - **Click 1:** Initialize Audio Context & Boot System.
    - **Click 2+:** Trigger `SyntaxFireworks()`.

---

**Happy 31st Birthday, Khauta!**  
May your compilation always be successful and your runtime errors be zero.
