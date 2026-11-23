import SwiftUI

struct WeatherDashboardView: View {
    let weather: WeatherSnapshot
    @State private var appeared = false

    private var sky: [Color] {
        switch weather.weatherCode {
        case 0, 1:
            [Color(red: 0.18, green: 0.48, blue: 0.95), Color(red: 0.42, green: 0.72, blue: 1.0), Color(red: 0.55, green: 0.78, blue: 0.98)]
        case 2, 3:
            [Color(red: 0.32, green: 0.48, blue: 0.72), Color(red: 0.48, green: 0.62, blue: 0.82), Color(red: 0.62, green: 0.72, blue: 0.86)]
        case 61, 63, 65, 80, 81, 82, 95, 96, 99:
            [Color(red: 0.22, green: 0.28, blue: 0.4), Color(red: 0.32, green: 0.4, blue: 0.55), Color(red: 0.4, green: 0.48, blue: 0.6)]
        default:
            [Color(red: 0.26, green: 0.36, blue: 0.52), Color(red: 0.38, green: 0.5, blue: 0.66), Color(red: 0.5, green: 0.6, blue: 0.74)]
        }
    }

    var body: some View {
        ScrollView {
            VStack(alignment: .center, spacing: 16) {
                hero
                hourlyCard
                grid
                WeatherMapCard(weather: weather)
                    .opacity(appeared ? 1 : 0)
                    .offset(y: appeared ? 0 : 20)
                footer
            }
            .padding(20)
        }
        .background(
            ZStack {
                LinearGradient(colors: sky, startPoint: .top, endPoint: .bottom)
                RadialGradient(
                    colors: [.white.opacity(0.18), .clear],
                    center: .top,
                    startRadius: 20,
                    endRadius: 420
                )
            }
            .ignoresSafeArea()
        )
        .onAppear {
            withAnimation(.easeOut(duration: 0.55)) { appeared = true }
        }
    }

    private var hero: some View {
        VStack(spacing: 6) {
            Text(weather.locationName)
                .font(.system(size: 30, weight: .medium))
            Text(weather.region)
                .font(.system(size: 13, weight: .medium))
                .opacity(0.85)
            Text("\(weather.temperatureC, specifier: "%.0f")°")
                .font(.system(size: 96, weight: .ultraLight))
                .contentTransition(.numericText())
            HStack(spacing: 8) {
                Image(systemName: WeatherCode.symbol(weather.weatherCode))
                Text(weather.summary)
                    .font(.system(size: 20, weight: .semibold))
            }
            Text("H:\(weather.highC, specifier: "%.0f")°   L:\(weather.lowC, specifier: "%.0f")°")
                .font(.system(size: 15, weight: .medium))
                .opacity(0.92)
        }
        .foregroundStyle(.white)
        .frame(maxWidth: .infinity)
        .padding(.vertical, 8)
        .scaleEffect(appeared ? 1 : 0.96)
        .opacity(appeared ? 1 : 0)
    }

