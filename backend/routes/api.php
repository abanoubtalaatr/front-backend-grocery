<?php

use App\Http\Controllers\Api\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Api\Admin\ContentController as AdminContentController;
use App\Http\Controllers\Api\Admin\InboxController as AdminInboxController;
use App\Http\Controllers\Api\Admin\MealController as AdminMealController;
use App\Http\Controllers\Api\Admin\OfferController as AdminOfferController;
use App\Http\Controllers\Api\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Api\Admin\ReviewController as AdminReviewController;
use App\Http\Controllers\Api\Admin\StatsController as AdminStatsController;
use App\Http\Controllers\Api\Admin\SubcategoryController as AdminSubcategoryController;
use App\Http\Controllers\Api\Admin\UserController as AdminUserController;
use App\Http\Controllers\Api\AddressController;
use App\Http\Controllers\Api\Auth\GoogleAuthController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ChatbotController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\DataManagementController;
use App\Http\Controllers\Api\LoyaltyController;
use App\Http\Controllers\Api\FaqController;
use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\Api\MealController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\NotificationSettingsController;
use App\Http\Controllers\Api\OfferController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\SmartListController;
use App\Http\Controllers\Api\SpecialNoteController;
use App\Http\Controllers\Api\StaticPageController;
use App\Http\Controllers\Api\SupportController;
use App\Http\Controllers\Api\UserAppSettingsController;
use App\Http\Controllers\Api\StripeCheckoutController;
use App\Http\Controllers\Api\StripeController;
use App\Http\Controllers\Api\StripeWebhookController;
use App\Http\Controllers\Api\SubcategoryController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::post('/stripe/webhook', [StripeWebhookController::class, 'handle']);

// Public routes - Authentication
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/verify-otp', [AuthController::class, 'verifyOtp']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);
    Route::post('/google', [GoogleAuthController::class, 'login']);
});

