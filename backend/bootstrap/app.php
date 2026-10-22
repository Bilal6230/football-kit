<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
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

        $exceptions->respond(function (Response $response, Throwable $exception, Request $request): Response {
            if (! $request->is('api', 'api/*') || $response->getStatusCode() < 400) {
                return $response;
            }

            $status = $response->getStatusCode();

            $error = [
                'code' => match ($status) {
                    404 => 'not_found',
                    405 => 'method_not_allowed',
                    422 => 'validation_failed',
                    default => $status >= 500 ? 'internal_error' : 'http_error',
                },
                'status' => $status,
                'message' => $status >= 500 ? 'Server Error' : (Response::$statusTexts[$status] ?? 'Request Failed'),
            ];

            // Only validator messages are client-facing. Never serialize exception
            // messages, request input, SQL, paths or traces. Custom validation
            // messages must be written for clients and must not include secrets.
            if ($exception instanceof ValidationException && $status === 422) {
                $error['message'] = 'Validation failed.';
                $error['fields'] = $exception->errors();
            }

            // Mutate the existing response so protocol headers (e.g. Allow) survive.
            $response->setContent(json_encode(['error' => $error], JSON_THROW_ON_ERROR));
            $response->headers->set('Content-Type', 'application/json');

            return $response;
        });
    })->create();
