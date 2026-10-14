<?php

namespace App\Http\Requests;

use App\Support\PlantFinderCatalog;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class FilterPlantsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        foreach (['planting_time', 'flowering_time', 'fruiting_time', 'category', 'sort'] as $field) {
            if ($this->input($field) === '') {
                $this->merge([$field => null]);
            }
        }
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'features' => ['sometimes', 'array'],
            'features.*' => ['string', Rule::in(array_keys(PlantFinderCatalog::features()))],
            'planting_time' => ['sometimes', 'nullable', 'string', Rule::in(array_keys(PlantFinderCatalog::plantingTimes()))],
            'flowering_time' => ['sometimes', 'nullable', 'string', Rule::in(array_keys(PlantFinderCatalog::floweringTimes()))],
            'fruiting_time' => ['sometimes', 'nullable', 'string', Rule::in(array_keys(PlantFinderCatalog::fruitingTimes()))],
            'category' => ['sometimes', 'nullable', 'string', Rule::in(array_keys(PlantFinderCatalog::categories()))],
            'sort' => ['sometimes', 'nullable', 'string', Rule::in(array_keys(PlantFinderCatalog::sorts()))],
        ];
    }

    /**
     * @return array{
     *     features: list<string>,
     *     planting_time: ?string,
     *     flowering_time: ?string,
     *     fruiting_time: ?string,
     *     category: ?string,
     *     sort: string
     * }
     */
    public function filters(): array
    {
        $validated = $this->validated();

        return [
            'features' => array_values($validated['features'] ?? []),
            'planting_time' => $validated['planting_time'] ?? null,
            'flowering_time' => $validated['flowering_time'] ?? null,
            'fruiting_time' => $validated['fruiting_time'] ?? null,
            'category' => $validated['category'] ?? null,
            'sort' => $validated['sort'] ?? PlantFinderCatalog::defaultSort(),
        ];
    }

    public function hasActiveFilters(): bool
    {
        $filters = $this->filters();

        if ($filters['features'] !== []) {
            return true;
        }

        foreach (['planting_time', 'flowering_time', 'fruiting_time', 'category'] as $field) {
            if (filled($filters[$field])) {
                return true;
            }
        }

        return false;
    }

    /**
     * @return list<array{label: string, url: string}>
     */
    public function activeChips(): array
    {
        $filters = $this->filters();
        $chips = [];

        foreach ($filters['features'] as $value) {
            $chips[] = [
                'label' => PlantFinderCatalog::optionLabel('features', $value),
                'url' => $this->urlWithout('features', $value),
            ];
        }

        foreach (['planting_time', 'flowering_time', 'fruiting_time', 'category'] as $field) {
            if (filled($filters[$field])) {
                $chips[] = [
                    'label' => PlantFinderCatalog::optionLabel($field, $filters[$field]),
                    'url' => $this->urlWithout($field),
                ];
            }
        }

        return $chips;
    }

    public function urlWithout(string $key, ?string $value = null): string
    {
        $query = $this->filters();

        if ($value === null) {
            $query[$key] = is_array($query[$key] ?? null) ? [] : null;
        } else {
            $query[$key] = array_values(array_filter(
                $query[$key],
                fn (string $item): bool => $item !== $value
            ));
        }

        if (($query['sort'] ?? null) === PlantFinderCatalog::defaultSort()) {
            unset($query['sort']);
        }

        $query = array_filter(
            $query,
            fn (mixed $item): bool => $item !== [] && $item !== null && $item !== ''
        );

        return route('demo.plant-finder', $query);
    }
}