    private var hourlyCard: some View {
        GlassCard {
            VStack(alignment: .leading, spacing: 12) {
                Label("HOURLY FORECAST", systemImage: "clock")
                    .font(.system(size: 11, weight: .semibold))
                    .foregroundStyle(.white.opacity(0.75))
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 16) {
                        ForEach(weather.hourly) { hour in
                            hourColumn(hour)
                        }
                    }
                    .padding(.vertical, 2)
                }
            }
        }
    }

    @ViewBuilder
    private func hourColumn(_ hour: HourPoint) -> some View {
        VStack(spacing: 8) {
            if hour.isSunrise {
                Text("Sunrise").font(.system(size: 11, weight: .semibold))
                Image(systemName: "sunrise.fill").font(.title3).symbolRenderingMode(.multicolor)
                Text(hour.label).font(.system(size: 12, weight: .bold))
            } else if hour.isSunset {
                Text("Sunset").font(.system(size: 11, weight: .semibold))
                Image(systemName: "sunset.fill").font(.title3).symbolRenderingMode(.multicolor)
                Text(hour.label).font(.system(size: 12, weight: .bold))
            } else {
                Text(Int(hour.label) == Calendar.current.component(.hour, from: Date()) ? "Now" : hour.label)
                    .font(.system(size: 12, weight: .semibold))
                Image(systemName: WeatherCode.symbol(hour.weatherCode))
                    .font(.title3)
                    .symbolRenderingMode(.multicolor)
                if hour.precipProbability >= 20 {
                    Text("\(hour.precipProbability)%")
                        .font(.system(size: 10, weight: .bold))
                        .foregroundStyle(Color.cyan)
                }
                Text("\(hour.temperatureC, specifier: "%.0f")°")
                    .font(.system(size: 15, weight: .bold))
            }
        }
        .foregroundStyle(.white)
        .frame(minWidth: 48)
    }

    private var grid: some View {
        LazyVGrid(columns: [
            GridItem(.flexible(), spacing: 12),
            GridItem(.flexible(), spacing: 12),
            GridItem(.flexible(), spacing: 12),
        ], spacing: 12) {
            tenDayCard.gridCellColumns(1)
            aqiCard
            windCard
            uvCard
            sunsetCard
            feelsCard
            precipCard
            moonCard
            humidityCard
            visibilityCard
            pressureCard
            averagesCard
        }
    }

    private var tenDayCard: some View {
        GlassCard {
            VStack(alignment: .leading, spacing: 10) {
                Label("10-DAY FORECAST", systemImage: "calendar")
                    .font(.system(size: 11, weight: .semibold))
                    .foregroundStyle(.white.opacity(0.75))
                ForEach(weather.daily) { day in
                    HStack(spacing: 8) {
                        Text(day.label)
                            .frame(width: 48, alignment: .leading)
                            .font(.system(size: 13, weight: .semibold))
                        Image(systemName: WeatherCode.symbol(day.weatherCode))
                            .foregroundStyle(.yellow)
                            .frame(width: 18)
                        if day.precipMm >= 0.2 {
                            Text("\(day.precipMm, specifier: "%.0f")")
                                .font(.system(size: 10, weight: .bold))
                                .foregroundStyle(.cyan)
                                .frame(width: 16)
                        } else {
                            Color.clear.frame(width: 16)
                        }
                        Text("\(day.minC, specifier: "%.0f")°")
                            .foregroundStyle(.white.opacity(0.55))
                            .frame(width: 28, alignment: .trailing)
                        tempRangeBar(min: day.minC, max: day.maxC)
                        Text("\(day.maxC, specifier: "%.0f")°")
                            .frame(width: 28, alignment: .leading)
                    }
                    .font(.system(size: 13))
                    .foregroundStyle(.white)
                }
            }
        }
    }

    private func tempRangeBar(min low: Double, max high: Double) -> some View {
        GeometryReader { geo in
            let span = Swift.max(1, weather.weekMax - weather.weekMin)
            let start = (low - weather.weekMin) / span
            let end = (high - weather.weekMin) / span
            ZStack(alignment: .leading) {
                Capsule().fill(.white.opacity(0.15))
                Capsule()
                    .fill(LinearGradient(colors: [.cyan, .yellow, .orange], startPoint: .leading, endPoint: .trailing))
                    .frame(width: Swift.max(8, geo.size.width * (end - start)))
                    .offset(x: geo.size.width * start)
            }
        }
        .frame(height: 4)
    }

    private var aqiCard: some View {
        GlassCard {
            VStack(alignment: .leading, spacing: 8) {
                Label("AIR POLLUTION", systemImage: "aqi.medium")
                    .font(.system(size: 11, weight: .semibold))
                    .foregroundStyle(.white.opacity(0.75))
                if let aqi = weather.airQuality {
                    Text("\(aqi.europeanAqi)")
                        .font(.system(size: 36, weight: .bold))
                        .foregroundStyle(.white)
                    Text(aqi.label)
                        .foregroundStyle(.white.opacity(0.85))
                    AQIScaleView(value: aqi.europeanAqi)
                    Text("PM2.5 \(aqi.pm25, specifier: "%.0f") · PM10 \(aqi.pm10, specifier: "%.0f")")
                        .font(.system(size: 11, design: .monospaced))
                        .foregroundStyle(.white.opacity(0.7))
                } else {
                    Text("—")
                        .font(.system(size: 36, weight: .bold))
                        .foregroundStyle(.white)
                    Text("Air quality unavailable")
                        .foregroundStyle(.white.opacity(0.7))
                }
            }
        }
    }

    private var windCard: some View {
        GlassCard {
            VStack(alignment: .leading, spacing: 8) {
                Label("WIND", systemImage: "wind")
                    .font(.system(size: 11, weight: .semibold))
                    .foregroundStyle(.white.opacity(0.75))
                HStack {
                    VStack(alignment: .leading, spacing: 4) {
                        Text("\(weather.windMph, specifier: "%.0f") mph")
                            .font(.system(size: 24, weight: .bold))
                            .foregroundStyle(.white)
                        Text("Gusts \(weather.windGustMph, specifier: "%.0f") mph")
                            .foregroundStyle(.white.opacity(0.75))
                        Text(windLabel)
                            .font(.system(size: 12, design: .monospaced))
                            .foregroundStyle(.white.opacity(0.7))
                    }
                    Spacer()
                    WindCompassView(degrees: weather.windDirectionDeg, speedMph: weather.windMph)
                }
            }
        }
    }

    private var uvCard: some View {
        GlassCard {
            VStack(alignment: .leading, spacing: 8) {
                Label("UV INDEX", systemImage: "sun.max.fill")
                    .font(.system(size: 11, weight: .semibold))
                    .foregroundStyle(.white.opacity(0.75))
                Text("\(weather.uvIndex, specifier: "%.0f")")
                    .font(.system(size: 36, weight: .bold))
                    .foregroundStyle(.white)
                Text(uvLabel)
                    .foregroundStyle(.white.opacity(0.85))
                GeometryReader { geo in
                    ZStack(alignment: .leading) {
                        Capsule().fill(
                            LinearGradient(colors: [.green, .yellow, .orange, .red, .purple], startPoint: .leading, endPoint: .trailing)
                        ).frame(height: 5)
                        Circle().fill(.white).frame(width: 12, height: 12)
                            .offset(x: min(geo.size.width - 12, geo.size.width * CGFloat(min(weather.uvIndex, 11) / 11)))
                    }
                }
                .frame(height: 12)
            }
        }
    }

    private var sunsetCard: some View {
        GlassCard {
            VStack(alignment: .leading, spacing: 8) {
                Label("SUNSET", systemImage: "sunset.fill")
                    .font(.system(size: 11, weight: .semibold))
                    .foregroundStyle(.white.opacity(0.75))
                Text(weather.sunset)
                    .font(.system(size: 32, weight: .bold))
                    .foregroundStyle(.white)
                SunArcView(sunrise: weather.sunriseDate, sunset: weather.sunsetDate)
                Text("Sunrise \(weather.sunrise)")
                    .foregroundStyle(.white.opacity(0.8))
            }
        }
    }

    private var feelsCard: some View {
        GlassCard {
            VStack(alignment: .leading, spacing: 8) {
                Label("FEELS LIKE", systemImage: "thermometer.medium")
                    .font(.system(size: 11, weight: .semibold))
                    .foregroundStyle(.white.opacity(0.75))
                Text("\(weather.feelsLikeC, specifier: "%.0f")°")
                    .font(.system(size: 36, weight: .bold))
                    .foregroundStyle(.white)
                Text(feelsNote)
                    .foregroundStyle(.white.opacity(0.8))
                    .fixedSize(horizontal: false, vertical: true)
            }
        }
    }

    private var precipCard: some View {
        GlassCard {
            VStack(alignment: .leading, spacing: 8) {
                Label("PRECIPITATION", systemImage: "drop.fill")
                    .font(.system(size: 11, weight: .semibold))
                    .foregroundStyle(.white.opacity(0.75))
                Text("\(weather.precipMm, specifier: "%.1f") mm")
                    .font(.system(size: 28, weight: .bold))
                    .foregroundStyle(.white)
                Text("last hour")
                    .foregroundStyle(.white.opacity(0.75))
                let nextRain = weather.daily.dropFirst().first { $0.precipMm >= 0.5 }
                Text(nextRain.map { "Next wet day: \($0.label) (\($0.precipMm, specifier: "%.0f") mm)" } ?? "No meaningful rain in the outlook")
                    .font(.system(size: 12))
                    .foregroundStyle(.white.opacity(0.8))
                    .fixedSize(horizontal: false, vertical: true)
            }
        }
    }

    private var moonCard: some View {
        GlassCard {
            VStack(alignment: .leading, spacing: 8) {
                Label(weather.moon.phaseName.uppercased(), systemImage: weather.moon.symbol)
                    .font(.system(size: 11, weight: .semibold))
                    .foregroundStyle(.white.opacity(0.75))
                HStack {
                    Image(systemName: weather.moon.symbol)
                        .font(.system(size: 44))
                        .foregroundStyle(.white)
                        .symbolRenderingMode(.hierarchical)
                    VStack(alignment: .leading, spacing: 4) {
                        Text("\(weather.moon.illumination, specifier: "%.0f")% illuminated")
                            .foregroundStyle(.white)
                        Text("Full moon in \(weather.moon.daysToFull) days")
                            .foregroundStyle(.white.opacity(0.75))
                    }
                }
            }
        }
    }

    private var humidityCard: some View {
        GlassCard {
            VStack(alignment: .leading, spacing: 8) {
                Label("HUMIDITY", systemImage: "humidity.fill")
                    .font(.system(size: 11, weight: .semibold))
                    .foregroundStyle(.white.opacity(0.75))
                Text("\(weather.humidity, specifier: "%.0f")%")
                    .font(.system(size: 36, weight: .bold))
                    .foregroundStyle(.white)
                Text("The dew point is \(weather.dewPointC, specifier: "%.0f")° right now.")
                    .foregroundStyle(.white.opacity(0.8))
                    .fixedSize(horizontal: false, vertical: true)
            }
        }
    }

    private var visibilityCard: some View {
        GlassCard {
            VStack(alignment: .leading, spacing: 8) {
                Label("VISIBILITY", systemImage: "eye.fill")
                    .font(.system(size: 11, weight: .semibold))
                    .foregroundStyle(.white.opacity(0.75))
                Text("\(weather.visibilityMi, specifier: "%.0f") mi")
                    .font(.system(size: 36, weight: .bold))
                    .foregroundStyle(.white)
                Text(weather.visibilityMi > 10 ? "Perfectly clear view." : "Haze limiting distance.")
                    .foregroundStyle(.white.opacity(0.8))
            }
        }
    }

    private var pressureCard: some View {
        GlassCard {
            VStack(alignment: .leading, spacing: 8) {
                Label("PRESSURE", systemImage: "barometer")
                    .font(.system(size: 11, weight: .semibold))
                    .foregroundStyle(.white.opacity(0.75))
                HStack {
                    PressureGaugeView(hpa: weather.pressureHpa)
                    Spacer()
                    Text(weather.pressureHpa >= 1020 ? "High" : weather.pressureHpa <= 1000 ? "Low" : "Steady")
                        .foregroundStyle(.white.opacity(0.85))
                }
            }
        }
    }

    private var averagesCard: some View {
        GlassCard {
            VStack(alignment: .leading, spacing: 8) {
                Label("AVERAGES", systemImage: "chart.line.uptrend.xyaxis")
                    .font(.system(size: 11, weight: .semibold))
                    .foregroundStyle(.white.opacity(0.75))
                Text(weather.avgHighDelta >= 0 ? "+\(weather.avgHighDelta, specifier: "%.0f")°" : "\(weather.avgHighDelta, specifier: "%.0f")°")
                    .font(.system(size: 32, weight: .bold))
                    .foregroundStyle(.white)
                Text(weather.avgHighDelta >= 0 ? "above typical daily high" : "below typical daily high")
                    .foregroundStyle(.white.opacity(0.8))
                Text("Cloud cover \(weather.cloudCover, specifier: "%.0f")%")
                    .font(.system(size: 12, design: .monospaced))
                    .foregroundStyle(.white.opacity(0.7))
            }
        }
    }

    private var footer: some View {
        Text("Open-Meteo forecast + air quality · refreshed \(weather.fetchedAt.formatted(date: .omitted, time: .shortened))")
            .font(.system(size: 11, design: .monospaced))
            .foregroundStyle(.white.opacity(0.7))
            .padding(.bottom, 12)
    }

    private var uvLabel: String {
        switch weather.uvIndex {
        case ..<3: "Low"
        case ..<6: "Moderate"
        case ..<8: "High"
        default: "Very high"
        }
    }

    private var feelsNote: String {
        let delta = weather.feelsLikeC - weather.temperatureC
        if delta < -1 { return "Wind is making it feel cooler." }
        if delta > 1 { return "Humidity is making it feel warmer." }
        return "Similar to the actual temperature."
    }

    private var windLabel: String {
        let dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
        let idx = Int((weather.windDirectionDeg + 22.5) / 45.0) % 8
        return "\(Int(weather.windDirectionDeg))° \(dirs[idx])"
    }
}
