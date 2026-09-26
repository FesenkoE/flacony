<?php

namespace Tests\Feature;

use App\Filament\Resources\ForumTopics\Pages\ViewForumTopic;
use App\Filament\Resources\ForumTopics\RelationManagers\RepliesRelationManager;
use App\Models\ForumCategory;
use App\Models\ForumReply;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use Tests\TestCase;

class ForumTest extends TestCase
{
    use RefreshDatabase;

    public function test_category_lists_topics_by_last_activity_without_counting_the_opening_message()
    {
        $user = User::factory()->create();
        $category = ForumCategory::create(['name' => 'Общие', 'slug' => 'general']);

        foreach (['Старая тема', 'Новая тема'] as $title) {
            $this->actingAs($user)->post("/forum/{$category->slug}/topics", ['title' => $title, 'body' => 'Текст']);
            $this->travel(1)->minutes();
        }

        $old = $category->topics()->where('title', 'Старая тема')->sole();
        $this->post("/forum/topics/{$old->id}/replies", ['body' => 'Ответ']);

        $this->get("/forum/{$category->slug}")->assertInertia(fn ($page) => $page
            ->where('topics.0.title', 'Старая тема')   // bumped by the fresh answer
            ->where('topics.0.replies_count', 1)
            ->where('topics.1.replies_count', 0));
    }

    public function test_admin_can_delete_a_reply_but_not_the_opening_message()
    {
        $user = User::factory()->create();
        $category = ForumCategory::create(['name' => 'Общие', 'slug' => 'general']);
        $this->actingAs($user)->post("/forum/{$category->slug}/topics", ['title' => 'Тема', 'body' => 'Вопрос']);
        $topic = $category->topics()->sole();
        $this->travel(1)->minutes();
        $this->post("/forum/topics/{$topic->id}/replies", ['body' => 'Спам']);
        [$opening, $spam] = $topic->replies()->oldest()->get();

        $this->actingAs(User::factory()->create(['is_admin' => true]));
        $this->get('/admin/forum-topics')->assertOk()->assertSee('Тема');
        $this->get("/admin/forum-topics/{$topic->id}")->assertOk();

        Livewire::test(RepliesRelationManager::class, ['ownerRecord' => $topic, 'pageClass' => ViewForumTopic::class])
            ->assertTableActionHidden('delete', $opening)
            ->callTableAction('delete', $spam);

        $this->assertModelMissing($spam);
        $this->assertModelExists($opening);
    }
}
