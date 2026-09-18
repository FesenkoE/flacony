<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Inertia\Inertia;
use Inertia\Response;

class BlogController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('blog/index', [
            'posts' => Post::published()
                ->latest('published_at')
                ->get(['id', 'title', 'slug', 'excerpt', 'cover_path', 'cover_path_light', 'published_at']),
        ]);
    }

    public function show(Post $post): Response
    {
        abort_unless($post->published_at && $post->published_at->isPast(), 404);

        $post->load('author:id,name');

        return Inertia::render('blog/show', [
            'post' => $post,
            'relatedPosts' => Post::published()
                ->where('id', '!=', $post->id)
                ->latest('published_at')
                ->limit(3)
                ->get(['id', 'title', 'slug', 'excerpt', 'cover_path', 'cover_path_light', 'published_at']),
        ]);
    }
}
