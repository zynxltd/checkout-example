var builder = DistributedApplication.CreateBuilder(args);

builder.AddProject<Projects.GardenClub_Web>("garden-club-web")
    .WithExternalHttpEndpoints();

builder.Build().Run();
