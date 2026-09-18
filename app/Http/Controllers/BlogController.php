<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Inertia\Inertia;
use Inertia\Response;

class BlogController extends Controller
{
    private const CARD_COLUMNS = ['id', 'category_id', 'title', 'slug', 'excerpt', 'cover_path', 'cover_path_light', 'published_at'];

    public function index(): Response
    {
        return Inertia::render('blog/index', [
            'posts' => Post::published()
                ->with('category:id,name,slug')
                ->latest('published_at')
                ->get(self::CARD_COLUMNS),
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

        return Inertia::render('blog/show', [
            'post' => $post,
            'relatedPosts' => $relatedPosts->values(),
        ]);
    }
}