// Protected routes - Require authentication
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/change-password', [AuthController::class, 'changePassword']);
        Route::delete('/delete-account', [AuthController::class, 'deleteAccount']);
        Route::get('/me', [AuthController::class, 'me']);
    });

    // Profile routes
    Route::prefix('profile')->group(function () {
        Route::get('/', [ProfileController::class, 'show']);
        Route::post('/image', [ProfileController::class, 'updateImage']);
        Route::put('/info', [ProfileController::class, 'updateInfo']);
        Route::delete('/image', [ProfileController::class, 'deleteImage']);
        Route::get('/sessions', [ProfileController::class, 'sessions']);
        Route::delete('/sessions/{tokenId}', [ProfileController::class, 'destroySession']);
    });

    // Address routes
    Route::prefix('addresses')->group(function () {
        Route::get('/', [AddressController::class, 'index']);
        Route::post('/', [AddressController::class, 'store']);
        Route::get('/{id}', [AddressController::class, 'show']);
        Route::put('/{id}', [AddressController::class, 'update']);
        Route::delete('/{id}', [AddressController::class, 'destroy']);
        Route::post('/{id}/set-default', [AddressController::class, 'setDefault']);
    });

    Route::post('smart-lists/{id}/meals', [SmartListController::class, 'addMeal']);
    Route::delete('smart-lists/{id}/meals/{mealId}', [SmartListController::class, 'removeMeal']);
    Route::apiResource('smart-lists', SmartListController::class);

    Route::prefix('notification-settings')->group(function () {
        Route::get('/', [NotificationSettingsController::class, 'index']);
        Route::put('/', [NotificationSettingsController::class, 'update']);
        Route::put('/category/{category}', [NotificationSettingsController::class, 'updateCategory']);
    });

    Route::prefix('notifications')->group(function () {
        // Get notifications
        Route::get('/', [NotificationController::class, 'index']);
        Route::get('/with-resources', [NotificationController::class, 'indexWithResources']);

        // Statistics
        Route::get('/stats', [NotificationController::class, 'stats']);
        Route::get('/unread-count', [NotificationController::class, 'unreadCount']);
        Route::get('/recent', [NotificationController::class, 'recent']);

        // Single notification operations
        Route::get('/{id}', [NotificationController::class, 'show']);
        Route::put('/{id}/read', [NotificationController::class, 'markAsRead']);
        Route::put('/{id}/unread', [NotificationController::class, 'markAsUnread']);
        Route::delete('/{id}', [NotificationController::class, 'destroy']);

        // Bulk operations
        Route::put('/mark-all-read', [NotificationController::class, 'markAllAsRead']);
        Route::delete('/delete-multiple', [NotificationController::class, 'destroyMultiple']);
        Route::delete('/clear-all', [NotificationController::class, 'clearAll']);

        // Filtered notifications
        Route::get('/type/{type}', [NotificationController::class, 'byType']);
    });

    // Cart routes
    Route::prefix('cart')->group(function () {
        Route::get('/', [CartController::class, 'index']);
        Route::post('/items', [CartController::class, 'addItem']);
        Route::put('/items/{itemId}', [CartController::class, 'updateItem']);
        Route::delete('/items/{itemId}', [CartController::class, 'removeItem']);
        Route::delete('/clear', [CartController::class, 'clear']);
    });

    // Favorites routes
    Route::prefix('favorites')->group(function () {
        Route::get('/', [FavoriteController::class, 'index']);
        Route::post('/{mealId}/toggle', [FavoriteController::class, 'toggle']);
        Route::get('/{mealId}/check', [FavoriteController::class, 'check']);
        Route::delete('/{mealId}', [FavoriteController::class, 'remove']);
    });

    // Chatbot routes
    Route::prefix('chatbot')->group(function () {
        Route::post('/', [ChatbotController::class, 'chat']);
        Route::get('/history', [ChatbotController::class, 'history']);
        Route::get('/suggestions', [ChatbotController::class, 'suggestions']);
    });

    Route::get('/cards', [StripeController::class, 'listCards']);
    Route::post('/setup-intent', [StripeController::class, 'createSetupIntent']);
    Route::post('/charge-card', [StripeController::class, 'chargeSavedCard']);
    Route::delete('/cards/{id}', [StripeController::class, 'deleteCard']);

    // Order routes
    Route::prefix('orders')->group(function () {
        Route::post('/', [OrderController::class, 'store']);
        Route::get('/', [OrderController::class, 'index']);
        Route::get('/track', [OrderController::class, 'track']);
        Route::get('/{id}', [OrderController::class, 'show']);
    });

    // Payment routes
    Route::prefix('payments')->group(function () {
        Route::post('/stripe/checkout-session', [StripeCheckoutController::class, 'store']);
        Route::get('/stripe/verify-session/{session_id}', [StripeCheckoutController::class, 'verifySession']);
        Route::get('/history', [PaymentController::class, 'paymentHistory']);
        Route::get('/receipt/{order}', [PaymentController::class, 'receipt']);
        Route::get('/invoice/{order}', [PaymentController::class, 'invoice']);
    });

    // Dashboard route
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // Loyalty & rewards
    Route::get('/loyalty', [LoyaltyController::class, 'index']);

    // Help & support — problem reports (authenticated)
    Route::post('/support/report', [SupportController::class, 'store']);

    // App settings (profile settings page)
    Route::get('/language', [UserAppSettingsController::class, 'showLanguage']);
    Route::put('/language', [UserAppSettingsController::class, 'updateLanguage']);
    Route::get('/appearance', [UserAppSettingsController::class, 'showAppearance']);
    Route::put('/appearance', [UserAppSettingsController::class, 'updateAppearance']);
    Route::get('/notification-preferences', [UserAppSettingsController::class, 'showNotificationPreferences']);
    Route::put('/notification-preferences', [UserAppSettingsController::class, 'updateNotificationPreferences']);

    Route::prefix('data-management')->group(function () {
        Route::get('/download', [DataManagementController::class, 'download']);
        Route::delete('/delete', [DataManagementController::class, 'delete']);
    });

    // Personalized "frequency" meals (requires auth — uses order history)
    Route::get('/frequency', [MealController::class, 'frequency']);
});

// Meals routes
Route::prefix('meals')->group(function () {
    Route::get('/today', [MealController::class, 'today']);
    Route::get('hot', [MealController::class, 'hot']);

    Route::get('/recommendations', [MealController::class, 'recommendations']);
    Route::get('/', [MealController::class, 'index']);
    Route::get('/{id}', [MealController::class, 'show']);

});
Route::get('/new-products', [MealController::class, 'newProducts']);
Route::get('best-sells', [MealController::class, 'bestSells']);
Route::get('sliders', [MealController::class, 'slider']);
Route::get('brands', [MealController::class, 'brands']);
Route::get('more-to-explore', [MealController::class, 'moreToExplore']);
Route::get('settings', [SettingController::class, 'index']);
Route::get('special-notes', [SpecialNoteController::class, 'index']);
// Categories routes

