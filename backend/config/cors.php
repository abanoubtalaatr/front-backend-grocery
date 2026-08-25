<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie', 'api/auth/*'],

    'allowed_methods' => ['*'],

    'allowed_origins' => array_values(array_filter(array_merge(
        [
            'http://localhost:5173',
            'http://127.0.0.1:5173',
            'https://grocery-plus-22.vercel.app',
            'http://localhost:3000',
            'https://grocery-react-pi.vercel.app',
        ],
        // Deployment-specific origins, comma-separated, e.g.
        // CORS_ALLOWED_ORIGINS=https://grocery.huma-volve.com
        array_map('trim', explode(',', (string) env('CORS_ALLOWED_ORIGINS', '')))
    ), static fn ($origin) => $origin !== '')),

    'allowed_origins_patterns' => [
        '#^https?://.*\.vercel\.app$#',
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
