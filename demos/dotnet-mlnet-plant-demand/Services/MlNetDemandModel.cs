using DotnetMlNetPlantDemand.Contracts;
using Microsoft.ML;
using Microsoft.ML.Data;

namespace DotnetMlNetPlantDemand.Services;

/// <summary>ML.NET trainer + scorer. Swap for an Azure ML HTTP client behind IDemandModel (DIP).</summary>
public sealed class MlNetDemandModel : IDemandModel
{
    private readonly PredictionEngine<PlantRow, PlantScore> _engine;
    private readonly ModelInfo _info;

    public MlNetDemandModel()
    {
        var ml = new MLContext(seed: 42);
        var rows = GenerateRows(480);
        var data = ml.Data.LoadFromEnumerable(rows);

        var pipeline = ml.Transforms.Categorical.OneHotEncoding("CategoryEncoded", nameof(PlantRow.Category))
            .Append(ml.Transforms.Concatenate(
                "Features",
                "CategoryEncoded",
                nameof(PlantRow.UnitPrice),
                nameof(PlantRow.SeasonMonth),
                nameof(PlantRow.PromoBoost),
                nameof(PlantRow.StockDays)))
            .Append(ml.BinaryClassification.Trainers.SdcaLogisticRegression(
                labelColumnName: nameof(PlantRow.HighDemand),
                featureColumnName: "Features"));

        var split = ml.Data.TrainTestSplit(data, testFraction: 0.2);
        var model = pipeline.Fit(split.TrainSet);
        var metrics = ml.BinaryClassification.Evaluate(
            model.Transform(split.TestSet),
            labelColumnName: nameof(PlantRow.HighDemand));

        _engine = ml.Model.CreatePredictionEngine<PlantRow, PlantScore>(model);
        _info = new ModelInfo(
            "SdcaLogisticRegression",
            rows.Count,
            (float)metrics.Accuracy,
            DateTimeOffset.UtcNow);
    }

    public ModelInfo Info => _info;

    public DemandPrediction Predict(DemandFeatures features)
    {
        var score = _engine.Predict(new PlantRow
        {
            Category = features.Category.Trim().ToLowerInvariant(),
            UnitPrice = features.UnitPrice,
            SeasonMonth = features.SeasonMonth,
            PromoBoost = features.PromoBoost,
            StockDays = features.StockDays,
        });

        var advice = score.PredictedLabel
            ? "Expect strong pickup — keep stock topped up and feature on homepage."
            : "Soft demand window — prefer promo or delay restock.";

        return new DemandPrediction(score.PredictedLabel, score.Probability, advice);
    }

    private static List<PlantRow> GenerateRows(int n)
    {
        var rng = new Random(42);
        var categories = new[] { "plants", "wildlife", "soil", "tools" };
        var list = new List<PlantRow>(n);

        for (var i = 0; i < n; i++)
        {
            var category = categories[rng.Next(categories.Length)];
            var month = rng.Next(1, 13);
            var price = (float)(5 + rng.NextDouble() * 70);
            var promo = rng.NextDouble() < 0.35 ? 1f : 0f;
            var stockDays = (float)rng.Next(2, 40);

            // Label heuristic the model learns: spring plants + promo + mid price → high demand
            var spring = month is >= 3 and <= 6;
            var plantBoost = category == "plants" && spring ? 1 : 0;
            var score =
                plantBoost * 1.4
                + promo * 0.9
                + (price is >= 12 and <= 40 ? 0.6 : -0.2)
                + (stockDays < 10 ? 0.3 : -0.1)
                + rng.NextDouble() * 0.35;

            list.Add(new PlantRow
            {
                Category = category,
                UnitPrice = price,
                SeasonMonth = month,
                PromoBoost = promo,
                StockDays = stockDays,
                HighDemand = score > 1.1,
            });
        }

        return list;
    }

    public sealed class PlantRow
    {
        public string Category { get; set; } = "";
        public float UnitPrice { get; set; }
        public float SeasonMonth { get; set; }
        public float PromoBoost { get; set; }
        public float StockDays { get; set; }
        public bool HighDemand { get; set; }
    }

    private sealed class PlantScore
    {
        [ColumnName("PredictedLabel")]
        public bool PredictedLabel { get; set; }

        public float Probability { get; set; }
    }
}
