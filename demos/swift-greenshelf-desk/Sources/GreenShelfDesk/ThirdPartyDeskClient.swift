import Foundation

struct PickupPerson: Sendable {
    let fullName: String
    let city: String
}

actor ThirdPartyDeskClient {
    private let session: URLSession
    private let isoFractional: ISO8601DateFormatter = {
        let f = ISO8601DateFormatter()
        f.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        return f
    }()
    private let iso: ISO8601DateFormatter = {
        let f = ISO8601DateFormatter()
        f.formatOptions = [.withInternetDateTime]
        return f
    }()

    init(session: URLSession = .shared) {
        self.session = session
    }

    func fetchWeatherBundle(for location: YardLocation) async throws -> WeatherSnapshot {
        async let forecast = fetchForecast(for: location)
        async let air = fetchAirQuality(for: location)
        let (dto, aqi) = try await (forecast, air)
        return map(dto, air: aqi, location: location)
    }

    func fetchPickupPeople(count: Int) async throws -> [PickupPerson] {
        var components = URLComponents(string: "https://randomuser.me/api/")!
        components.queryItems = [
            URLQueryItem(name: "results", value: String(count)),
            URLQueryItem(name: "nat", value: "gb"),
            URLQueryItem(name: "inc", value: "name,location"),
        ]
        let (data, response) = try await session.data(from: components.url!)
        try Self.throwIfNeeded(response)
        let decoded = try JSONDecoder().decode(RandomUserResponse.self, from: data)
        return decoded.results.map {
            PickupPerson(fullName: "\($0.name.first) \($0.name.last)", city: $0.location.city)
        }
    }

    private func fetchForecast(for location: YardLocation) async throws -> OpenMeteoFullResponse {
        var components = URLComponents(string: "https://api.open-meteo.com/v1/forecast")!
        components.queryItems = [
            URLQueryItem(name: "latitude", value: String(location.latitude)),
            URLQueryItem(name: "longitude", value: String(location.longitude)),
            URLQueryItem(
                name: "current",
                value: "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m,wind_gusts_10m"
            ),
            URLQueryItem(name: "hourly", value: "temperature_2m,weather_code,precipitation_probability"),
            URLQueryItem(
                name: "daily",
                value: "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum"
            ),
            URLQueryItem(name: "timezone", value: "auto"),
            URLQueryItem(name: "forecast_days", value: "10"),
            URLQueryItem(name: "wind_speed_unit", value: "mph"),
        ]
        let (data, response) = try await session.data(from: components.url!)
        try Self.throwIfNeeded(response)
        return try JSONDecoder().decode(OpenMeteoFullResponse.self, from: data)
    }

    private func fetchAirQuality(for location: YardLocation) async throws -> AirQuality? {
        var components = URLComponents(string: "https://air-quality-api.open-meteo.com/v1/air-quality")!
        components.queryItems = [
            URLQueryItem(name: "latitude", value: String(location.latitude)),
            URLQueryItem(name: "longitude", value: String(location.longitude)),
            URLQueryItem(name: "current", value: "european_aqi,pm2_5,pm10"),
            URLQueryItem(name: "timezone", value: "auto"),
        ]
        do {
            let (data, response) = try await session.data(from: components.url!)
            try Self.throwIfNeeded(response)
            let dto = try JSONDecoder().decode(AirQualityResponse.self, from: data)
            let aqi = Int(dto.current.european_aqi.rounded())
            return AirQuality(
                europeanAqi: aqi,
                pm25: dto.current.pm2_5,
                pm10: dto.current.pm10,
                label: aqiLabel(aqi)
            )
        } catch {
            return nil
        }
    }

    private func map(_ dto: OpenMeteoFullResponse, air: AirQuality?, location: YardLocation) -> WeatherSnapshot {
        let current = dto.current
        let daily = dto.daily
        let hourly = dto.hourly

        let sunriseRaw = daily.sunrise.first ?? ""
        let sunsetRaw = daily.sunset.first ?? ""
        let sunriseDate = parse(sunriseRaw)
        let sunsetDate = parse(sunsetRaw)
        let sunriseLabel = timeLabel(from: sunriseRaw)
        let sunsetLabel = timeLabel(from: sunsetRaw)

        let now = Date()
        var hourPoints: [HourPoint] = []
        let count = min(36, hourly.time.count)
        for i in 0..<count {
            let t = hourly.time[i]
            guard let date = parse(t), date >= now.addingTimeInterval(-1800) else { continue }
            let precip = i < hourly.precipitation_probability.count ? hourly.precipitation_probability[i] : 0
            hourPoints.append(
                HourPoint(
                    id: t,
                    label: hourLabel(date),
                    temperatureC: hourly.temperature_2m[i],
                    weatherCode: hourly.weather_code[i],
                    precipProbability: precip,
                    isSunrise: false,
                    isSunset: false
                )
            )
            if hourPoints.count >= 18 { break }
        }

        if sunriseDate != nil {
            hourPoints.insert(
                HourPoint(id: "sunrise-\(sunriseLabel)", label: sunriseLabel, temperatureC: 0, weatherCode: -1, precipProbability: 0, isSunrise: true, isSunset: false),
                at: min(3, hourPoints.count)
            )
        }
        if sunsetDate != nil {
            hourPoints.insert(
                HourPoint(id: "sunset-\(sunsetLabel)", label: sunsetLabel, temperatureC: 0, weatherCode: -2, precipProbability: 0, isSunrise: false, isSunset: true),
                at: min(hourPoints.count, max(6, hourPoints.count - 3))
            )
        }

        let dayFormatter = DateFormatter()
        dayFormatter.locale = Locale(identifier: "en_GB")
        dayFormatter.dateFormat = "yyyy-MM-dd"
        let outFmt = DateFormatter()
        outFmt.locale = Locale(identifier: "en_GB")
        outFmt.dateFormat = "EEE"

        var dayPoints: [DayPoint] = []
        let dayCount = min(10, daily.time.count)
        for i in 0..<dayCount {
            let label: String
            if i == 0 {
                label = "Today"
            } else if let d = dayFormatter.date(from: daily.time[i]) {
                label = outFmt.string(from: d)
            } else {
                label = daily.time[i]
            }
            dayPoints.append(
                DayPoint(
                    id: daily.time[i],
                    label: label,
                    weatherCode: daily.weather_code[i],
                    minC: daily.temperature_2m_min[i],
                    maxC: daily.temperature_2m_max[i],
                    precipMm: daily.precipitation_sum[i],
                    uvMax: i < daily.uv_index_max.count ? daily.uv_index_max[i] : 0
                )
            )
        }

        let t = current.temperature_2m
        let rh = current.relative_humidity_2m
        let dew = t - ((100 - rh) / 5)
        let high = daily.temperature_2m_max.first ?? t
        // Fake "average" delta for demo colour — mild seasonal baseline
        let seasonalAvg = 18.0
        let avgDelta = high - seasonalAvg

        return WeatherSnapshot(
            locationName: location.name,
            region: location.region,
            latitude: location.latitude,
            longitude: location.longitude,
            temperatureC: t,
            feelsLikeC: current.apparent_temperature,
            summary: WeatherCode.summary(current.weather_code),
            weatherCode: current.weather_code,
            highC: high,
            lowC: daily.temperature_2m_min.first ?? t,
            humidity: rh,
            dewPointC: dew,
            precipMm: current.precipitation,
            windMph: current.wind_speed_10m,
            windGustMph: current.wind_gusts_10m,
            windDirectionDeg: current.wind_direction_10m,
            pressureHpa: current.pressure_msl,
            uvIndex: daily.uv_index_max.first ?? 0,
            visibilityMi: max(1, 24 - current.cloud_cover / 5) * 0.621,
            cloudCover: current.cloud_cover,
            sunrise: sunriseLabel,
            sunset: sunsetLabel,
            sunriseDate: sunriseDate,
            sunsetDate: sunsetDate,
            hourly: hourPoints,
            daily: dayPoints,
            airQuality: air,
            moon: MoonPhaseCalculator.info(),
            avgHighDelta: avgDelta,
            source: "Open-Meteo",
            fetchedAt: Date()
        )
    }

    private func aqiLabel(_ value: Int) -> String {
        switch value {
        case ..<20: "Good"
        case ..<40: "Fair"
        case ..<60: "Moderate"
        case ..<80: "Poor"
        case ..<100: "Very poor"
        default: "Extremely poor"
        }
    }

    private func parse(_ value: String) -> Date? {
        isoFractional.date(from: value)
            ?? iso.date(from: value)
            ?? {
                let f = DateFormatter()
                f.locale = Locale(identifier: "en_US_POSIX")
                f.timeZone = .current
                f.dateFormat = "yyyy-MM-dd'T'HH:mm"
                return f.date(from: value)
            }()
    }

    private func timeLabel(from value: String) -> String {
        guard let date = parse(value) else { return "--:--" }
        let f = DateFormatter()
        f.locale = Locale(identifier: "en_GB")
        f.dateFormat = "HH:mm"
        return f.string(from: date)
    }

    private func hourLabel(_ date: Date) -> String {
        let f = DateFormatter()
        f.locale = Locale(identifier: "en_GB")
        f.dateFormat = "HH"
        return f.string(from: date)
    }

    private static func throwIfNeeded(_ response: URLResponse) throws {
        guard let http = response as? HTTPURLResponse, (200..<300).contains(http.statusCode) else {
            throw URLError(.badServerResponse)
        }
    }
}

