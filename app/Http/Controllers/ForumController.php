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
                ->latest()
                ->get(),
        ]);
    }
}
