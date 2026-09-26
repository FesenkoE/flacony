<?php

namespace App\Http\Controllers;

use App\Models\ForumCategory;
use App\Models\ForumTopic;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class ForumController extends Controller
{
    public function index(): Response
    {
        $categories = ForumCategory::withCount('topics')->orderBy('name')->get();

        // ponytail: one query per section — there are a handful of them.
        $categories->each(fn (ForumCategory $category) => $category->setRelation(
            'lastTopic',
            $category->topics()->byActivity()->first(),
        ));

        return Inertia::render('forum/index', [
            'categories' => $categories,
            'recentTopics' => self::countAnswers(ForumTopic::byActivity()->limit(6)->get()),
        ]);
    }

    public function category(ForumCategory $category): Response
    {
        return Inertia::render('forum/category', [
            'category' => $category,
            'topics' => self::countAnswers($category->topics()->byActivity()->get()),
        ]);
    }

    // The opening message is stored as the first reply, so it isn't an answer.
    private static function countAnswers(Collection $topics): Collection
    {
        return $topics->each(fn (ForumTopic $topic) => $topic->replies_count--);
    }
}
