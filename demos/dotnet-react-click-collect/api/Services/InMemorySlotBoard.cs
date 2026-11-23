using System.Collections.Concurrent;
using DotnetReactClickCollect.Api.Contracts;
using DotnetReactClickCollect.Api.Models;

namespace DotnetReactClickCollect.Api.Services;

public sealed class InMemorySlotBoard : ISlotBoard
{
    private readonly ConcurrentDictionary<string, SlotEntity> _slots = new(StringComparer.OrdinalIgnoreCase);

    public InMemorySlotBoard(IPickupClock clock)
    {
        var today = DateOnly.FromDateTime(clock.UtcNow.UtcDateTime);
        SeedDay(today, 0);
        SeedDay(today.AddDays(1), 1);
        SeedDay(today.AddDays(2), 2);
    }

    public IReadOnlyList<PickupSlot> Available(DateTimeOffset now)
    {
        var today = DateOnly.FromDateTime(now.UtcDateTime);
        var time = TimeOnly.FromDateTime(now.UtcDateTime);
        return _slots.Values
            .Select(s => s.ToSlot())
            .Where(s => s.Day > today || (s.Day == today && s.StartsAt > time))
            .Where(s => s.Booked < s.Capacity)
            .OrderBy(s => s.Day)
            .ThenBy(s => s.StartsAt)
            .ToList();
    }

    public PickupSlot? Find(string slotId) =>
        _slots.TryGetValue(slotId, out var s) ? s.ToSlot() : null;

    public bool TryBook(string slotId, out string? error)
    {
        error = null;
        if (!_slots.TryGetValue(slotId, out var slot))
        {
            error = "Unknown pickup slot";
            return false;
        }

        lock (slot.Gate)
        {
            if (slot.Booked >= slot.Capacity)
            {
                error = "Slot is full";
                return false;
            }

            slot.Booked++;
            return true;
        }
    }

    public void Release(string slotId)
    {
        if (!_slots.TryGetValue(slotId, out var slot)) return;
        lock (slot.Gate)
        {
            if (slot.Booked > 0) slot.Booked--;
        }
    }

    private void SeedDay(DateOnly day, int offset)
    {
        Add($"S{offset}-AM", day, "09:00–11:00", new TimeOnly(9, 0), 4);
        Add($"S{offset}-MD", day, "12:00–14:00", new TimeOnly(12, 0), 6);
        Add($"S{offset}-PM", day, "15:00–17:00", new TimeOnly(15, 0), 5);
    }

    private void Add(string id, DateOnly day, string label, TimeOnly starts, int capacity) =>
        _slots[id] = new SlotEntity(id, day, label, starts, capacity);

    private sealed class SlotEntity(string id, DateOnly day, string windowLabel, TimeOnly startsAt, int capacity)
    {
        public string Id { get; } = id;
        public DateOnly Day { get; } = day;
        public string WindowLabel { get; } = windowLabel;
        public TimeOnly StartsAt { get; } = startsAt;
        public int Capacity { get; } = capacity;
        public int Booked { get; set; }
        public object Gate { get; } = new();

        public PickupSlot ToSlot() => new(Id, Day, WindowLabel, StartsAt, Capacity, Booked);
    }
}
