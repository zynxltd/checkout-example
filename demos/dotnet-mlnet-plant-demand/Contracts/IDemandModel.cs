namespace DotnetMlNetPlantDemand.Contracts;

public interface IDemandModel
{
    DemandPrediction Predict(DemandFeatures features);
    ModelInfo Info { get; }
}

public sealed record DemandFeatures(
    string Category,
    float UnitPrice,
    float SeasonMonth,
    float PromoBoost,
    float StockDays);

public sealed record DemandPrediction(
    bool HighDemand,
    float Probability,
    string Advice);

public sealed record ModelInfo(
    string Algorithm,
    int TrainingRows,
    float Accuracy,
    DateTimeOffset TrainedAt);
