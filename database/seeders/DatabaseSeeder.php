<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Category;
use App\Models\ForumCategory;
use App\Models\Lot;
use App\Models\Post;
use App\Models\PostCategory;
use App\Models\Product;
use App\Models\PromoCode;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public const DESCRIPTIONS_UK = [
        'dior-sauvage' => 'Свіжий і мінеральний аромат з бергамотом на старті та амброксаном у базі — впізнавана «синя» класика, яка однаково доречна вранці на роботі й увечері в барі.',
        'dior-jadore' => 'Розкішний квітковий букет з іланг-іланга, троянди та жасмину на золотистій базі — втілення класичної жіночності від Dior.',
        'dior-homme-intense' => 'Пудрово-ірисовий аромат з какао та ветивером у базі — елегантний, теплий, без агресивної солодкості.',
        'byredo-gypsy-water' => 'Деревно-цитрусовий унісекс-аромат з ладаном і ваніллю — вільний, кочовий характер без прив\'язки до сезону.',
        'byredo-mojave-ghost' => 'Легкий і прозорий мускусно-квітковий аромат, натхненний пустельною рослиною гуаюла — повітряний, майже невагомий.',
        'byredo-bal-dafrique' => 'Цитрусово-деревна композиція з ноткою африканських чорнобривців — тепла, сонячна, трохи ностальгічна.',
        'le-labo-santal-33' => 'Культовий сандалово-шкіряний аромат з нотами кардамону та кедра — один із найвпізнаваніших нішевих ароматів останнього десятиліття.',
        'le-labo-rose-31' => 'Несподівана «чоловіча» троянда — квітка переплетена з кміном, кедром і амброю, без жодної пудрової ноти.',
        'le-labo-another-13' => 'Чистий, майже абстрактний мускусно-амбровий аромат з нотою озону — так званий «запах паперу», унікальний і мінімалістичний.',
        'diptyque-philosykos' => 'Зелений інжировий аромат — соковите листя, молочний сік і деревина інжиру цілком, без нудотності.',
        'diptyque-eau-rose' => 'Прозора, свіжа троянда з відтінком лічі та легкою пудровою базою — делікатна й не нудотна.',
        'diptyque-tam-dao' => 'Обволікаючий сандалово-кедровий аромат, натхненний в\'єтнамськими храмами — теплий, спокійний, медитативний.',
        'tom-ford-tobacco-vanille' => 'Насичений тютюново-ванільний аромат зі спеціями та сухофруктами — теплий, як старе шкіряне крісло біля каміна.',
        'tom-ford-oud-wood' => 'М\'який, «дизайнерський» уд без різкості — сандал, палісандр і спеції створюють теплу деревну базу.',
        'maison-margiela-jazz-club' => 'Ром, тютюн і ванільна тонка — затишний аромат прокуреного джаз-клубу з серії Replica.',
        'maison-margiela-by-the-fireplace' => 'Димний аромат палаючих полін з каштаном і ваніллю — запах зимового вечора біля каміна з лінійки Replica.',
        'xerjoff-naxos' => 'Мед, тютюн і лаванда в щільній, майже гурманській композиції — один із найвпізнаваніших ароматів Xerjoff.',
        'amouage-interlude-man' => 'Димний, смолистий і дуже щільний аромат з ладаном і спеціями — не для тихого виходу, вимагає впевненості.',
        'amouage-reflection-woman' => 'Елегантний квітково-деревний аромат з ірисом і ветивером — стримана розкіш без зайвої солодкості.',
        'parfums-de-marly-layton' => 'Яблуко, лаванда й ваніль у теплій, привабливій композиції — один із найобговорюваніших чоловічих ароматів останніх років.',
        'parfums-de-marly-delina' => 'Пудрово-фруктовий аромат з лічі та півонією на базі амбри — повітряний і дуже жіночний.',
        'creed-aventus' => 'Фруктово-димна композиція з ананасом, березовим дьогтем і мускусом — еталон «успішного» чоловічого аромату.',
        'creed-green-irish-tweed' => 'Свіжий фіалково-деревний аромат з ірисом і сандалом — класика в жанрі «чистої» чоловічої парфумерії.',
    ];

    public const POSTS_UK = [
        'parfum-edp-edt-edc-v-cem-raznica' => [
            'title_uk' => "Parfum, EDP, EDT, EDC: у чому різниця",
            'excerpt_uk' => "На флаконі часто пишуть абревіатуру, яка майже нічого не каже новачкові. Розбираємося, що вона означає і як впливає на стійкість і ціну.",
            'body_uk' => "Різниця між Parfum, Eau de Parfum, Eau de Toilette та Eau de Cologne — це концентрація парфумерної олії в спиртовій основі. Чим її більше, тим сильніше й довше тримається аромат, і тим вища зазвичай ціна за мілілітр.\n\nParfum (Extrait de Parfum) — найвища концентрація, зазвичай 20–40%. Тримається на шкірі 8 годин і довше, витрачається економно: кількох крапель вистачає надовго.\n\nEau de Parfum (EDP) — 15–20% олії. Найпопулярніший формат для нішевої та преміум-парфумерії, баланс стійкості й ціни.\n\nEau de Toilette (EDT) — 5–15%. Легший, більш \"денний\" формат, його часто обирають для літніх ароматів.\n\nEau de Cologne (EDC) — 2–4%, найлегша й найдешевша концентрація, тримається 2–3 години.\n\nТому один і той самий аромат у версії EDT та EDP може відчуватися й триматися по-різному — це не просто маркетинг, а реальна різниця в складі.",
        ],
        'kak-pravilno-xranit-parfium' => [
            'title_uk' => "Як правильно зберігати парфуми",
            'excerpt_uk' => "Світло, тепло й перепади температури — головні вороги аромату. Кілька простих правил, щоб флакон не втратив характер раніше часу.",
            'body_uk' => "Парфумерна олія окиснюється під дією світла, тепла й кисню — через це аромат \"пливе\", змінює відтінок або стає різкішим.\n\nЗберігайте флакони в темному місці — ванна з прямим сонцем чи підвіконня не підходять, хоча саме там зазвичай і стоять парфуми. Краще зачинена шафа або коробка.\n\nУникайте перепадів температури: не тримайте флакон біля батареї і не забувайте його в машині влітку. Різкі стрибки температури пришвидшують розкладання молекул аромату.\n\nЗакривайте флакон одразу після використання — постійний контакт із повітрям окиснює олію швидше, ніж здається.\n\nЗа дотримання цих умов більшість ароматів зберігають характер 3–5 років, а деякі — й довше.",
        ],
        'cto-takoe-raspiv-i-pocemu-s-nego-stoit-nacinat' => [
            'title_uk' => "Що таке розпив і чому з нього варто починати",
            'excerpt_uk' => "Повний флакон нішевого аромату може коштувати як хороша вечеря в ресторані. Розлив по 5–10 мл — спосіб спробувати більше, не переплачуючи.",
            'body_uk' => "Розпив — це коли власник флакона ділиться невеликою кількістю аромату з іншими, а не продає весь флакон цілком. Для покупця це спосіб спробувати дорогий нішевий аромат за невелику ціну, перш ніж наважитися на повний флакон.\n\nЦе особливо важливо для нішевої парфумерії, яку майже неможливо понюхати у звичайному магазині — офлайн-точок з повним асортиментом у більшості міст просто не існує. Розпив закриває саме цю проблему.\n\nНа Flacony це влаштовано так: продавець виставляє флакон із зазначенням залишку, покупець обирає потрібний об'єм — хоч 2 мл, хоч 20 — і отримує саме ту кількість, яку хоче спробувати.\n\nЦе не про \"економію заради економії\" — це про можливість зібрати власну парфумерну бібліотеку з ароматів, які інакше так і залишилися б невідомими.",
        ],
        'aromaticeskie-semeistva-s-cego-nacat-razbiratsia-v-notax' => [
            'title_uk' => "Ароматичні сімейства: з чого почати розбиратися в нотах",
            'excerpt_uk' => "Деревні, цитрусові, амброві, шипрові — за цими словами стоїть зрозуміла логіка. Короткий гід по сімействах ароматів.",
            'body_uk' => "Усі аромати прийнято ділити на кілька великих сімейств за домінантними нотами — це спрощує вибір, коли ароматів навколо сотні.\n\nЦитрусові — свіжі, легкі, з нотами бергамоту, лимона, апельсина. Гарний старт для тих, хто не любить важких шлейфів.\n\nДеревні — сандал, кедр, ветивер. Теплі й обволікаючі, часто база для чоловічих ароматів, але дедалі частіше трапляються в унісекс-композиціях.\n\nАмброві (східні) — ваніль, смоли, спеції. Насичені й довготривалі, розкриваються повільно і тримаються найдовше.\n\nШипрові — дубовий мох, пачулі, бергамот. Класичне складне сімейство, сьогодні трапляється рідше через обмеження на дубовий мох.\n\nКвіткові — троянда, жасмин, ірис. Найрізноманітніше сімейство, від легких весняних до щільних вечірніх композицій.\n\nЗнаючи своє сімейство, набагато простіше орієнтуватися в каталозі й лотах розпиву — не треба нюхати все підряд.",
        ],
        'muzskoi-zenskii-uniseks-rabotaet-li-eto-delenie' => [
            'title_uk' => "Чоловічий, жіночий, унісекс: чи працює цей поділ",
            'excerpt_uk' => "На флаконі часто пишуть «для чоловіків» або «для жінок» — але ніс це маркування не читає. Розбираємося, звідки взявся поділ і чи варто його дотримуватися.",
            'body_uk' => "Поділ парфумерії на \"чоловічу\" та \"жіночу\" здається чимось природним, але насправді це досить нова традиція — їй щонайбільше сто років, і вигадав її здебільшого маркетинг, а не хімія.\n\nЖодна нота сама по собі не \"чоловіча\" і не \"жіноча\" — це культурна домовленість. В одну епоху квіткові аромати носили європейські чоловіки при дворі, в іншу квіти стали вважатися виключно жіночою темою. Те саме з деревними й пряними нотами, які сьогодні частіше маркують як чоловічі.\n\nНішева парфумерія багато в чому будується навколо унісекс-підходу — бренди свідомо відходять від гендерних ярликів, бо аромат має пасувати характеру й шкірі, а не статі, вказаній на етикетці.\n\nНа практиці це означає: цитрусовий одеколон \"для нього\" чудово ляже на жіночу шкіру, а квітково-мускусний аромат \"для неї\" може стати ідеальним підписом чоловіка. Гендерне маркування на флаконі — це орієнтир для маркетингу, а не правило для покупця.\n\nТому, обираючи аромат, розумніше орієнтуватися на ноти й на те, як композиція звучить саме на вашій шкірі, а не на слово \"for men\" чи \"for women\" на коробці.",
        ],
        'kak-vybrat-svoi-pervyi-nisevyi-aromat' => [
            'title_uk' => "Як обрати свій перший нішевий аромат",
            'excerpt_uk' => "Полиці в нішевому магазині лякають різноманіттям. Простий план, з чого почати, якщо раніше пробували лише мас-маркет.",
            'body_uk' => "Перехід від мас-маркету до ніші часто лякає — десятки незнайомих брендів, у кожного по 20 ароматів, і незрозуміло, з чого починати.\n\nКрок перший — відштовхуйтеся від того, що вже подобається. Якщо любите свіжі цитрусові туалетні води, шукайте нішеві бренди в тому ж сімействі, а не хапайтеся за найгучнішого амбрового монстра з форумів.\n\nКрок другий — не вірте рейтингам і хайпу наосліп. \"Аромат року\" за версією інтернету може просто не пасувати вашій шкірі й характеру — аромати працюють дуже індивідуально.\n\nКрок третій — тестуйте на шкірі, а не на смужці, і поживіть з ароматом хоча б кілька годин перед покупкою. Багато композицій сильно змінюються між першим пшиком і фінальним шлейфом.\n\nКрок четвертий — починайте з розпиву, а не з повного флакона. Кілька мілілітрів на пробу коштують у рази дешевше й дозволяють протестувати п'ять ароматів замість купівлі одного наосліп.\n\nТак поступово замість одного \"аромату на все життя\" збирається невелика парфумерна бібліотека — під настрій, сезон і привід.",
        ],
        'pocemu-odin-i-tot-ze-aromat-paxnet-u-vsex-po-raznomu' => [
            'title_uk' => "Чому той самий аромат пахне в усіх по-різному",
            'excerpt_uk' => "Той самий флакон в одного тримається весь день, в іншого вивітрюється за годину. Справа не в підробці — а в хімії вашої шкіри.",
            'body_uk' => "Аромат не існує окремо від шкіри, на яку його наносять — він змішується з її власним запахом, і результат у кожного свій.\n\nЖирність шкіри має значення: на жирній шкірі молекули аромату затримуються довше, на сухій — швидше випаровуються й \"тануть\" за кілька годин. Суху шкіру перед нанесенням варто зволожити — крем без запаху створює основу, на якій аромат розкривається краще і тримається довше.\n\nТемпература тіла й навіть раціон харчування теж впливають на сприйняття — це не міф, а результат того, як pH і мікрофлора шкіри взаємодіють із молекулами аромату.\n\nНаносьте аромат на точки пульсу — зап'ястя, шию, згини ліктів — там шкіра тепліша й аромат розкривається активніше. І не розтирайте зап'ястя одне об одне: тертя руйнує верхні ноти, і аромат розкривається неправильно, втрачаючи перші півгодини свого звучання.\n\nТому якщо аромат \"не тримається\" у вас так, як у блогера у відгуку, — це не завжди питання якості флакона. Часто справа просто в різниці шкіри.",
        ],
        'naturalnye-i-sinteticeskie-ingredienty-v-cem-raznica-na-samom-dele' => [
            'title_uk' => "Натуральні та синтетичні інгредієнти: у чому різниця насправді",
            'excerpt_uk' => "«Натуральний» не означає «кращий», а «синтетичний» — не означає «дешевий». Розбираємося, як насправді влаштована сучасна парфумерія.",
            'body_uk' => "Багато хто впевнений: «натуральний» аромат — це якість і розкіш, а «синтетичний» — дешева підробка. Насправді це застарілий міф, який парфумерія давно переросла.\n\nНатуральні інгредієнти — це справжні екстракти рослин: абсолю жасмину, трояндова олія, сандалове дерево. Вони дорогі, партія відрізняється від партії залежно від урожаю, а деякі класичні речовини на кшталт дубового моху чи тваринного мускусу сьогодні заборонені або жорстко обмежені — з екологічних причин і через алергени.\n\nСинтетичні молекули — Iso E Super, Ambroxan, Hedione і десятки інших — створюються в лабораторії. Вони дають ефекти, яких у природі просто не існує: прозорий «чистий» мускус, величезний деревний шлейф, стабільний запах від флакона до флакона. Саме синтетика зробила можливими цілі напрями сучасної парфумерії.\n\nМайже будь-який аромат, навіть нішевий і позиціонований як «натуральний», насправді здебільшого складається зі спирту, фіксаторів і синтетичних молекул — стовідсотково натуральна композиція сьогодні радше виняток, ніж практика.\n\nТому судити про аромат варто з того, як він пахне й тримається на шкірі, а не з маркетингової позначки на коробці.",
        ],
    ];

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
            ['brand' => 'Byredo', 'name' => "Bal d'Afrique", 'category' => 'unisex', 'variants' => [[5, 510], [10, 960]], 'description' => 'Цитрусово-древесная композиция с ноткой африканских бархатцев — тёплая, солнечная, слегка ностальгическая.'],
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
            'byredo-bal-dafrique' => ['perfumer' => 'Jerome Epinette', 'release_year' => 2009, 'concentration' => 'EDP', 'top_notes' => ['Бергамот', 'Лимон', 'Нероли'], 'heart_notes' => ['Африканские бархатцы', 'Жасмин', 'Фиалка'], 'base_notes' => ['Кедр', 'Мускус', 'Ветивер'], 'accords' => [['name' => 'Цитрусовый', 'percent' => 100], ['name' => 'Древесный', 'percent' => 58], ['name' => 'Цветочный', 'percent' => 42]], 'longevity' => 'moderate', 'sillage' => 'moderate'],
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

        // ponytail: only one real photo pair exists so far (see product-card.jsx /
        // products/show.jsx fallback to the SVG bottle icon) — add more slugs here
        // as real product photos come in (upload via /admin, or drop the files in
        // public/images/products and register them here like the line below).
        // Each product needs a dark-theme and a light-theme photo — see
        // project_design_taste memory for the Gemini prompt used to generate them.
        $imagePaths = [
            'dior-sauvage' => [
                'dark' => 'products/dior-sauvage.jpg',
                'light' => 'products/dior-sauvage-light.jpg',
            ],
        ];

        // Demo photos live in public/images (tracked in git) but are served from
        // the same "public" disk as admin uploads (storage/app/public) — copy
        // them over once so both sources render through the same /storage/... URL.
        foreach ($imagePaths as $paths) {
            foreach ($paths as $source) {
                $seedFile = public_path("images/{$source}");
                $storagePath = storage_path("app/public/{$source}");
                if (file_exists($seedFile) && ! file_exists($storagePath)) {
                    @mkdir(dirname($storagePath), 0755, true);
                    copy($seedFile, $storagePath);
                }
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
                    'description_uk' => self::DESCRIPTIONS_UK[(string) $slug] ?? null,
                    'image_path' => $imagePaths[(string) $slug]['dark'] ?? null,
                    'image_path_light' => $imagePaths[(string) $slug]['light'] ?? null,
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
                [...$lot, 'user_id' => $sellerId, 'status' => Lot::STATUS_APPROVED],
            );
        }

        $postCategoryDefs = [
            'matchast' => 'Матчасть',
            'uhod' => 'Уход',
            'gaidy' => 'Гайды',
            'stil-i-podbor' => 'Стиль и подбор',
        ];

        $postCategories = [];
        foreach ($postCategoryDefs as $slug => $name) {
            $postCategories[$slug] = PostCategory::firstOrCreate(['slug' => $slug], ['name' => $name]);
        }

        $posts = [
            [
                'title' => 'Parfum, EDP, EDT, EDC: в чём разница',
                'excerpt' => 'На флаконе часто пишут аббревиатуру, которая почти ничего не говорит новичку. Разбираемся, что она значит и как влияет на стойкость и цену.',
                'body' => "Разница между Parfum, Eau de Parfum, Eau de Toilette и Eau de Cologne — это концентрация парфюмерного масла в спиртовой основе. Чем её больше, тем сильнее и дольше держится аромат, и тем выше обычно цена за миллилитр.\n\nParfum (Extrait de Parfum) — самая высокая концентрация, обычно 20–40%. Держится на коже 8 часов и дольше, распыляется экономно: пары капель хватает надолго.\n\nEau de Parfum (EDP) — 15–20% масла. Самый популярный формат для нишевой и премиум-парфюмерии, баланс стойкости и цены.\n\nEau de Toilette (EDT) — 5–15%. Легче, более \"дневной\" формат, часто выбирают для летних ароматов.\n\nEau de Cologne (EDC) — 2–4%, самая лёгкая и недорогая концентрация, держится 2–3 часа.\n\nПоэтому один и тот же аромат в версии EDT и EDP может ощущаться и держаться по-разному — это не просто маркетинг, а реальная разница в составе.",
                'published_days_ago' => 9,
                'cover' => 'posts/parfum-edp-edt-edc-v-cem-raznica.jpg',
                'category' => 'matchast',
            ],
            [
                'title' => 'Как правильно хранить парфюм',
                'excerpt' => 'Свет, тепло и перепады температуры — главные враги аромата. Несколько простых правил, чтобы флакон не потерял характер раньше времени.',
                'body' => "Парфюмерное масло окисляется под воздействием света, тепла и кислорода — от этого аромат \"плывёт\", меняет оттенок или становится резче.\n\nХраните флаконы в тёмном месте — ванная с прямым солнцем или подоконник не подходят, несмотря на то что там обычно и стоит парфюм. Лучше закрытый шкаф или коробка.\n\nИзбегайте перепадов температуры: не держите флакон у батареи и не забывайте его в машине летом. Резкие скачки температуры ускоряют разложение молекул аромата.\n\nЗакрывайте флакон сразу после использования — постоянный контакт с воздухом окисляет масло быстрее, чем кажется.\n\nПри соблюдении этих условий большинство ароматов сохраняют характер 3–5 лет, а некоторые — и дольше.",
                'published_days_ago' => 6,
                'cover' => 'posts/kak-pravilno-xranit-parfium.jpg',
                'category' => 'uhod',
            ],
            [
                'title' => 'Что такое распив и почему с него стоит начинать',
                'excerpt' => 'Полный флакон нишевого аромата может стоить как хороший ужин в ресторане. Разлив по 5–10 мл — способ попробовать больше, не переплачивая.',
                'body' => "Распив — это когда владелец флакона делится небольшим количеством аромата с другими, а не продаёт весь флакон целиком. Для покупателя это способ попробовать дорогой нишевый аромат за небольшую цену, прежде чем решиться на полный флакон.\n\nЭто особенно важно для нишевой парфюмерии, которую почти невозможно понюхать в обычном магазине — офлайн-точек с полным ассортиментом просто не существует в большинстве городов. Распив закрывает именно эту проблему.\n\nНа Flacony это устроено так: продавец выставляет флакон с указанием остатка, покупатель выбирает нужный объём — хоть 2 мл, хоть 20 — и получает именно то количество, которое хочет попробовать.\n\nЭто не про \"экономию ради экономии\" — это про возможность собрать собственную парфюмерную библиотеку из ароматов, которые иначе так и остались бы неизвестными.",
                'published_days_ago' => 4,
                'cover' => 'posts/cto-takoe-raspiv-i-pocemu-s-nego-stoit-nacinat.jpg',
                'category' => 'gaidy',
            ],
            [
                'title' => 'Ароматические семейства: с чего начать разбираться в нотах',
                'excerpt' => 'Древесные, цитрусовые, амбровые, шипровые — за этими словами стоит понятная логика. Краткий гид по семействам ароматов.',
                'body' => "Все ароматы принято делить на несколько крупных семейств по доминирующим нотам — это упрощает выбор, когда ароматов вокруг сотни.\n\nЦитрусовые — свежие, лёгкие, с нотами бергамота, лимона, апельсина. Хороший старт для тех, кто не любит тяжёлые шлейфы.\n\nДревесные — сандал, кедр, ветивер. Тёплые и обволакивающие, часто база для мужских ароматов, но всё чаще встречаются в унисекс-композициях.\n\nАмбровые (восточные) — ваниль, смолы, специи. Насыщенные и долгоиграющие, раскрываются медленно и держатся дольше всего.\n\nШипровые — дубовый мох, пачули, бергамот. Классическое сложное семейство, сегодня встречается реже из-за ограничений на дубовый мох.\n\nЦветочные — роза, жасмин, ирис. Самое разнообразное семейство, от лёгких весенних до плотных вечерних композиций.\n\nЗная своё семейство, гораздо проще ориентироваться в каталоге и лотах распива — не нужно нюхать всё подряд.",
                'published_days_ago' => 2,
                'cover' => 'posts/aromaticeskie-semeistva-s-cego-nacat-razbiratsia-v-notax.jpg',
                'category' => 'matchast',
            ],
            [
                'title' => 'Натуральные и синтетические ингредиенты: в чём разница на самом деле',
                'excerpt' => '«Натуральный» не значит «лучше», а «синтетический» — не значит «дешёвый». Разбираемся, как на самом деле устроена современная парфюмерия.',
                'body' => "Многие уверены: «натуральный» аромат — это качество и роскошь, а «синтетический» — дешёвая подделка. На деле это устаревший миф, который парфюмерия давно переросла.\n\nНатуральные ингредиенты — это реальные экстракты растений: абсолю жасмина, розовое масло, сандаловое дерево. Они дорогие, партия отличается от партии в зависимости от урожая, а некоторые классические вещества вроде дубового мха или животного мускуса сегодня запрещены или жёстко ограничены — по экологическим и аллергенным причинам.\n\nСинтетические молекулы — Iso E Super, Ambroxan, Hedione и десятки других — создаются в лаборатории. Они дают эффекты, которых в природе просто не существует: прозрачный «чистый» мускус, огромный древесный шлейф, стабильный запах от флакона к флакону. Именно синтетика сделала возможными целые направления современной парфюмерии.\n\nПочти любой аромат, даже нишевый и позиционируемый как «натуральный», на самом деле в основном состоит из спирта, фиксаторов и синтетических молекул — стопроцентно натуральная композиция сегодня скорее исключение, чем практика.\n\nПоэтому судить аромат стоит по тому, как он пахнет и держится на коже, а не по маркетинговой метке на коробке.",
                'published_days_ago' => 1,
                'cover' => 'posts/naturalnye-i-sinteticeskie-ingredienty-v-cem-raznica-na-samom-dele.jpg',
                'category' => 'matchast',
            ],
            [
                'title' => 'Почему один и тот же аромат пахнет у всех по-разному',
                'excerpt' => 'Один и тот же флакон у одного держится весь день, у другого выветривается за час. Дело не в подделке — а в химии вашей кожи.',
                'body' => "Аромат не существует отдельно от кожи, на которую его наносят — он смешивается с её собственным запахом, и результат у каждого свой.\n\nЖирность кожи имеет значение: на жирной коже молекулы аромата задерживаются дольше, на сухой — быстрее испаряются и \"тают\" за пару часов. Сухую кожу перед нанесением стоит увлажнить — крем без запаха создаёт основу, на которой аромат раскрывается лучше и держится дольше.\n\nТемпература тела и даже рацион питания тоже влияют на восприятие — это не миф, а результат того, как pH и микрофлора кожи взаимодействуют с молекулами аромата.\n\nНаносите аромат на пульсирующие точки — запястья, шею, сгибы локтей — там кожа теплее и аромат раскрывается активнее. И не растирайте запястья друг о друга: трение разрушает верхние ноты, и аромат раскрывается неправильно, теряя первые полчаса своего звучания.\n\nПоэтому если аромат \"не держится\" у вас так, как у блогера в отзыве — это не всегда вопрос качества флакона. Часто дело просто в разнице кожи.",
                'published_days_ago' => 3,
                'cover' => 'posts/pocemu-odin-i-tot-ze-aromat-paxnet-u-vsex-po-raznomu.jpg',
                'category' => 'uhod',
            ],
            [
                'title' => 'Как выбрать свой первый нишевый аромат',
                'excerpt' => 'Полки в нишевом магазине пугают разнообразием. Простой план, с чего начать, если раньше пробовали только масс-маркет.',
                'body' => "Переход от масс-маркета к нише часто пугает — десятки незнакомых брендов, у каждого по 20 ароматов, и непонятно, с чего начинать.\n\nШаг первый — оттолкнитесь от того, что уже нравится. Если любите свежие цитрусовые туалетные воды, ищите нишевые бренды в том же семействе, а не хватайтесь за самый нашумевший амбровый монстр с форумов.\n\nШаг второй — не верьте рейтингам и хайпу вслепую. \"Аромат года\" по версии интернета может просто не подойти вашей коже и характеру — ароматы работают очень индивидуально.\n\nШаг третий — тестируйте на коже, а не по полоске, и живите с ароматом хотя бы несколько часов перед покупкой. Многие композиции сильно меняются между первым впрыском и финальным шлейфом.\n\nШаг четвёртый — начинайте с распива, а не с полного флакона. Несколько миллилитров на пробу стоят в разы дешевле и позволяют протестировать пять ароматов вместо покупки одного вслепую.\n\nТак постепенно вместо одного \"аромата на всю жизнь\" собирается небольшая парфюмерная библиотека — под настроение, сезон и повод.",
                'published_days_ago' => 5,
                'cover' => 'posts/kak-vybrat-svoi-pervyi-nisevyi-aromat.jpg',
                'category' => 'gaidy',
            ],
            [
                'title' => 'Мужской, женский, унисекс: работает ли это деление',
                'excerpt' => 'На флаконе часто пишут «для мужчин» или «для женщин» — но нос эту маркировку не читает. Разбираемся, откуда взялось деление и стоит ли его придерживаться.',
                'body' => "Деление парфюмерии на \"мужскую\" и \"женскую\" кажется чем-то естественным, но на самом деле это довольно новая традиция — ей от силы сто лет, и придумал её в основном маркетинг, а не химия.\n\nНи одна нота сама по себе не \"мужская\" и не \"женская\" — это культурная договорённость. В одну эпоху цветочные ароматы носили европейские мужчины при дворе, в другую цветы стали считаться исключительно женской темой. То же самое с древесными и пряными нотами, которые сегодня чаще маркируют как мужские.\n\nНишевая парфюмерия во многом строится вокруг унисекс-подхода — бренды сознательно уходят от гендерных ярлыков, потому что аромат должен подходить характеру и коже, а не полу, указанному на этикетке.\n\nНа практике это значит: цитрусовый одеколон \"для него\" отлично сядет на женскую кожу, а цветочно-мускусный аромат \"для неё\" может стать идеальной подписью мужчины. Гендерная маркировка на флаконе — это ориентир для маркетинга, а не правило для покупателя.\n\nПоэтому при выборе аромата разумнее ориентироваться на ноты и на то, как композиция звучит именно на вашей коже, а не на слово \"for men\" или \"for women\" на коробке.",
                'published_days_ago' => 8,
                'cover' => 'posts/muzskoi-zenskii-uniseks-rabotaet-li-eto-delenie.jpg',
                'category' => 'stil-i-podbor',
            ],
        ];

        // Same demo-photo handoff as $imagePaths above — covers live in
        // public/images (tracked in git), copied once into storage/app/public
        // so they render through the same /storage/... URL as admin uploads.
        foreach ($posts as $post) {
            if (! isset($post['cover'])) {
                continue;
            }

            $seedFile = public_path("images/{$post['cover']}");
            $storagePath = storage_path("app/public/{$post['cover']}");
            if (file_exists($seedFile) && ! file_exists($storagePath)) {
                @mkdir(dirname($storagePath), 0755, true);
                copy($seedFile, $storagePath);
            }
        }

        foreach ($posts as $post) {
            $slug = (string) str($post['title'])->slug();

            Post::firstOrCreate(
                ['slug' => $slug],
                [
                    ...(self::POSTS_UK[$slug] ?? []),
                    'author_id' => $testUser->id,
                    'category_id' => $postCategories[$post['category']]->id,
                    'title' => $post['title'],
                    'excerpt' => $post['excerpt'],
                    'body' => $post['body'],
                    'cover_path' => $post['cover'] ?? null,
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
                'body' => 'Пользовался только масс-маркетом, хочу попробовать нишу, но брать флакон вслепую за несколько тысяч страшно. С чего посоветуете начать?',
                'replies' => [
                    [$sellerUsers[0], 'Начни с распива — возьми 2-3 мл разных ароматов из разных семейств (древесные, цитрусовые, амбровые), чтобы понять, что вообще нравится, прежде чем брать полный флакон.'],
                    [$sellerUsers[1], 'Согласен с советом выше. Ещё добавлю: не нюхай больше 3 ароматов подряд за раз, нос "устаёт" и перестаёт различать оттенки.'],
                ],
            ],
            [
                'category' => 0,
                'title' => 'Как отличить оригинал от подделки при покупке распива?',
                'author' => $sellerUsers[2],
                'body' => 'Хочу взять распив Aventus у незнакомого продавца и боюсь нарваться на подделку. На что смотреть до покупки и как проверить уже после?',
                'replies' => [
                    [$sellerUsers[3], 'Смотри на батч-код флакона, откуда наливают — большинство брендов дают проверить его на официальном сайте. Плюс сравнивай цвет и вязкость с фото оригинала.'],
                ],
            ],
            [
                'category' => 2,
                'title' => 'Отзыв о покупке у Игоря — Aventus пришёл быстро и герметично упакован',
                'author' => $testUser,
                'body' => 'Брал у Игоря 5 мл Aventus: отправил на следующий день, дошло за два дня, атомайзер стеклянный, ничего не протекло. По ощущениям один в один с флаконом из магазина.',
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

            // Like a topic created on the site, its opening message is the first reply.
            foreach ([[$topicDef['author'], $topicDef['body']], ...$topicDef['replies']] as [$author, $body]) {
                $topic->replies()->firstOrCreate(
                    ['user_id' => $author->id, 'body' => $body],
                );
            }
        }

        PromoCode::firstOrCreate(
            ['code' => 'WELCOME10'],
            ['type' => 'percent', 'value' => 10, 'active' => true],
        );
    }
}
