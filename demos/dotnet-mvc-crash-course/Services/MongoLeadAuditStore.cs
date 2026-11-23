using DotnetMvcCrashCourse.Contracts;
using DotnetMvcCrashCourse.Models;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver;

namespace DotnetMvcCrashCourse.Services;

public sealed class AuditStoreOptions
{
    public const string SectionName = "AuditStore";

    /// <summary>memory (default) | mongo</summary>
    public string Driver { get; set; } = "memory";

    public string ConnectionString { get; set; } = "mongodb://127.0.0.1:27017";
    public string Database { get; set; } = "greenshelf";
    public string Collection { get; set; } = "lead_audit";
}

/// <summary>Real MongoDB append-only audit — same contract as InMemoryLeadAuditStore (DIP).</summary>
public sealed class MongoLeadAuditStore : ILeadAuditStore
{
    private readonly IMongoCollection<LeadAuditBson> _collection;

    public MongoLeadAuditStore(IOptions<AuditStoreOptions> options)
    {
        var cfg = options.Value;
        var client = new MongoClient(cfg.ConnectionString);
        var db = client.GetDatabase(cfg.Database);
        _collection = db.GetCollection<LeadAuditBson>(cfg.Collection);
        _collection.Indexes.CreateOne(
            new CreateIndexModel<LeadAuditBson>(
                Builders<LeadAuditBson>.IndexKeys.Ascending(x => x.LeadId).Ascending(x => x.At)));
    }

    public void Append(LeadAuditDocument document)
    {
        _collection.InsertOne(new LeadAuditBson
        {
            LeadId = document.LeadId,
            At = document.At.UtcDateTime,
            Status = document.Status.ToString(),
            Note = document.Note,
        });
    }

    public IReadOnlyList<LeadAuditDocument> ForLead(Guid leadId)
    {
        return _collection
            .Find(x => x.LeadId == leadId)
            .SortBy(x => x.At)
            .ToList()
            .Select(x => new LeadAuditDocument(
                x.LeadId,
                new DateTimeOffset(DateTime.SpecifyKind(x.At, DateTimeKind.Utc)),
                Enum.Parse<LeadStatus>(x.Status),
                x.Note))
            .ToList();
    }

    private sealed class LeadAuditBson
    {
        [BsonId]
        public ObjectId Id { get; set; }

        public Guid LeadId { get; set; }
        public DateTime At { get; set; }
        public string Status { get; set; } = "";
        public string Note { get; set; } = "";
    }
}
