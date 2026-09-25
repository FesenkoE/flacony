<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\PostCategory;
use App\Models\PromoCode;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BlogController extends Controller
{
    private const CARD_COLUMNS = ['id', 'category_id', 'title', 'title_uk', 'slug', 'excerpt', 'excerpt_uk', 'cover_path', 'cover_path_light', 'published_at'];

    public function index(Request $request): Response
    {
        $categorySlug = $request->string('category')->toString() ?: null;

        return Inertia::render('blog/index', [
            'posts' => Post::published()
                ->with('category:id,name,slug')
                ->when($categorySlug, fn ($query) => $query->whereRelation('category', 'slug', $categorySlug))
                ->latest('published_at')
                ->get(self::CARD_COLUMNS),
            'categories' => PostCategory::orderBy('name')->get(['id', 'name', 'slug']),
            'activeCategory' => $categorySlug,
        ]);
    }

    public function show(Post $post): Response
    {
        abort_unless($post->published_at && $post->published_at->isPast(), 404);

        $post->load('author:id,name', 'category:id,name,slug');

        $sameCategory = Post::published()
            ->with('category:id,name,slug')
            ->where('id', '!=', $post->id)
            ->when($post->category_id, fn ($query) => $query->where('category_id', $post->category_id))
            ->latest('published_at')
            ->limit(3)
            ->get(self::CARD_COLUMNS);

        $relatedPosts = $sameCategory->count() < 3
            ? $sameCategory->concat(
                Post::published()
                    ->with('category:id,name,slug')
                    ->where('id', '!=', $post->id)
                    ->whereNotIn('id', $sameCategory->pluck('id'))
                    ->latest('published_at')
                    ->limit(3 - $sameCategory->count())
                    ->get(self::CARD_COLUMNS),
            )
            : $sameCategory;

        $prevPost = Post::published()
            ->where('published_at', '<', $post->published_at)
            ->latest('published_at')
            ->first(['title', 'title_uk', 'slug']);

        $nextPost = Post::published()
            ->where('published_at', '>', $post->published_at)
            ->oldest('published_at')
            ->first(['title', 'title_uk', 'slug']);

        return Inertia::render('blog/show', [
            'post' => $post,
            'relatedPosts' => $relatedPosts->values(),
            'prevPost' => $prevPost,
            'nextPost' => $nextPost,
            'promoCode' => PromoCode::where('active', true)->first(['code', 'type', 'value']),
        ]);
    }
}
