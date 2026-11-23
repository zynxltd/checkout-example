import SwiftUI

struct ContentView: View {
    @EnvironmentObject private var store: DeskStore
    @State private var filter: PickupStatus? = nil

    var body: some View {
        NavigationSplitView {
            sidebar
                .navigationSplitViewColumnWidth(min: 240, ideal: 270, max: 320)
        } detail: {
            VStack(spacing: 0) {
                toolbar
                Divider()
                Group {
                    switch store.tab {
                    case .weather:
                        weatherPane
                    case .desk:
                        deskPane
                    }
                }
            }
        }
        .frame(minWidth: 1100, minHeight: 740)
        .task { await store.refresh() }
    }

    private var sidebar: some View {
        VStack(spacing: 0) {
            HStack {
                Image(systemName: "magnifyingglass")
                    .foregroundStyle(.secondary)
                TextField("Search locations", text: $store.locationQuery)
                    .textFieldStyle(.plain)
            }
            .padding(10)
            .background(Color.primary.opacity(0.05))
            .clipShape(RoundedRectangle(cornerRadius: 8))
            .padding(12)

            List(selection: Binding(
                get: { store.selectedLocationId },
                set: { store.selectLocation($0) }
            )) {
                Section("Saved") {
                    ForEach(store.filteredLocations) { loc in
                        LocationRow(
                            location: loc,
                            snapshot: store.weatherByLocation[loc.id]
                        )
                        .tag(loc.id)
                    }
                }
            }
            .listStyle(.sidebar)
        }
        .safeAreaInset(edge: .bottom) {
            Text("Open-Meteo · Air Quality API")
                .font(.system(size: 10, design: .monospaced))
                .foregroundStyle(.secondary)
                .frame(maxWidth: .infinity)
                .padding(.bottom, 10)
        }
    }

    private var toolbar: some View {
        HStack {
            Picker("Tab", selection: $store.tab) {
                ForEach(AppTab.allCases) { tab in
                    Text(tab.rawValue).tag(tab)
                }
            }
            .pickerStyle(.segmented)
            .frame(maxWidth: 300)

            if store.loadState == .loading {
                ProgressView()
                    .controlSize(.small)
                    .padding(.leading, 8)
            }

            Spacer()

            Button {
                Task { await store.refresh() }
            } label: {
                Label("Refresh", systemImage: "arrow.clockwise")
            }
            .keyboardShortcut("r", modifiers: [.command])
            .disabled(store.loadState == .loading)
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 10)
    }

    @ViewBuilder
    private var weatherPane: some View {
        if store.weather == nil && (store.loadState == .idle || store.loadState == .loading) {
            ZStack {
                LinearGradient(
                    colors: [Color(red: 0.25, green: 0.5, blue: 0.92), Color(red: 0.45, green: 0.72, blue: 0.98)],
                    startPoint: .top,
                    endPoint: .bottom
                )
                VStack(spacing: 14) {
                    ProgressView()
                        .controlSize(.large)
                        .tint(.white)
                    Text("Loading Open-Meteo + air quality…")
                        .foregroundStyle(.white)
                        .font(.system(size: 14, weight: .medium))
                }
            }
        } else if case .failed(let message) = store.loadState, store.weather == nil {
            ContentUnavailableView(
                "Weather unavailable",
                systemImage: "cloud.slash",
                description: Text(message)
            )
        } else if let weather = store.weather {
            WeatherDashboardView(weather: weather)
                .id(weather.locationName + weather.fetchedAt.description)
        } else {
            ContentUnavailableView("Select a location", systemImage: "cloud.sun")
        }
    }

