<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Laravel\Scout\Searchable;

class Post extends Model
{
    use Searchable;

    protected $fillable = [
        'author_id',
        'category_id',
        'title',
        'title_uk',
        'slug',
        'excerpt',
        'excerpt_uk',
        'body',
        'body_uk',
        'cover_path',
        'cover_path_light',
        'published_at',
    ];

    protected function casts(): array
    {
        return [
            'published_at' => 'datetime',
        ];
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(PostCategory::class, 'category_id');
    }

    public function scopePublished(Builder $query): void
    {
        $query->whereNotNull('published_at')->where('published_at', '<=', now());
    }

    public function toSearchableArray(): array
    {
        return [
            'title' => $this->title,
            'title_uk' => $this->title_uk,
            'excerpt' => $this->excerpt,
            'excerpt_uk' => $this->excerpt_uk,
            'body' => $this->body,
            'body_uk' => $this->body_uk,
            'category' => $this->category?->name,
        ];
    }

    public function shouldBeSearchable(): bool
    {
        return $this->published_at && $this->published_at->isPast();
    }
}
