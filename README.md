# Hardware Monitor

A high-performance, real-time hardware monitoring dashboard built with **Next.js 16**, **Shadcn/UI**, and **Recharts**.

## ✨ Features

* **📈 Real-Time Performance Streams**: Smooth,live charts for CPU, RAM, and Network (Wi-Fi) with a continuous scrolling behavior.
* **📋 Advanced Process Manager**:
    * Interactive table with live sorting by CPU, RAM, or PID.
    * State filtering (Running, Sleeping, etc.).
    * Instant search by process name or ID.
* **🔋 AMOLED Optimized**: True-black theme (`#000000`) to eliminate pixel power consumption and prevent screen burn-in.
* **🚀 Standalone Architecture**: Minimal deployment footprint designed for mobile SoC environments.

---

## 🛠 Scripts & Commands

### Development
Run the app locally on your PC with hot-reloading:
```bash
npm run dev
# Dashboard available at http://localhost:3000
```

### Build
Build the app for production:
```bash
npm run build
```
the output will be in the `.next` folder (standalone)

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
