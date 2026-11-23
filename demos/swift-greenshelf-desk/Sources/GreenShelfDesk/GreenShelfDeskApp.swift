import SwiftUI

@main
struct GreenShelfDeskApp: App {
    @StateObject private var store = DeskStore()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(store)
        }
        .windowStyle(.automatic)
        .defaultSize(width: 1180, height: 780)
    }
}
