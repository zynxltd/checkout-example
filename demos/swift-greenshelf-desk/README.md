# GreenShelf Desk — SwiftUI Mac app

Tiny **native macOS** click-and-collect desk (Swift 6 + SwiftUI). No Xcode project required — builds with the Swift toolchain / Command Line Tools.

## Prerequisites

Swift is already on macOS via Xcode **or** Command Line Tools:

```bash
swift --version
# If missing:
xcode-select --install
```

Full Xcode is optional for this demo (GUI frameworks come with the macOS SDK).

## Run

```bash
cd demos/swift-greenshelf-desk
chmod +x scripts/run.sh
./scripts/run.sh
```

Or:

```bash
swift build -c release
swift run -c release
```

`run.sh` also wraps the binary as `dist/GreenShelfDesk.app` and opens it.

## What it shows

Weather-app-style UI powered by **Open-Meteo** (forecast + air quality, no API keys):

- Sidebar search + 6 locations
- Hero temp, hourly (precip %), 10-day range bars
- Tiles: AQI, wind compass, UV, sunset arc, feels like, precip, moon phase, humidity, visibility, pressure gauge, averages
- MapKit wind map pin
- Collect desk tab still uses Random User

```bash
./scripts/run.sh
```

⌘R refreshes. Needs network.