// MARK: - DTOs

private struct OpenMeteoFullResponse: Decodable {
    let current: Current
    let hourly: Hourly
    let daily: Daily

    struct Current: Decodable {
        let temperature_2m: Double
        let relative_humidity_2m: Double
        let apparent_temperature: Double
        let precipitation: Double
        let weather_code: Int
        let cloud_cover: Double
        let pressure_msl: Double
        let wind_speed_10m: Double
        let wind_direction_10m: Double
        let wind_gusts_10m: Double
    }

    struct Hourly: Decodable {
        let time: [String]
        let temperature_2m: [Double]
        let weather_code: [Int]
        let precipitation_probability: [Int]
    }

    struct Daily: Decodable {
        let time: [String]
        let weather_code: [Int]
        let temperature_2m_max: [Double]
        let temperature_2m_min: [Double]
        let sunrise: [String]
        let sunset: [String]
        let uv_index_max: [Double]
        let precipitation_sum: [Double]
    }
}

private struct AirQualityResponse: Decodable {
    let current: Current
    struct Current: Decodable {
        let european_aqi: Double
        let pm2_5: Double
        let pm10: Double
    }
}

private struct RandomUserResponse: Decodable {
    let results: [Result]
    struct Result: Decodable {
        let name: Name
        let location: Location
    }
    struct Name: Decodable {
        let first: String
        let last: String
    }
    struct Location: Decodable {
        let city: String
    }
}
