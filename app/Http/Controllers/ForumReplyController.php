<?php

namespace App\Http\Controllers;

use App\Models\ForumTopic;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ForumReplyController extends Controller
{
    public function store(Request $request, ForumTopic $topic): RedirectResponse
    {
        $validated = $request->validate([
            'body' => ['required', 'string', 'max:10000'],
        ]);

        $topic->replies()->create([
            'user_id' => $request->user()->id,
            'body' => $validated['body'],
        ]);

        return to_route('forum.topics.show', $topic);
    }
}
