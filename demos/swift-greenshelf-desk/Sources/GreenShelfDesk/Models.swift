import Foundation

enum PickupStatus: String, CaseIterable, Identifiable {
    case booked = "Booked"
    case ready = "Ready"
    case collected = "Collected"
    var id: String { rawValue }
}

struct Reservation: Identifiable, Equatable {
    let id: UUID
    var customer: String
    var items: String
    var slot: String
    var status: PickupStatus
    var city: String
}

struct YardLocation: Identifiable, Hashable, Sendable {
    let id: String
    let name: String
    let region: String
    let latitude: Double
    let longitude: Double
}

struct HourPoint: Identifiable, Equatable, Sendable {
    let id: String
    let label: String
    let temperatureC: Double
    let weatherCode: Int
    let precipProbability: Int
    let isSunrise: Bool
    let isSunset: Bool
}

struct DayPoint: Identifiable, Equatable, Sendable {
    let id: String
    let label: String
    let weatherCode: Int
    let minC: Double
    let maxC: Double
    let precipMm: Double
    let uvMax: Double
}

struct AirQuality: Equatable, Sendable {
    let europeanAqi: Int
    let pm25: Double
    let pm10: Double
    let label: String
}

struct MoonInfo: Equatable, Sendable {
    let phaseName: String
    let illumination: Double
    let daysToFull: Int
    let symbol: String
}

struct WeatherSnapshot: Equatable, Sendable {
    let locationName: String
    let region: String
    let latitude: Double
    let longitude: Double
    let temperatureC: Double
    let feelsLikeC: Double
    let summary: String
    let weatherCode: Int
    let highC: Double
    let lowC: Double
    let humidity: Double
    let dewPointC: Double
    let precipMm: Double
    let windMph: Double
    let windGustMph: Double
    let windDirectionDeg: Double
    let pressureHpa: Double
    let uvIndex: Double
    let visibilityMi: Double
    let cloudCover: Double
    let sunrise: String
    let sunset: String
    let sunriseDate: Date?
    let sunsetDate: Date?
    let hourly: [HourPoint]
    let daily: [DayPoint]
    let airQuality: AirQuality?
    let moon: MoonInfo
    let avgHighDelta: Double
    let source: String
    let fetchedAt: Date

    var weekMin: Double { daily.map(\.minC).min() ?? lowC }
    var weekMax: Double { daily.map(\.maxC).max() ?? highC }
}

enum DeskLoadState: Equatable {
    case idle
    case loading
    case loaded
    case failed(String)
}

enum AppTab: String, CaseIterable, Identifiable {
    case weather = "Weather"
    case desk = "Collect desk"
    var id: String { rawValue }
}

@MainActor
final class DeskStore: ObservableObject {
    static let locations: [YardLocation] = [
        YardLocation(id: "yard", name: "GreenShelf Yard", region: "Nottinghamshire", latitude: 52.95, longitude: -1.15),
        YardLocation(id: "deeping", name: "Market Deeping", region: "South Kesteven", latitude: 52.76, longitude: -0.32),
        YardLocation(id: "london", name: "London", region: "England", latitude: 51.51, longitude: -0.13),
        YardLocation(id: "edinburgh", name: "Edinburgh", region: "Scotland", latitude: 55.95, longitude: -3.19),
        YardLocation(id: "holme", name: "Holme Next The Sea", region: "Norfolk", latitude: 52.97, longitude: 0.54),
        YardLocation(id: "torrevieja", name: "Torrevieja", region: "Spain", latitude: 37.98, longitude: -0.68),
    ]

    @Published var selectedLocationId: String = "yard"
    @Published var tab: AppTab = .weather
    @Published var locationQuery: String = ""
    @Published private(set) var weatherByLocation: [String: WeatherSnapshot] = [:]
    @Published private(set) var reservations: [Reservation] = []
    @Published private(set) var loadState: DeskLoadState = .idle

    private let client: ThirdPartyDeskClient

    var filteredLocations: [YardLocation] {
        let q = locationQuery.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !q.isEmpty else { return Self.locations }
        return Self.locations.filter {
            $0.name.localizedCaseInsensitiveContains(q) || $0.region.localizedCaseInsensitiveContains(q)
        }
    }

    var selectedLocation: YardLocation {
        Self.locations.first { $0.id == selectedLocationId } ?? Self.locations[0]
    }

    var weather: WeatherSnapshot? {
        weatherByLocation[selectedLocationId]
    }

    init(client: ThirdPartyDeskClient = ThirdPartyDeskClient()) {
        self.client = client
    }

    func selectLocation(_ id: String) {
        selectedLocationId = id
        Task { await refreshWeather(for: id) }
    }

    func refresh() async {
        loadState = .loading
        do {
            async let peopleTask = client.fetchPickupPeople(count: 6)
            async let weatherTask = client.fetchWeatherBundle(for: selectedLocation)
            let (people, snap) = try await (peopleTask, weatherTask)
            reservations = DeskMapper.reservations(from: people)
            weatherByLocation[selectedLocationId] = snap

            await withTaskGroup(of: (String, WeatherSnapshot)?.self) { group in
                for loc in Self.locations where loc.id != selectedLocationId {
                    group.addTask {
                        guard let snap = try? await self.client.fetchWeatherBundle(for: loc) else { return nil }
                        return (loc.id, snap)
                    }
                }
                for await item in group {
                    if let item { weatherByLocation[item.0] = item.1 }
                }
            }
            loadState = .loaded
        } catch {
            loadState = .failed(error.localizedDescription)
            if reservations.isEmpty {
                reservations = DeskMapper.fallbackReservations()
            }
        }
    }

