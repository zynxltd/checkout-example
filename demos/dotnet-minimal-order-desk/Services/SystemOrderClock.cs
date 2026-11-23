using DotnetMinimalOrderDesk.Contracts;

namespace DotnetMinimalOrderDesk.Services;

public sealed class SystemOrderClock : IOrderClock
{
    public DateTimeOffset UtcNow => DateTimeOffset.UtcNow;
}