Route::prefix('offers')->group(function () {
    Route::get('/', [OfferController::class, 'index']);
    Route::get('/featured', [OfferController::class, 'featured']);
    Route::get('/validate', [OfferController::class, 'validateOffer']);
    Route::get('/{code}', [OfferController::class, 'showByCode']);
});
Route::prefix('categories')->group(function () {
    Route::get('/', [CategoryController::class, 'index']);
    Route::get('/{id}', [CategoryController::class, 'show']);
    Route::get('/{id}/meals', [CategoryController::class, 'meals']);
});

// Subcategories routes
Route::prefix('subcategories')->group(function () {
    Route::get('/', [SubcategoryController::class, 'index']);
    Route::get('/{id}', [SubcategoryController::class, 'show']);
    Route::get('/{id}/meals', [SubcategoryController::class, 'meals']);
});
Route::get('/faqs', [FaqController::class, 'index']);
Route::get('/pages', [StaticPageController::class, 'index']);
Route::get('/pages/slug/{slug}', [StaticPageController::class, 'showBySlug']);
Route::get('/pages/important', [StaticPageController::class, 'importantPages']);
Route::post('/contact', [ContactController::class, 'submit']);

/*
|--------------------------------------------------------------------------
| Admin API
|--------------------------------------------------------------------------
|
| Consumed by the React dashboard at `/dashboard`. Everything here requires a
| Sanctum token belonging to a user with `is_admin = true` (see the
| `admin.api` middleware) and answers JSON, never a redirect.
|
*/
Route::middleware(['auth:sanctum', 'admin.api'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/stats', [AdminStatsController::class, 'index']);

        // Catalog
        Route::post('/products/{meal}/toggle', [AdminMealController::class, 'toggle']);
        Route::apiResource('products', AdminMealController::class)->parameters(['products' => 'meal']);
        Route::apiResource('categories', AdminCategoryController::class);
        Route::apiResource('subcategories', AdminSubcategoryController::class);

        // Sales
        Route::get('/orders', [AdminOrderController::class, 'index']);
        Route::get('/orders/{order}', [AdminOrderController::class, 'show']);
        Route::put('/orders/{order}/status', [AdminOrderController::class, 'updateStatus']);
        Route::apiResource('offers', AdminOfferController::class);

        // People
        Route::get('/users', [AdminUserController::class, 'index']);
        Route::get('/users/{user}', [AdminUserController::class, 'show']);
        Route::put('/users/{user}', [AdminUserController::class, 'update']);
        Route::delete('/users/{user}', [AdminUserController::class, 'destroy']);

        // Moderation
        Route::get('/reviews', [AdminReviewController::class, 'index']);
        Route::put('/reviews/{review}/approval', [AdminReviewController::class, 'setApproval']);
        Route::delete('/reviews/{review}', [AdminReviewController::class, 'destroy']);

        // Inbox
        Route::get('/messages', [AdminInboxController::class, 'messages']);
        Route::put('/messages/{message}', [AdminInboxController::class, 'updateMessage']);
        Route::delete('/messages/{message}', [AdminInboxController::class, 'destroyMessage']);
        Route::get('/reports', [AdminInboxController::class, 'reports']);
        Route::put('/reports/{report}', [AdminInboxController::class, 'updateReport']);
        Route::delete('/reports/{report}', [AdminInboxController::class, 'destroyReport']);

        // Content
        Route::get('/faqs', [AdminContentController::class, 'faqs']);
        Route::post('/faqs', [AdminContentController::class, 'storeFaq']);
        Route::put('/faqs/{faq}', [AdminContentController::class, 'updateFaq']);
        Route::delete('/faqs/{faq}', [AdminContentController::class, 'destroyFaq']);
        Route::get('/pages', [AdminContentController::class, 'pages']);
        Route::post('/pages', [AdminContentController::class, 'storePage']);
        Route::get('/pages/{page}', [AdminContentController::class, 'showPage']);
        Route::put('/pages/{page}', [AdminContentController::class, 'updatePage']);
        Route::delete('/pages/{page}', [AdminContentController::class, 'destroyPage']);
        Route::get('/settings', [AdminContentController::class, 'settings']);
        Route::put('/settings', [AdminContentController::class, 'updateSettings']);
    });

// Health check route
Route::get('/health', function () {
    return response()->json([
        'success' => true,
        'message' => 'API is running',
        'timestamp' => now(),
    ]);
});
