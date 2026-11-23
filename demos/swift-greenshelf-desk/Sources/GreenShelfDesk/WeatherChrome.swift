import MapKit
import SwiftUI

struct GlassCard<Content: View>: View {
    @ViewBuilder var content: () -> Content

    var body: some View {
        content()
            .padding(14)
            .frame(maxWidth: .infinity, alignment: .topLeading)
            .background(.ultraThinMaterial.opacity(0.65))
            .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: 18, style: .continuous)
                    .strokeBorder(
                        LinearGradient(
                            colors: [.white.opacity(0.35), .white.opacity(0.08)],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        ),
                        lineWidth: 1
                    )
            )
            .shadow(color: .black.opacity(0.12), radius: 12, y: 6)
    }
}

struct WindCompassView: View {
    let degrees: Double
    let speedMph: Double

    var body: some View {
        ZStack {
            Circle()
                .strokeBorder(.white.opacity(0.25), lineWidth: 2)
            ForEach(["N", "E", "S", "W"], id: \.self) { label in
                Text(label)
                    .font(.system(size: 9, weight: .bold))
                    .foregroundStyle(.white.opacity(0.7))
                    .offset(y: label == "N" ? -34 : label == "S" ? 34 : 0)
                    .offset(x: label == "E" ? 34 : label == "W" ? -34 : 0)
            }
            Capsule()
                .fill(.white)
                .frame(width: 3, height: 28)
                .offset(y: -14)
                .rotationEffect(.degrees(degrees))
            Circle()
                .fill(.white)
                .frame(width: 8, height: 8)
            VStack(spacing: 0) {
                Text("\(speedMph, specifier: "%.0f")")
                    .font(.system(size: 20, weight: .bold))
                Text("mph")
                    .font(.system(size: 10, weight: .medium))
                    .opacity(0.8)
            }
            .foregroundStyle(.white)
        }
        .frame(width: 88, height: 88)
    }
}

struct PressureGaugeView: View {
    let hpa: Double

    private var normalized: Double {
        min(1, max(0, (hpa - 980) / 50))
    }

    var body: some View {
        ZStack {
            Circle()
                .trim(from: 0.15, to: 0.85)
                .stroke(.white.opacity(0.2), style: StrokeStyle(lineWidth: 8, lineCap: .round))
                .rotationEffect(.degrees(90))
            Circle()
                .trim(from: 0.15, to: 0.15 + 0.7 * normalized)
                .stroke(
                    AngularGradient(colors: [.cyan, .green, .orange], center: .center),
                    style: StrokeStyle(lineWidth: 8, lineCap: .round)
                )
                .rotationEffect(.degrees(90))
            VStack(spacing: 2) {
                Text("\(hpa, specifier: "%.0f")")
                    .font(.system(size: 22, weight: .semibold))
                Text("mbar")
                    .font(.system(size: 10))
                    .opacity(0.75)
            }
            .foregroundStyle(.white)
        }
        .frame(width: 90, height: 90)
    }
}

struct SunArcView: View {
    let sunrise: Date?
    let sunset: Date?
    let now: Date = Date()

    private var progress: Double {
        guard let sunrise, let sunset, sunset > sunrise else { return 0.5 }
        if now <= sunrise { return 0 }
        if now >= sunset { return 1 }
        return now.timeIntervalSince(sunrise) / sunset.timeIntervalSince(sunrise)
    }

    var body: some View {
        GeometryReader { geo in
            let w = geo.size.width
            let h = geo.size.height
            ZStack {
                Path { path in
                    path.move(to: CGPoint(x: 8, y: h - 8))
                    path.addQuadCurve(to: CGPoint(x: w - 8, y: h - 8), control: CGPoint(x: w / 2, y: 4))
                }
                .stroke(.white.opacity(0.25), style: StrokeStyle(lineWidth: 3, lineCap: .round))

                Path { path in
                    path.move(to: CGPoint(x: 8, y: h - 8))
                    path.addQuadCurve(to: CGPoint(x: w - 8, y: h - 8), control: CGPoint(x: w / 2, y: 4))
                }
                .trim(from: 0, to: progress)
                .stroke(.yellow.opacity(0.9), style: StrokeStyle(lineWidth: 3, lineCap: .round))

                Circle()
                    .fill(.yellow)
                    .frame(width: 12, height: 12)
                    .shadow(color: .yellow.opacity(0.8), radius: 6)
                    .position(pointOnArc(progress: progress, width: w, height: h))
            }
        }
        .frame(height: 56)
    }

    private func pointOnArc(progress: Double, width: Double, height: Double) -> CGPoint {
        let t = progress
        let x = 8 + (width - 16) * t
        let y = (height - 8) * (1 - 4 * t * (1 - t)) + 4
        return CGPoint(x: x, y: y)
    }
}

struct AQIScaleView: View {
    let value: Int

    private var fraction: CGFloat {
        CGFloat(min(100, max(0, value))) / 100
    }

    var body: some View {
        GeometryReader { geo in
            ZStack(alignment: .leading) {
                Capsule()
                    .fill(
                        LinearGradient(
                            colors: [
                                Color(red: 0.3, green: 0.85, blue: 0.4),
                                Color(red: 0.95, green: 0.85, blue: 0.2),
                                Color(red: 0.95, green: 0.55, blue: 0.15),
                                Color(red: 0.9, green: 0.2, blue: 0.2),
                                Color(red: 0.55, green: 0.2, blue: 0.7),
                            ],
                            startPoint: .leading,
                            endPoint: .trailing
                        )
                    )
                    .frame(height: 5)
                Circle()
                    .fill(.white)
                    .frame(width: 12, height: 12)
                    .shadow(radius: 2)
                    .offset(x: max(0, min(geo.size.width - 12, geo.size.width * fraction - 6)))
            }
        }
        .frame(height: 12)
    }
}

struct WeatherMapCard: View {
    let weather: WeatherSnapshot

    var body: some View {
        GlassCard {
            VStack(alignment: .leading, spacing: 10) {
                Label("WIND MAP", systemImage: "map")
                    .font(.system(size: 11, weight: .semibold))
                    .foregroundStyle(.white.opacity(0.75))
                Map(initialPosition: .region(
                    MKCoordinateRegion(
                        center: CLLocationCoordinate2D(latitude: weather.latitude, longitude: weather.longitude),
                        span: MKCoordinateSpan(latitudeDelta: 0.35, longitudeDelta: 0.35)
                    )
                )) {
                    Annotation(weather.locationName, coordinate: CLLocationCoordinate2D(latitude: weather.latitude, longitude: weather.longitude)) {
                        ZStack {
                            Circle().fill(.blue.opacity(0.25)).frame(width: 44, height: 44)
                            Image(systemName: "location.north.fill")
                                .rotationEffect(.degrees(weather.windDirectionDeg))
                                .foregroundStyle(.white)
                                .padding(8)
                                .background(Circle().fill(.blue))
                        }
                    }
                }
                .mapStyle(.standard(elevation: .realistic))
                .frame(height: 180)
                .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
                Text("\(weather.windMph, specifier: "%.0f") mph · \(Int(weather.windDirectionDeg))°")
                    .font(.system(size: 12, design: .monospaced))
                    .foregroundStyle(.white.opacity(0.85))
            }
        }
    }
}
