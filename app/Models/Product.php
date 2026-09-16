<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Scout\Searchable;

class Product extends Model
{
    use Searchable;

    protected $fillable = [
        'brand_id',
        'category_id',
        'name',
        'slug',
        'description',
        'is_active',
        'image_path',
        'image_path_light',
        'perfumer',
        'release_year',
        'concentration',
        'top_notes',
        'heart_notes',
        'base_notes',
        'accords',
        'longevity',
        'sillage',
    ];

    protected function casts(): array
    {
        return [
            'top_notes' => 'array',
            'heart_notes' => 'array',
            'base_notes' => 'array',
            'accords' => 'array',
        ];
    }

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class)->orderBy('volume_ml');
    }

    public function favorites(): HasMany
    {
        return $this->hasMany(Favorite::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function toSearchableArray(): array
    {
        return [
            'name' => $this->name,
            'brand' => $this->brand->name,
            'category' => $this->category->name,
            'description' => $this->description,
            'perfumer' => $this->perfumer,
            'notes' => implode(' ', [
                ...($this->top_notes ?? []),
                ...($this->heart_notes ?? []),
                ...($this->base_notes ?? []),
            ]),
            'is_active' => $this->is_active,
        ];
    }

    public function shouldBeSearchable(): bool
    {
        return $this->is_active;
    }
}
