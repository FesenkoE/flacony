<?php

use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\ForumController;
use App\Http\Controllers\ForumReplyController;
use App\Http\Controllers\ForumTopicController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\LotController;
use App\Http\Controllers\NovaPoshtaController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\PromoCodeController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\SellerController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::middleware('guest')->group(function () {
    Route::get('auth/google/redirect', [GoogleController::class, 'redirect'])->name('auth.google.redirect');
    Route::get('auth/google/callback', [GoogleController::class, 'callback'])->name('auth.google.callback');
});

Route::post('locale/{locale}', function (string $locale) {
    $locale = in_array($locale, \App\Http\Middleware\HandleLocale::SUPPORTED, true) ? $locale : 'uk';

    return back()->cookie('locale', $locale, 60 * 24 * 365);
})->name('locale.update');

Route::get('search', [SearchController::class, 'index'])->name('search');
Route::get('search/live', [SearchController::class, 'live'])->name('search.live');

Route::get('products', [ProductController::class, 'index'])->name('products.index');
Route::get('products/{product:slug}', [ProductController::class, 'show'])->name('products.show');

Route::get('blog', [BlogController::class, 'index'])->name('blog.index');
Route::get('blog/{post:slug}', [BlogController::class, 'show'])->name('blog.show');

Route::get('forum', [ForumController::class, 'index'])->name('forum.index');
Route::get('forum/topics/{topic}', [ForumTopicController::class, 'show'])->name('forum.topics.show');
Route::get('forum/{category:slug}', [ForumController::class, 'category'])->name('forum.category');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('forum/{category:slug}/create', [ForumTopicController::class, 'create'])->name('forum.topics.create');
    Route::post('forum/{category:slug}/topics', [ForumTopicController::class, 'store'])->name('forum.topics.store');
    Route::post('forum/topics/{topic}/replies', [ForumReplyController::class, 'store'])->name('forum.replies.store');
});

Route::get('sellers', [SellerController::class, 'index'])->name('sellers.index');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('sellers/lots/create', [LotController::class, 'create'])->name('lots.create');
    Route::post('sellers/lots', [LotController::class, 'store'])->name('lots.store');
    Route::get('sellers/lots/{lot}/edit', [LotController::class, 'edit'])->name('lots.edit');
    Route::put('sellers/lots/{lot}', [LotController::class, 'update'])->name('lots.update');
    Route::delete('sellers/lots/{lot}', [LotController::class, 'destroy'])->name('lots.destroy');
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('favorites', [FavoriteController::class, 'index'])->name('favorites.index');
    Route::post('favorites/{product}', [FavoriteController::class, 'toggle'])->name('favorites.toggle');
    Route::post('products/{product:slug}/reviews', [ReviewController::class, 'store'])->name('reviews.store');
    Route::delete('reviews/{review}', [ReviewController::class, 'destroy'])->name('reviews.destroy');
    Route::get('checkout', [CheckoutController::class, 'index'])->name('checkout.index');
    Route::post('checkout', [CheckoutController::class, 'store'])->name('checkout.store');
    Route::post('checkout/promo/validate', [PromoCodeController::class, 'validate'])->name('checkout.promo.validate');
    Route::get('orders/{order}', [OrderController::class, 'show'])->name('orders.show');
    Route::post('orders/{order}/status', [OrderController::class, 'updateStatus'])->name('orders.status');
    Route::get('nova-poshta/cities', [NovaPoshtaController::class, 'cities'])->name('nova-poshta.cities');
    Route::get('nova-poshta/warehouses', [NovaPoshtaController::class, 'warehouses'])->name('nova-poshta.warehouses');
});

Route::get('lots', [LotController::class, 'index'])->name('lots.index');
Route::get('sellers/lots/{lot}', [LotController::class, 'show'])->name('lots.show');
Route::get('sellers/{user}', [SellerController::class, 'show'])->name('sellers.show');

Route::get('cart', [CartController::class, 'index'])->name('cart.index');
Route::post('cart', [CartController::class, 'store'])->name('cart.store');
Route::patch('cart/{variant}', [CartController::class, 'update'])->name('cart.update');
Route::delete('cart/{variant}', [CartController::class, 'destroy'])->name('cart.destroy');
Route::post('cart/lots', [CartController::class, 'storeLot'])->name('cart.lots.store');
Route::delete('cart/lots/{lot}', [CartController::class, 'destroyLot'])->name('cart.lots.destroy');

require __DIR__.'/settings.php';
