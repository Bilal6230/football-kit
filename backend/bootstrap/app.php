<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
    )
    ->withMiddleware()
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request, Throwable $e): bool => $request->is('api', 'api/*') || $request->expectsJson()
        );

        $exceptions->respond(function (Response $response): Response {
            if (! request()->is('api', 'api/*')) {
                return $response;
            }

            $status = $response->getStatusCode();

            // Never return exception messages, SQL, paths or traces from the API.
            $response->setContent(json_encode([
                'error' => [
                    'status' => $status,
                    'message' => $status >= 500 ? 'Server Error' : (Response::$statusTexts[$status] ?? 'Request Failed'),
                ],
            ], JSON_THROW_ON_ERROR));
            $response->headers->set('Content-Type', 'application/json');

            return $response;
        });
    })->create();
