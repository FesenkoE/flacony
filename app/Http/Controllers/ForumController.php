<?php

namespace App\Http\Controllers;

use App\Models\ForumCategory;
use Inertia\Inertia;
use Inertia\Response;

class ForumController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('forum/index', [
            'categories' => ForumCategory::withCount('topics')->orderBy('name')->get(),
        ]);
    }

    public function category(ForumCategory $category): Response
    {
        return Inertia::render('forum/category', [
            'category' => $category,
            'topics' => $category->topics()
                ->with('author:id,name')
                ->withCount('replies')
                // Forums bump a topic when someone answers, not when it was opened.
                ->withMax('replies', 'created_at')
                ->orderByDesc('replies_max_created_at')
                ->get()
                // The opening message is stored as the first reply.
                ->each(fn ($topic) => $topic->replies_count--),
        ]);
    }
}
