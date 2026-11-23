using DotnetReactClickCollect.Api.Contracts;

namespace DotnetReactClickCollect.Api.Services;

public sealed class SystemPickupClock : IPickupClock
{
    public DateTimeOffset UtcNow => DateTimeOffset.UtcNow;
}
