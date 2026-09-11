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
        $testUser = User::firstOrCreate(
            ['email' => 'test@example.com'],
            User::factory()->raw(['name' => 'Test User', 'email' => 'test@example.com']),
        );
        $testUser->update(['is_admin' => true]);

        $categories = [
            'unisex' => Category::firstOrCreate(['slug' => 'unisex'], ['name' => 'Унисекс']),
            'male' => Category::firstOrCreate(['slug' => 'male'], ['name' => 'Мужской']),
            'female' => Category::firstOrCreate(['slug' => 'female'], ['name' => 'Женский']),
            'niche' => Category::firstOrCreate(['slug' => 'niche'], ['name' => 'Нишевый']),
        ];

        $products = [
            ['brand' => 'Dior', 'name' => 'Sauvage', 'category' => 'male', 'variants' => [[5, 450], [10, 850]], 'description' => 'Свежий и минералистичный аромат с бергамотом на старте и амброксаном в базе — узнаваемая «синяя» классика, которая одинаково уместна утром на работе и вечером в баре.'],
            ['brand' => 'Dior', 'name' => "J'adore", 'category' => 'female', 'variants' => [[5, 480], [10, 900]], 'description' => 'Роскошный цветочный букет из иланг-иланга, розы и жасмина на золотистой базе — воплощение классической женственности от Dior.'],
            ['brand' => 'Dior', 'name' => 'Homme Intense', 'category' => 'male', 'variants' => [[5, 470], [10, 890]], 'description' => 'Пудрово-ирисовый аромат с какао и ветивером в базе — элегантный, тёплый, без агрессивной сладости.'],
            ['brand' => 'Byredo', 'name' => 'Gypsy Water', 'category' => 'unisex', 'variants' => [[5, 500], [10, 950]], 'description' => 'Древесно-цитрусовый унисекс-аромат с ладаном и ванилью — свободный, кочевой характер без привязки к сезону.'],
            ['brand' => 'Byredo', 'name' => 'Mojave Ghost', 'category' => 'unisex', 'variants' => [[5, 520], [10, 980]], 'description' => 'Лёгкий и прозрачный мускусно-цветочный аромат, вдохновлённый пустынным растением гуайюла — воздушный, почти невесомый.'],
            ['brand' => 'Byredo', 'name' => "Bal d'Afrique", 'category' => 'unisex', 'variants' => [[5, 510], [10, 960]], 'description' => 'Цитрусово-древесная композиция с ноткой африканской марии — тёплая, солнечная, слегка ностальгическая.'],
            ['brand' => 'Le Labo', 'name' => 'Santal 33', 'category' => 'niche', 'variants' => [[2, 250], [5, 550], [10, 1050]], 'description' => 'Культовый сандалово-кожаный аромат с нотами кардамона и кедра — один из самых узнаваемых нишевых запахов последнего десятилетия.'],
            ['brand' => 'Le Labo', 'name' => 'Rose 31', 'category' => 'niche', 'variants' => [[2, 260], [5, 560], [10, 1080]], 'description' => 'Неожиданная «мужская» роза — цветок сплетён с кумином, кедром и амброй, без единой пудровой ноты.'],
            ['brand' => 'Le Labo', 'name' => 'Another 13', 'category' => 'niche', 'variants' => [[2, 270], [5, 580], [10, 1100]], 'description' => 'Чистый, почти абстрактный мускусно-амбровый аромат с нотой озона — так называемый «запах бумаги», уникальный и минималистичный.'],
            ['brand' => 'Diptyque', 'name' => 'Philosykos', 'category' => 'unisex', 'variants' => [[5, 420], [10, 780]], 'description' => 'Зелёный инжирный аромат — сочная листва, млечный сок и древесина инжирного дерева целиком, без слащавости.'],
            ['brand' => 'Diptyque', 'name' => 'Eau Rose', 'category' => 'female', 'variants' => [[5, 430], [10, 800]], 'description' => 'Прозрачная, свежая роза с оттенком личи и лёгкой пудровой базой — деликатная и не приторная.'],
            ['brand' => 'Diptyque', 'name' => 'Tam Dao', 'category' => 'unisex', 'variants' => [[5, 440], [10, 820]], 'description' => 'Обволакивающий сандалово-кедровый аромат, вдохновлённый вьетнамскими храмами — тёплый, спокойный, медитативный.'],
            ['brand' => 'Tom Ford', 'name' => 'Tobacco Vanille', 'category' => 'niche', 'variants' => [[2, 300], [5, 650], [10, 1250]], 'description' => 'Насыщенный табачно-ванильный аромат с пряностями и сухофруктами — тёплый, как старое кожаное кресло у камина.'],
            ['brand' => 'Tom Ford', 'name' => 'Oud Wood', 'category' => 'niche', 'variants' => [[2, 310], [5, 670], [10, 1290]], 'description' => 'Мягкий, «дизайнерский» уд без резкости — сандал, палисандр и специи создают тёплую древесную базу.'],
            ['brand' => 'Maison Margiela', 'name' => 'Jazz Club', 'category' => 'male', 'variants' => [[5, 470], [10, 890]], 'description' => 'Ром, табак и ванильный тонка — уютный аромат прокуренного джаз-клуба из серии Replica.'],
            ['brand' => 'Maison Margiela', 'name' => 'By the Fireplace', 'category' => 'unisex', 'variants' => [[5, 460], [10, 870]], 'description' => 'Дымный аромат горящих поленьев с каштаном и ванилью — запах зимнего вечера у камина из линейки Replica.'],
            ['brand' => 'Xerjoff', 'name' => 'Naxos', 'category' => 'male', 'variants' => [[2, 320], [5, 700], [10, 1350]], 'description' => 'Мёд, табак и лаванда в плотной, почти гурманской композиции — один из самых узнаваемых ароматов Xerjoff.'],
            ['brand' => 'Amouage', 'name' => 'Interlude Man', 'category' => 'male', 'variants' => [[2, 330], [5, 720], [10, 1400]], 'description' => 'Дымный, смолистый и очень плотный аромат с ладаном и специями — не для тихого выхода, требует уверенности.'],
            ['brand' => 'Amouage', 'name' => 'Reflection Woman', 'category' => 'female', 'variants' => [[2, 330], [5, 710], [10, 1380]], 'description' => 'Элегантный цветочно-древесный аромат с ирисом и ветивером — сдержанная роскошь без излишней сладости.'],
            ['brand' => 'Parfums de Marly', 'name' => 'Layton', 'category' => 'male', 'variants' => [[2, 280], [5, 600], [10, 1150]], 'description' => 'Яблоко, лаванда и ваниль в тёплой, притягательной композиции — один из самых обсуждаемых мужских ароматов последних лет.'],
            ['brand' => 'Parfums de Marly', 'name' => 'Delina', 'category' => 'female', 'variants' => [[2, 280], [5, 610], [10, 1180]], 'description' => 'Пудрово-фруктовый аромат с личи и пионом на базе амбры — воздушный и очень женственный.'],
            ['brand' => 'Creed', 'name' => 'Aventus', 'category' => 'male', 'variants' => [[2, 340], [5, 750], [10, 1450]], 'description' => 'Фруктово-дымная композиция с ананасом, берёзовым дёгтем и мускусом — эталон «успешного» мужского аромата.'],
            ['brand' => 'Creed', 'name' => 'Green Irish Tweed', 'category' => 'male', 'variants' => [[2, 330], [5, 730], [10, 1420]], 'description' => 'Свежий фиалково-древесный аромат с ирисом и сандалом — классика в жанре «чистой» мужской парфюмерии.'],
        ];

        // ponytail: longevity/sillage are set editorially (like Fragrantica's crowd
        // average), not voted — real per-user voting needs a big enough review base
        // to mean anything, which we don't have yet.
        $fragranceDetails = [
            'dior-sauvage' => ['perfumer' => 'François Demachy', 'release_year' => 2015, 'concentration' => 'EDT', 'top_notes' => ['Бергамот', 'Перец'], 'heart_notes' => ['Сычуаньский перец', 'Лаванда', 'Розовый перец', 'Ветивер', 'Пачули', 'Герань', 'Элеми'], 'base_notes' => ['Амброксан', 'Кедр', 'Лабданум'], 'accords' => [['name' => 'Свежий пряный', 'percent' => 100], ['name' => 'Цитрусовый', 'percent' => 62], ['name' => 'Ароматный', 'percent' => 55], ['name' => 'Амбровый', 'percent' => 48]], 'longevity' => 'long_lasting', 'sillage' => 'moderate'],
            'dior-jadore' => ['perfumer' => 'Calice Becker', 'release_year' => 1999, 'concentration' => 'EDP', 'top_notes' => ['Груша', 'Дыня', 'Магнолия', 'Персик', 'Мандарин'], 'heart_notes' => ['Жасмин', 'Орхидея', 'Слива', 'Фрезия', 'Ландыш', 'Роза', 'Тубероза'], 'base_notes' => ['Ежевика', 'Мускус'], 'accords' => [['name' => 'Цветочный', 'percent' => 100], ['name' => 'Белый цветочный', 'percent' => 62], ['name' => 'Фруктовый', 'percent' => 48], ['name' => 'Сладкий', 'percent' => 40]], 'longevity' => 'long_lasting', 'sillage' => 'moderate'],
            'dior-homme-intense' => ['perfumer' => 'François Demachy', 'release_year' => 2011, 'concentration' => 'EDP', 'top_notes' => ['Лаванда'], 'heart_notes' => ['Ирис', 'Какао'], 'base_notes' => ['Ветивер', 'Амбретта', 'Груша'], 'accords' => [['name' => 'Пудровый', 'percent' => 100], ['name' => 'Ирисовый', 'percent' => 65], ['name' => 'Сладкий', 'percent' => 45], ['name' => 'Древесный', 'percent' => 40]], 'longevity' => 'long_lasting', 'sillage' => 'moderate'],
            'byredo-gypsy-water' => ['perfumer' => 'Jerome Epinette', 'release_year' => 2008, 'concentration' => 'EDP', 'top_notes' => ['Бергамот', 'Лимон', 'Перец', 'Можжевельник'], 'heart_notes' => ['Ладан', 'Хвоя', 'Ирис'], 'base_notes' => ['Амбра', 'Сандал', 'Ваниль'], 'accords' => [['name' => 'Древесный', 'percent' => 100], ['name' => 'Тёплый пряный', 'percent' => 60], ['name' => 'Цитрусовый', 'percent' => 52], ['name' => 'Амбровый', 'percent' => 45]], 'longevity' => 'moderate', 'sillage' => 'moderate'],
            'byredo-mojave-ghost' => ['perfumer' => 'Jerome Epinette', 'release_year' => 2013, 'concentration' => 'EDP', 'top_notes' => ['Амбретта', 'Магнолия'], 'heart_notes' => ['Жасмин самбак', 'Сандал', 'Фиалка'], 'base_notes' => ['Мускус', 'Амбра', 'Кедр'], 'accords' => [['name' => 'Мускусный', 'percent' => 100], ['name' => 'Цветочный', 'percent' => 52], ['name' => 'Древесный', 'percent' => 42], ['name' => 'Пудровый', 'percent' => 38]], 'longevity' => 'moderate', 'sillage' => 'soft'],
            'byredo-bal-dafrique' => ['perfumer' => 'Jerome Epinette', 'release_year' => 2009, 'concentration' => 'EDP', 'top_notes' => ['Бергамот', 'Лимон', 'Нероли'], 'heart_notes' => ['Африканский бархатцы', 'Жасмин', 'Фиалка'], 'base_notes' => ['Кедр', 'Мускус', 'Ветивер'], 'accords' => [['name' => 'Цитрусовый', 'percent' => 100], ['name' => 'Древесный', 'percent' => 58], ['name' => 'Цветочный', 'percent' => 42]], 'longevity' => 'moderate', 'sillage' => 'moderate'],
            'le-labo-santal-33' => ['perfumer' => 'Frank Voelkl', 'release_year' => 2011, 'concentration' => 'EDP', 'top_notes' => ['Кардамон', 'Ирис', 'Фиалка'], 'heart_notes' => ['Папирус', 'Амброксан'], 'base_notes' => ['Сандал', 'Кедр', 'Кожа'], 'accords' => [['name' => 'Древесный', 'percent' => 100], ['name' => 'Кожаный', 'percent' => 65], ['name' => 'Тёплый пряный', 'percent' => 52], ['name' => 'Анималистичный', 'percent' => 38]], 'longevity' => 'long_lasting', 'sillage' => 'strong'],
            'le-labo-rose-31' => ['perfumer' => 'Daphne Bugey', 'release_year' => 2006, 'concentration' => 'EDP', 'top_notes' => ['Кумин', 'Кориандр'], 'heart_notes' => ['Роза', 'Кедр'], 'base_notes' => ['Амбра', 'Мускус', 'Ветивер', 'Ладан'], 'accords' => [['name' => 'Розовый', 'percent' => 100], ['name' => 'Древесный', 'percent' => 58], ['name' => 'Тёплый пряный', 'percent' => 52], ['name' => 'Амбровый', 'percent' => 42]], 'longevity' => 'long_lasting', 'sillage' => 'moderate'],
            'le-labo-another-13' => ['perfumer' => 'Daphne Bugey', 'release_year' => 2008, 'concentration' => 'EDP', 'top_notes' => ['Семена амбретты', 'Мускус'], 'heart_notes' => ['Жасмин', 'Кокос', 'Амбра'], 'base_notes' => ['Амброксан', 'Мускус'], 'accords' => [['name' => 'Мускусный', 'percent' => 100], ['name' => 'Амбровый', 'percent' => 48], ['name' => 'Водный', 'percent' => 42]], 'longevity' => 'moderate', 'sillage' => 'soft'],
            'diptyque-philosykos' => ['perfumer' => 'Olivia Giacobetti', 'release_year' => 1996, 'concentration' => 'EDT', 'top_notes' => ['Инжирный лист', 'Зелёные ноты'], 'heart_notes' => ['Инжир', 'Кокос'], 'base_notes' => ['Кедр', 'Древесные ноты'], 'accords' => [['name' => 'Зелёный', 'percent' => 100], ['name' => 'Древесный', 'percent' => 55], ['name' => 'Фруктовый', 'percent' => 40]], 'longevity' => 'moderate', 'sillage' => 'soft'],
            'diptyque-eau-rose' => ['perfumer' => null, 'release_year' => 2011, 'concentration' => 'EDT', 'top_notes' => ['Личи', 'Роза'], 'heart_notes' => ['Роза', 'Розовая вода'], 'base_notes' => ['Белый мускус', 'Кедр'], 'accords' => [['name' => 'Розовый', 'percent' => 100], ['name' => 'Фруктовый', 'percent' => 48], ['name' => 'Пудровый', 'percent' => 38]], 'longevity' => 'moderate', 'sillage' => 'soft'],
            'diptyque-tam-dao' => ['perfumer' => 'Fabrice Pellegrin', 'release_year' => 2003, 'concentration' => 'EDP', 'top_notes' => ['Сандал'], 'heart_notes' => ['Кедр', 'Амбра', 'Розовое дерево'], 'base_notes' => ['Мускус', 'Ваниль'], 'accords' => [['name' => 'Древесный', 'percent' => 100], ['name' => 'Амбровый', 'percent' => 58], ['name' => 'Тёплый пряный', 'percent' => 38]], 'longevity' => 'long_lasting', 'sillage' => 'moderate'],
            'tom-ford-tobacco-vanille' => ['perfumer' => null, 'release_year' => 2007, 'concentration' => 'EDP', 'top_notes' => ['Табачный лист', 'Пряные ноты'], 'heart_notes' => ['Бобы тонка', 'Ваниль', 'Какао'], 'base_notes' => ['Сухофрукты', 'Древесные ноты'], 'accords' => [['name' => 'Сладкий', 'percent' => 100], ['name' => 'Тёплый пряный', 'percent' => 68], ['name' => 'Табачный', 'percent' => 62], ['name' => 'Ванильный', 'percent' => 58]], 'longevity' => 'eternal', 'sillage' => 'strong'],
            'tom-ford-oud-wood' => ['perfumer' => null, 'release_year' => 2007, 'concentration' => 'EDP', 'top_notes' => ['Розовое дерево', 'Кардамон'], 'heart_notes' => ['Уд', 'Сандал'], 'base_notes' => ['Ветивер', 'Бобы тонка', 'Амбра'], 'accords' => [['name' => 'Древесный', 'percent' => 100], ['name' => 'Тёплый пряный', 'percent' => 52], ['name' => 'Амбровый', 'percent' => 42]], 'longevity' => 'long_lasting', 'sillage' => 'moderate'],
            'maison-margiela-jazz-club' => ['perfumer' => null, 'release_year' => 2013, 'concentration' => 'EDT', 'top_notes' => ['Розовый перец', 'Бергамот'], 'heart_notes' => ['Ром', 'Мускатный шалфей'], 'base_notes' => ['Бобы тонка', 'Ваниль', 'Ветивер'], 'accords' => [['name' => 'Сладкий', 'percent' => 100], ['name' => 'Тёплый пряный', 'percent' => 55], ['name' => 'Древесный', 'percent' => 42]], 'longevity' => 'moderate', 'sillage' => 'soft'],
            'maison-margiela-by-the-fireplace' => ['perfumer' => null, 'release_year' => 2016, 'concentration' => 'EDT', 'top_notes' => ['Гвоздика', 'Флёрдоранж'], 'heart_notes' => ['Каштан', 'Гваяковое дерево'], 'base_notes' => ['Ваниль', 'Кашмеран'], 'accords' => [['name' => 'Сладкий', 'percent' => 100], ['name' => 'Дымный', 'percent' => 55], ['name' => 'Древесный', 'percent' => 45]], 'longevity' => 'moderate', 'sillage' => 'soft'],
            'xerjoff-naxos' => ['perfumer' => null, 'release_year' => 2013, 'concentration' => 'EDP', 'top_notes' => ['Лаванда', 'Бергамот'], 'heart_notes' => ['Мёд', 'Корица'], 'base_notes' => ['Табак', 'Бобы тонка'], 'accords' => [['name' => 'Сладкий', 'percent' => 100], ['name' => 'Тёплый пряный', 'percent' => 60], ['name' => 'Табачный', 'percent' => 55]], 'longevity' => 'long_lasting', 'sillage' => 'strong'],
            'amouage-interlude-man' => ['perfumer' => 'Alberto Morillas', 'release_year' => 2012, 'concentration' => 'EDP', 'top_notes' => ['Орегано', 'Бергамот', 'Розовый перец'], 'heart_notes' => ['Ладан', 'Корица', 'Гвоздика'], 'base_notes' => ['Амбра', 'Кожа', 'Папирус'], 'accords' => [['name' => 'Дымный', 'percent' => 100], ['name' => 'Тёплый пряный', 'percent' => 62], ['name' => 'Амбровый', 'percent' => 50]], 'longevity' => 'eternal', 'sillage' => 'strong'],
            'amouage-reflection-woman' => ['perfumer' => null, 'release_year' => 2007, 'concentration' => 'EDP', 'top_notes' => ['Бергамот', 'Кориандр', 'Зелёные ноты'], 'heart_notes' => ['Жасмин', 'Орхидея', 'Ландыш'], 'base_notes' => ['Ветивер', 'Мускус', 'Дубовый мох'], 'accords' => [['name' => 'Цветочный', 'percent' => 100], ['name' => 'Зелёный', 'percent' => 50], ['name' => 'Древесный', 'percent' => 42]], 'longevity' => 'long_lasting', 'sillage' => 'moderate'],
            'parfums-de-marly-layton' => ['perfumer' => 'Hamid Merati-Kashani', 'release_year' => 2016, 'concentration' => 'EDP', 'top_notes' => ['Яблоко', 'Бергамот', 'Лаванда'], 'heart_notes' => ['Герань', 'Жасмин', 'Фиалка'], 'base_notes' => ['Ваниль', 'Кардамон', 'Сандал'], 'accords' => [['name' => 'Сладкий', 'percent' => 100], ['name' => 'Ванильный', 'percent' => 55], ['name' => 'Фруктовый', 'percent' => 45]], 'longevity' => 'long_lasting', 'sillage' => 'strong'],
            'parfums-de-marly-delina' => ['perfumer' => 'Hamid Merati-Kashani', 'release_year' => 2017, 'concentration' => 'EDP', 'top_notes' => ['Личи', 'Ревень', 'Бергамот'], 'heart_notes' => ['Турецкая роза', 'Пион', 'Ландыш'], 'base_notes' => ['Мускус', 'Кедр', 'Амброксан'], 'accords' => [['name' => 'Пудровый', 'percent' => 100], ['name' => 'Фруктовый', 'percent' => 50], ['name' => 'Цветочный', 'percent' => 45]], 'longevity' => 'long_lasting', 'sillage' => 'moderate'],
            'creed-aventus' => ['perfumer' => 'Olivier Creed, Erwin Creed', 'release_year' => 2010, 'concentration' => 'EDP', 'top_notes' => ['Ананас', 'Бергамот', 'Чёрная смородина', 'Яблоко'], 'heart_notes' => ['Берёза', 'Пачули', 'Жасмин', 'Роза'], 'base_notes' => ['Мускус', 'Дубовый мох', 'Амбра', 'Ваниль'], 'accords' => [['name' => 'Фруктовый', 'percent' => 100], ['name' => 'Дымный', 'percent' => 55], ['name' => 'Древесный', 'percent' => 48]], 'longevity' => 'long_lasting', 'sillage' => 'strong'],
            'creed-green-irish-tweed' => ['perfumer' => 'Pierre Bourdon', 'release_year' => 1985, 'concentration' => 'EDP', 'top_notes' => ['Вербена', 'Ирис'], 'heart_notes' => ['Листья фиалки', 'Сандал'], 'base_notes' => ['Амбра'], 'accords' => [['name' => 'Зелёный', 'percent' => 100], ['name' => 'Древесный', 'percent' => 55], ['name' => 'Свежий', 'percent' => 45]], 'longevity' => 'long_lasting', 'sillage' => 'moderate'],
        ];

        // ponytail: only one real photo exists so far (see product-card.jsx /
        // products/show.jsx fallback to the SVG bottle icon) — add more slugs here
        // as real product photos come in (upload via /admin, or drop the file in
        // public/images/products and register it here like the line below).
        $imagePaths = [
            'dior-sauvage' => 'products/dior-sauvage.jpg',
        ];

        // Demo photos live in public/images (tracked in git) but are served from
        // the same "public" disk as admin uploads (storage/app/public) — copy
        // them over once so both sources render through the same /storage/... URL.
        foreach ($imagePaths as $source) {
            $seedFile = public_path("images/{$source}");
            $storagePath = storage_path("app/public/{$source}");
            if (file_exists($seedFile) && ! file_exists($storagePath)) {
                @mkdir(dirname($storagePath), 0755, true);
                copy($seedFile, $storagePath);
            }
        }

        foreach ($products as $entry) {
            $brand = Brand::firstOrCreate(
                ['slug' => str($entry['brand'])->slug()],
                ['name' => $entry['brand']],
            );

            $slug = str($entry['brand'].' '.$entry['name'])->slug();

            $product = Product::updateOrCreate(
                ['slug' => $slug],
                [
                    'brand_id' => $brand->id,
                    'category_id' => $categories[$entry['category']]->id,
                    'name' => $entry['name'],
                    'description' => $entry['description'],
                    'image_path' => $imagePaths[(string) $slug] ?? null,
                    ...$fragranceDetails[(string) $slug],
                ],
            );

            foreach ($entry['variants'] as [$volumeMl, $price]) {
                $product->variants()->firstOrCreate(
                    ['volume_ml' => $volumeMl],
                    ['price' => $price],
                );
            }
        }

        $sellers = [
            ['name' => 'Анна Литвин', 'email' => 'anna.seller@example.com'],
            ['name' => 'Игорь Ковальчук', 'email' => 'igor.seller@example.com'],
            ['name' => 'Марина Дорош', 'email' => 'marina.seller@example.com'],
            ['name' => 'Дмитрий Панов', 'email' => 'dmitry.seller@example.com'],
        ];

        $sellerUsers = [];
        foreach ($sellers as $seller) {
            $sellerUsers[] = User::firstOrCreate(
                ['email' => $seller['email']],
                User::factory()->raw(['name' => $seller['name'], 'email' => $seller['email']]),
            );
        }

        $lots = [
            ['seller' => 0, 'brand_name' => 'Xerjoff', 'product_name' => 'Naxos', 'total_volume_ml' => 100, 'remaining_volume_ml' => 87, 'price_per_ml' => 25, 'bulk_threshold_ml' => null, 'bulk_price_per_ml' => null],
            ['seller' => 0, 'brand_name' => 'Chanel', 'product_name' => 'Bleu de Chanel', 'total_volume_ml' => 100, 'remaining_volume_ml' => 64, 'price_per_ml' => 18, 'bulk_threshold_ml' => 10, 'bulk_price_per_ml' => 15],
            ['seller' => 1, 'brand_name' => 'Amouage', 'product_name' => 'Interlude Man', 'total_volume_ml' => 50, 'remaining_volume_ml' => 32, 'price_per_ml' => 30, 'bulk_threshold_ml' => 5, 'bulk_price_per_ml' => 24],
            ['seller' => 1, 'brand_name' => 'Creed', 'product_name' => 'Aventus', 'total_volume_ml' => 120, 'remaining_volume_ml' => 95, 'price_per_ml' => 35, 'bulk_threshold_ml' => 10, 'bulk_price_per_ml' => 30],
            ['seller' => 1, 'brand_name' => 'Initio', 'product_name' => 'Oud for Greatness', 'total_volume_ml' => 90, 'remaining_volume_ml' => 41, 'price_per_ml' => 40, 'bulk_threshold_ml' => null, 'bulk_price_per_ml' => null],
            ['seller' => 2, 'brand_name' => 'Parfums de Marly', 'product_name' => 'Layton', 'total_volume_ml' => 125, 'remaining_volume_ml' => 13, 'price_per_ml' => 22, 'bulk_threshold_ml' => 10, 'bulk_price_per_ml' => 18],
            ['seller' => 2, 'brand_name' => 'Nishane', 'product_name' => 'Hacivat', 'total_volume_ml' => 75, 'remaining_volume_ml' => 60, 'price_per_ml' => 28, 'bulk_threshold_ml' => null, 'bulk_price_per_ml' => null],
            ['seller' => 3, 'brand_name' => 'Kilian', 'product_name' => 'Angels\' Share', 'total_volume_ml' => 50, 'remaining_volume_ml' => 22, 'price_per_ml' => 45, 'bulk_threshold_ml' => 5, 'bulk_price_per_ml' => 38],
            ['seller' => 3, 'brand_name' => 'Mancera', 'product_name' => 'Cedrat Boise', 'total_volume_ml' => 120, 'remaining_volume_ml' => 108, 'price_per_ml' => 15, 'bulk_threshold_ml' => 15, 'bulk_price_per_ml' => 12],
        ];

        foreach ($lots as $lot) {
            $sellerId = $sellerUsers[$lot['seller']]->id;
            unset($lot['seller']);

            Lot::firstOrCreate(
                ['user_id' => $sellerId, 'product_name' => $lot['product_name']],
                [...$lot, 'user_id' => $sellerId],
            );
        }

        $posts = [
            [
                'title' => 'Parfum, EDP, EDT, EDC: в чём разница',
                'excerpt' => 'На флаконе часто пишут аббревиатуру, которая почти ничего не говорит новичку. Разбираемся, что она значит и как влияет на стойкость и цену.',
                'body' => "Разница между Parfum, Eau de Parfum, Eau de Toilette и Eau de Cologne — это концентрация парфюмерного масла в спиртовой основе. Чем её больше, тем сильнее и дольше держится аромат, и тем выше обычно цена за миллилитр.\n\nParfum (Extrait de Parfum) — самая высокая концентрация, обычно 20–40%. Держится на коже 8 часов и дольше, распыляется экономно: пары капель хватает надолго.\n\nEau de Parfum (EDP) — 15–20% масла. Самый популярный формат для нишевой и премиум-парфюмерии, баланс стойкости и цены.\n\nEau de Toilette (EDT) — 5–15%. Легче, более \"дневной\" формат, часто выбирают для летних ароматов.\n\nEau de Cologne (EDC) — 2–4%, самая лёгкая и недорогая концентрация, держится 2–3 часа.\n\nПоэтому один и тот же аромат в версии EDT и EDP может ощущаться и держаться по-разному — это не просто маркетинг, а реальная разница в составе.",
                'published_days_ago' => 9,
            ],
            [
                'title' => 'Как правильно хранить парфюм',
                'excerpt' => 'Свет, тепло и перепады температуры — главные враги аромата. Несколько простых правил, чтобы флакон не потерял характер раньше времени.',
                'body' => "Парфюмерное масло окисляется под воздействием света, тепла и кислорода — от этого аромат \"плывёт\", меняет оттенок или становится резче.\n\nХраните флаконы в тёмном месте — ванная с прямым солнцем или подоконник не подходят, несмотря на то что там обычно и стоит парфюм. Лучше закрытый шкаф или коробка.\n\nИзбегайте перепадов температуры: не держите флакон у батареи и не забывайте его в машине летом. Резкие скачки температуры ускоряют разложение молекул аромата.\n\nЗакрывайте флакон сразу после использования — постоянный контакт с воздухом окисляет масло быстрее, чем кажется.\n\nПри соблюдении этих условий большинство ароматов сохраняют характер 3–5 лет, а некоторые — и дольше.",
                'published_days_ago' => 6,
            ],
            [
                'title' => 'Что такое распив и почему с него стоит начинать',
                'excerpt' => 'Полный флакон нишевого аромата может стоить как хороший ужин в ресторане. Разлив по 5–10 мл — способ попробовать больше, не переплачивая.',
                'body' => "Распив — это когда владелец флакона делится небольшим количеством аромата с другими, а не продаёт весь флакон целиком. Для покупателя это способ попробовать дорогой нишевый аромат за небольшую цену, прежде чем решиться на полный флакон.\n\nЭто особенно важно для нишевой парфюмерии, которую почти невозможно понюхать в обычном магазине — офлайн-точек с полным ассортиментом просто не существует в большинстве городов. Распив закрывает именно эту проблему.\n\nНа Flacony это устроено так: продавец выставляет флакон с указанием остатка, покупатель выбирает нужный объём — хоть 2 мл, хоть 20 — и получает именно то количество, которое хочет попробовать.\n\nЭто не про \"экономию ради экономии\" — это про возможность собрать собственную парфюмерную библиотеку из ароматов, которые иначе так и остались бы неизвестными.",
                'published_days_ago' => 4,
            ],
            [
                'title' => 'Ароматические семейства: с чего начать разбираться в нотах',
                'excerpt' => 'Древесные, цитрусовые, амбровые, шипровые — за этими словами стоит понятная логика. Краткий гид по семействам ароматов.',
                'body' => "Все ароматы принято делить на несколько крупных семейств по доминирующим нотам — это упрощает выбор, когда ароматов вокруг сотни.\n\nЦитрусовые — свежие, лёгкие, с нотами бергамота, лимона, апельсина. Хороший старт для тех, кто не любит тяжёлые шлейфы.\n\nДревесные — сандал, кедр, ветивер. Тёплые и обволакивающие, часто база для мужских ароматов, но всё чаще встречаются в унисекс-композициях.\n\nАмбровые (восточные) — ваниль, смолы, специи. Насыщенные и долгоиграющие, раскрываются медленно и держатся дольше всего.\n\nШипровые — дубовый мох, пачули, бергамот. Классическое сложное семейство, сегодня встречается реже из-за ограничений на дубовый мох.\n\nЦветочные — роза, жасмин, ирис. Самое разнообразное семейство, от лёгких весенних до плотных вечерних композиций.\n\nЗная своё семейство, гораздо проще ориентироваться в каталоге и лотах распива — не нужно нюхать всё подряд.",
                'published_days_ago' => 2,
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

        $forumCategoryDefs = [
            ['name' => 'Общие обсуждения', 'description' => 'Всё, что не подошло под другие разделы'],
            ['name' => 'Вопросы новичков', 'description' => 'Только начинаешь разбираться в парфюмерии — сюда'],
            ['name' => 'Отзывы о продавцах', 'description' => 'Делимся опытом покупок на витринах'],
        ];

        $forumCategories = [];
        foreach ($forumCategoryDefs as $entry) {
            $forumCategories[] = ForumCategory::firstOrCreate(
                ['slug' => str($entry['name'])->slug()],
                $entry,
            );
        }

        $topics = [
            [
                'category' => 1,
                'title' => 'С чего начать, если раньше пользовался только масс-маркетом?',
                'author' => $testUser,
                'replies' => [
                    [$sellerUsers[0], 'Начни с распива — возьми 2-3 мл разных ароматов из разных семейств (древесные, цитрусовые, амбровые), чтобы понять, что вообще нравится, прежде чем брать полный флакон.'],
                    [$sellerUsers[1], 'Согласен с советом выше. Ещё добавлю: не нюхай больше 3 ароматов подряд за раз, нос "устаёт" и перестаёт различать оттенки.'],
                ],
            ],
            [
                'category' => 0,
                'title' => 'Как отличить оригинал от подделки при покупке распива?',
                'author' => $sellerUsers[2],
                'replies' => [
                    [$sellerUsers[3], 'Смотри на батч-код флакона, откуда наливают — большинство брендов дают проверить его на официальном сайте. Плюс сравнивай цвет и вязкость с фото оригинала.'],
                ],
            ],
            [
                'category' => 2,
                'title' => 'Отзыв о покупке у Игоря — Aventus пришёл быстро и герметично упакован',
                'author' => $testUser,
                'replies' => [
                    [$sellerUsers[1], 'Спасибо за отзыв! Всегда упаковываю в стекло с уплотнителем, чтобы точно не протекло при доставке.'],
                ],
            ],
        ];

        foreach ($topics as $topicDef) {
            $topic = $forumCategories[$topicDef['category']]->topics()->firstOrCreate(
                ['title' => $topicDef['title']],
                [
                    'user_id' => $topicDef['author']->id,
                    'slug' => str($topicDef['title'])->slug().'-'.str()->random(6),
                ],
            );

            foreach ($topicDef['replies'] as [$author, $body]) {
                $topic->replies()->firstOrCreate(
                    ['user_id' => $author->id, 'body' => $body],
                );
            }
        }
    }
}