    private var deskPane: some View {
        let rows: [Reservation] = {
            guard let filter else { return store.reservations }
            return store.reservations.filter { $0.status == filter }
        }()

        return VStack(alignment: .leading, spacing: 0) {
            HStack {
                Text("Click & collect")
                    .font(.system(size: 22, weight: .semibold, design: .serif))
                Spacer()
                Text("Customers via randomuser.me")
                    .font(.system(size: 11))
                    .foregroundStyle(.secondary)
            }
            .padding(16)

            HStack(spacing: 8) {
                filterChip("All", selected: filter == nil) { filter = nil }
                ForEach(PickupStatus.allCases) { status in
                    filterChip(status.rawValue, selected: filter == status) { filter = status }
                }
            }
            .padding(.horizontal, 16)
            .padding(.bottom, 12)

            ScrollView {
                LazyVStack(spacing: 10) {
                    ForEach(rows) { row in
                        ReservationRow(reservation: row)
                    }
                }
                .padding(16)
            }
        }
        .background(Color(nsColor: .windowBackgroundColor))
    }

    private func filterChip(_ title: String, selected: Bool, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            Text(title)
                .font(.system(size: 12, weight: .medium))
                .padding(.horizontal, 12)
                .padding(.vertical, 6)
                .background(selected ? Color(red: 0.12, green: 0.32, blue: 0.22) : Color.primary.opacity(0.06))
                .foregroundStyle(selected ? Color.white : Color.primary)
                .clipShape(RoundedRectangle(cornerRadius: 6))
        }
        .buttonStyle(.plain)
    }
}

struct LocationRow: View {
    let location: YardLocation
    let snapshot: WeatherSnapshot?

    var body: some View {
        HStack(alignment: .center, spacing: 10) {
            VStack(alignment: .leading, spacing: 3) {
                Text(location.name)
                    .font(.system(size: 14, weight: .semibold))
                if let snapshot {
                    Text(snapshot.summary)
                        .font(.system(size: 12))
                        .foregroundStyle(.secondary)
                        .lineLimit(1)
                    Text("H:\(snapshot.highC, specifier: "%.0f")° L:\(snapshot.lowC, specifier: "%.0f")°")
                        .font(.system(size: 11))
                        .foregroundStyle(.tertiary)
                } else {
                    Text(location.region)
                        .font(.system(size: 12))
                        .foregroundStyle(.secondary)
                }
            }
            Spacer(minLength: 0)
            if let snapshot {
                VStack(alignment: .trailing, spacing: 2) {
                    Text("\(snapshot.temperatureC, specifier: "%.0f")°")
                        .font(.system(size: 28, weight: .light))
                    Image(systemName: WeatherCode.symbol(snapshot.weatherCode))
                        .foregroundStyle(.secondary)
                }
            }
        }
        .padding(.vertical, 6)
    }
}

struct ReservationRow: View {
    @EnvironmentObject private var store: DeskStore
    let reservation: Reservation

    var body: some View {
        HStack(spacing: 16) {
            VStack(alignment: .leading, spacing: 4) {
                Text(reservation.customer)
                    .font(.system(size: 15, weight: .semibold))
                Text(reservation.items)
                    .font(.system(size: 13))
                    .foregroundStyle(.secondary)
                Text("\(reservation.slot) · \(reservation.city)")
                    .font(.system(size: 11, design: .monospaced))
                    .foregroundStyle(.tertiary)
            }
            Spacer()
            Text(reservation.status.rawValue)
                .font(.system(size: 11, weight: .semibold))
                .padding(.horizontal, 8)
                .padding(.vertical, 4)
                .background(Color.primary.opacity(0.08))
                .clipShape(RoundedRectangle(cornerRadius: 4))
            switch reservation.status {
            case .booked:
                Button("Mark ready") { store.markReady(reservation.id) }
                    .buttonStyle(.borderedProminent)
                    .tint(Color(red: 0.12, green: 0.32, blue: 0.22))
            case .ready:
                Button("Collect") { store.collect(reservation.id) }
                    .buttonStyle(.borderedProminent)
                    .tint(Color(red: 0.12, green: 0.32, blue: 0.22))
            case .collected:
                EmptyView()
            }
        }
        .padding(14)
        .background(Color.primary.opacity(0.03))
        .clipShape(RoundedRectangle(cornerRadius: 10))
    }
}
