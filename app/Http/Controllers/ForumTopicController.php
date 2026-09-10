<?php

namespace App\Http\Controllers;

use App\Models\ForumCategory;
use App\Models\ForumTopic;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ForumTopicController extends Controller
{
    public function show(ForumTopic $topic): Response
    {
        $topic->load(['category', 'author:id,name']);

        return Inertia::render('forum/topic', [
            'topic' => $topic,
            'replies' => $topic->replies()->with('author:id,name')->oldest()->get(),
        ]);
    }

    public function create(ForumCategory $category): Response
    {
        return Inertia::render('forum/create', [
            'category' => $category,
        ]);
    }

    public function store(Request $request, ForumCategory $category): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string', 'max:10000'],
        ]);

        $topic = DB::transaction(function () use ($validated, $category, $request) {
            $topic = $category->topics()->create([
                'user_id' => $request->user()->id,
                'title' => $validated['title'],
                'slug' => str($validated['title'])->slug().'-'.str()->random(6),
            ]);

            $topic->replies()->create([
                'user_id' => $request->user()->id,
                'body' => $validated['body'],
            ]);

            return $topic;
        });

        return to_route('forum.topics.show', $topic);
    }
}