    func refreshWeather(for locationId: String) async {
        guard let loc = Self.locations.first(where: { $0.id == locationId }) else { return }
        do {
            let snap = try await client.fetchWeatherBundle(for: loc)
            weatherByLocation[locationId] = snap
            if loadState != .loaded { loadState = .loaded }
        } catch {
            if weatherByLocation[locationId] == nil {
                loadState = .failed(error.localizedDescription)
            }
        }
    }

    func markReady(_ id: UUID) {
        guard let i = reservations.firstIndex(where: { $0.id == id }),
              reservations[i].status == .booked else { return }
        reservations[i].status = .ready
    }

    func collect(_ id: UUID) {
        guard let i = reservations.firstIndex(where: { $0.id == id }),
              reservations[i].status == .ready else { return }
        reservations[i].status = .collected
    }
}

enum DeskMapper {
    private static let catalogue = [
        "Lavender ×2", "Tomato kit ×1", "Hose reel ×1", "Feed bag ×1",
        "Herb tray ×3", "Rose bare-root ×1", "Compost 40L ×2",
    ]
    private static let slots = [
        "Today 11:00", "Today 14:00", "Today 15:30", "Today 16:45", "Tomorrow 10:00",
    ]

    static func reservations(from people: [PickupPerson]) -> [Reservation] {
        let statuses: [PickupStatus] = [.booked, .booked, .ready, .ready, .collected, .booked]
        return people.enumerated().map { index, person in
            Reservation(
                id: UUID(),
                customer: person.fullName,
                items: catalogue[index % catalogue.count],
                slot: slots[index % slots.count],
                status: statuses[index % statuses.count],
                city: person.city
            )
        }
    }

    static func fallbackReservations() -> [Reservation] {
        [
            Reservation(id: UUID(), customer: "Sam Lee (offline)", items: "Lavender ×2", slot: "Today 14:00", status: .booked, city: "Nottingham"),
            Reservation(id: UUID(), customer: "Jordan Ng (offline)", items: "Tomato kit ×1", slot: "Today 15:30", status: .ready, city: "Derby"),
        ]
    }
}

enum WeatherCode {
    static func summary(_ code: Int) -> String {
        switch code {
        case 0: "Clear"
        case 1: "Mainly clear"
        case 2: "Partly cloudy"
        case 3: "Overcast"
        case 45, 48: "Fog"
        case 51, 53, 55: "Drizzle"
        case 61, 63, 65: "Rain"
        case 71, 73, 75: "Snow"
        case 80, 81, 82: "Showers"
        case 95, 96, 99: "Thunder"
        default: "Mixed"
        }
    }

    static func symbol(_ code: Int) -> String {
        switch code {
        case 0: "sun.max.fill"
        case 1, 2: "cloud.sun.fill"
        case 3: "cloud.fill"
        case 45, 48: "cloud.fog.fill"
        case 51, 53, 55, 61, 63, 65, 80, 81, 82: "cloud.rain.fill"
        case 71, 73, 75: "cloud.snow.fill"
        case 95, 96, 99: "cloud.bolt.rain.fill"
        default: "cloud.fill"
        }
    }
}

enum MoonPhaseCalculator {
    static func info(on date: Date = Date()) -> MoonInfo {
        // Approximate synodic month from a known new moon
        let knownNew = Date(timeIntervalSince1970: 947182440) // 2000-01-06
        let synodic = 29.53058867
        let days = date.timeIntervalSince(knownNew) / 86_400
        let age = days.truncatingRemainder(dividingBy: synodic)
        let positiveAge = age >= 0 ? age : age + synodic
        let illumination = (1 - cos(2 * .pi * positiveAge / synodic)) / 2 * 100
        let daysToFull = Int((14.765 - positiveAge).truncatingRemainder(dividingBy: synodic).rounded())
        let normalized = daysToFull < 0 ? daysToFull + 30 : daysToFull

        let (name, symbol): (String, String) = {
            switch positiveAge {
            case 0..<1.8: ("New Moon", "moonphase.new.moon")
            case 1.8..<7.4: ("Waxing Crescent", "moonphase.waxing.crescent")
            case 7.4..<9.2: ("First Quarter", "moonphase.first.quarter")
            case 9.2..<14.8: ("Waxing Gibbous", "moonphase.waxing.gibbous")
            case 14.8..<16.6: ("Full Moon", "moonphase.full.moon")
            case 16.6..<22.1: ("Waning Gibbous", "moonphase.waning.gibbous")
            case 22.1..<24.0: ("Last Quarter", "moonphase.last.quarter")
            default: ("Waning Crescent", "moonphase.waning.crescent")
            }
        }()

        return MoonInfo(phaseName: name, illumination: illumination, daysToFull: normalized, symbol: symbol)
    }
}
