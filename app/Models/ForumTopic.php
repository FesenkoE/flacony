<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class ForumTopic extends Model
{
    protected $fillable = ['forum_category_id', 'user_id', 'title', 'slug'];

    public function category(): BelongsTo
    {
        return $this->belongsTo(ForumCategory::class, 'forum_category_id');
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function replies(): HasMany
    {
        return $this->hasMany(ForumReply::class);
    }

    public function latestReply(): HasOne
    {
        return $this->hasOne(ForumReply::class)->latestOfMany(['created_at', 'id']);
    }

    // Forums bump a topic when someone answers, not when it was opened.
    public function scopeByActivity(Builder $query): void
    {
        $query->with(['category:id,name,slug', 'author:id,name', 'latestReply.author:id,name'])
            ->withCount('replies')
            ->withMax('replies', 'created_at')
            ->orderByDesc('replies_max_created_at');
    }
}
