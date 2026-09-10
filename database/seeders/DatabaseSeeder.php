<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Category;
use App\Models\ForumCategory;
use App\Models\Lot;
use App\Models\Post;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $testUser = User::firstOrCreate(
            ['email' => 'test@example.com'],
            User::factory()->raw(['name' => 'Test User']),
        );

        $unisex = Category::firstOrCreate(['slug' => 'unisex'], ['name' => 'Унисекс']);

        $products = [
            ['brand' => 'Dior', 'name' => 'Sauvage', 'variants' => [[5, 450], [10, 850]]],
            ['brand' => 'Dior', 'name' => "J'adore", 'variants' => [[5, 480], [10, 900]]],
            ['brand' => 'Byredo', 'name' => 'Gypsy Water', 'variants' => [[5, 500], [10, 950]]],
            ['brand' => 'Byredo', 'name' => 'Mojave Ghost', 'variants' => [[5, 520], [10, 980]]],
            ['brand' => 'Le Labo', 'name' => 'Santal 33', 'variants' => [[5, 550], [10, 1050]]],
            ['brand' => 'Le Labo', 'name' => 'Rose 31', 'variants' => [[5, 560], [10, 1080]]],
            ['brand' => 'Diptyque', 'name' => 'Philosykos', 'variants' => [[5, 420], [10, 780]]],
            ['brand' => 'Diptyque', 'name' => 'Eau Rose', 'variants' => [[5, 430], [10, 800]]],
            ['brand' => 'Tom Ford', 'name' => 'Tobacco Vanille', 'variants' => [[5, 650], [10, 1250]]],
            ['brand' => 'Maison Margiela', 'name' => 'Jazz Club', 'variants' => [[5, 470], [10, 890]]],
        ];

        foreach ($products as $entry) {
            $brand = Brand::firstOrCreate(
                ['slug' => str($entry['brand'])->slug()],
                ['name' => $entry['brand']],
            );

            $product = Product::firstOrCreate(
                ['slug' => str($entry['name'])->slug()],
                [
                    'brand_id' => $brand->id,
                    'category_id' => $unisex->id,
                    'name' => $entry['name'],
                ],
            );

            foreach ($entry['variants'] as [$volumeMl, $price]) {
                $product->variants()->firstOrCreate(
                    ['volume_ml' => $volumeMl],
                    ['price' => $price],
                );
            }
        }

        $lots = [
            [
                'brand_name' => 'Xerjoff',
                'product_name' => 'Naxos',
                'total_volume_ml' => 100,
                'remaining_volume_ml' => 87,
                'price_per_ml' => 25,
                'bulk_threshold_ml' => null,
                'bulk_price_per_ml' => null,
            ],
            [
                'brand_name' => 'Amouage',
                'product_name' => 'Interlude Man',
                'total_volume_ml' => 50,
                'remaining_volume_ml' => 32,
                'price_per_ml' => 30,
                'bulk_threshold_ml' => 5,
                'bulk_price_per_ml' => 24,
            ],
            [
                'brand_name' => 'Parfums de Marly',
                'product_name' => 'Layton',
                'total_volume_ml' => 125,
                'remaining_volume_ml' => 13,
                'price_per_ml' => 22,
                'bulk_threshold_ml' => 10,
                'bulk_price_per_ml' => 18,
            ],
        ];

        foreach ($lots as $lot) {
            Lot::firstOrCreate(
                ['user_id' => $testUser->id, 'product_name' => $lot['product_name']],
                [...$lot, 'user_id' => $testUser->id],
            );
        }

        $posts = [
            [
                'title' => 'Parfum, EDP, EDT, EDC: в чём разница',
                'excerpt' => 'На флаконе часто пишут аббревиатуру, которая почти ничего не говорит новичку. Разбираемся, что она значит и как влияет на стойкость и цену.',
                'body' => "Разница между Parfum, Eau de Parfum, Eau de Toilette и Eau de Cologne — это концентрация парфюмерного масла в спиртовой основе. Чем её больше, тем сильнее и дольше держится аромат, и тем выше обычно цена за миллилитр.\n\nParfum (Extrait de Parfum) — самая высокая концентрация, обычно 20–40%. Держится на коже 8 часов и дольше, распыляется экономно: пары капель хватает надолго.\n\nEau de Parfum (EDP) — 15–20% масла. Самый популярный формат для нишевой и премиум-парфюмерии, баланс стойкости и цены.\n\nEau de Toilette (EDT) — 5–15%. Легче, более \"дневной\" формат, часто выбирают для летних ароматов.\n\nEau de Cologne (EDC) — 2–4%, самая лёгкая и недорогая концентрация, держится 2–3 часа.\n\nПоэтому один и тот же аромат в версии EDT и EDP может ощущаться и держаться по-разному — это не просто маркетинг, а реальная разница в составе.",
                'published_days_ago' => 6,
            ],
            [
                'title' => 'Как правильно хранить парфюм',
                'excerpt' => 'Свет, тепло и перепады температуры — главные враги аромата. Несколько простых правил, чтобы флакон не потерял характер раньше времени.',
                'body' => "Парфюмерное масло окисляется под воздействием света, тепла и кислорода — от этого аромат \"плывёт\", меняет оттенок или становится резче.\n\nХраните флаконы в тёмном месте — ванная с прямым солнцем или подоконник не подходят, несмотря на то что там обычно и стоит парфюм. Лучше закрытый шкаф или коробка.\n\nИзбегайте перепадов температуры: не держите флакон у батареи и не забывайте его в машине летом. Резкие скачки температуры ускоряют разложение молекул аромата.\n\nЗакрывайте флакон сразу после использования — постоянный контакт с воздухом окисляет масло быстрее, чем кажется.\n\nПри соблюдении этих условий большинство ароматов сохраняют характер 3–5 лет, а некоторые — и дольше.",
                'published_days_ago' => 3,
            ],
            [
                'title' => 'Что такое распив и почему с него стоит начинать',
                'excerpt' => 'Полный флакон нишевого аромата может стоить как хороший ужин в ресторане. Разлив по 5–10 мл — способ попробовать больше, не переплачивая.',
                'body' => "Распив — это когда владелец флакона делится небольшим количеством аромата с другими, а не продаёт весь флакон целиком. Для покупателя это способ попробовать дорогой нишевый аромат за небольшую цену, прежде чем решиться на полный флакон.\n\nЭто особенно важно для нишевой парфюмерии, которую почти невозможно понюхать в обычном магазине — офлайн-точек с полным ассортиментом просто не существует в большинстве городов. Распив закрывает именно эту проблему.\n\nНа Flacony это устроено так: продавец выставляет флакон с указанием остатка, покупатель выбирает нужный объём — хоть 2 мл, хоть 20 — и получает именно то количество, которое хочет попробовать.\n\nЭто не про \"экономию ради экономии\" — это про возможность собрать собственную парфюмерную библиотеку из ароматов, которые иначе так и остались бы неизвестными.",
                'published_days_ago' => 1,
            ],
        ];

        foreach ($posts as $post) {
            Post::firstOrCreate(
                ['slug' => str($post['title'])->slug()],
                [
                    'author_id' => $testUser->id,
                    'title' => $post['title'],
                    'excerpt' => $post['excerpt'],
                    'body' => $post['body'],
                    'published_at' => now()->subDays($post['published_days_ago']),
                ],
            );
        }

        $categories = [
            ['name' => 'Общие обсуждения', 'description' => 'Всё, что не подошло под другие разделы'],
            ['name' => 'Вопросы новичков', 'description' => 'Только начинаешь разбираться в парфюмерии — сюда'],
            ['name' => 'Отзывы о продавцах', 'description' => 'Делимся опытом покупок на витринах'],
        ];

        $forumCategories = [];
        foreach ($categories as $entry) {
            $forumCategories[] = ForumCategory::firstOrCreate(
                ['slug' => str($entry['name'])->slug()],
                $entry,
            );
        }

        $topic = $forumCategories[1]->topics()->firstOrCreate(
            ['title' => 'С чего начать, если раньше пользовался только масс-маркетом?'],
            [
                'user_id' => $testUser->id,
                'slug' => str('С чего начать, если раньше пользовался только масс-маркетом')->slug().'-'.str()->random(6),
            ],
        );

        $topic->replies()->firstOrCreate(
            ['user_id' => $testUser->id],
            ['body' => 'Начни с распива — возьми 2-3 мл разных ароматов из разных семейств (древесные, цитрусовые, амбровые), чтобы понять, что вообще нравится, прежде чем брать полный флакон.'],
        );
    }
}
