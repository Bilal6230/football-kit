<?php

namespace Tests\Feature;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class ApiErrorTest extends TestCase
{
    public static function responseModes(): array
    {
        return [
            'production JSON' => [false, 'application/json'],
            'debug HTML accept' => [true, 'text/html'],
        ];
    }

    #[DataProvider('responseModes')]
    public function test_validation_preserves_field_messages_without_echoing_input(bool $debug, string $accept): void
    {
        config(['app.debug' => $debug]);
        Route::post('/api/v1/test-validation', function (Request $request): void {
            $request->validate([
                'email' => ['required', 'email'],
                'entries.*.label' => ['required', 'string'],
            ]);
        });

        $this->withHeader('Accept', $accept)->post('/api/v1/test-validation', [
            'email' => 'private-input-not-an-email',
            'entries' => [['label' => '']],
            'password' => 'do-not-return-this-input',
        ])->assertUnprocessable()
            ->assertHeader('Content-Type', 'application/json')
            ->assertExactJson(['error' => [
                'code' => 'validation_failed',
                'status' => 422,
                'message' => 'Validation failed.',
                'fields' => [
                    'email' => ['The email field must be a valid email address.'],
                    'entries.0.label' => ['The entries.0.label field is required.'],
                ],
            ]]);
    }

    #[DataProvider('responseModes')]
    public function test_http_server_exception_does_not_expose_its_message(bool $debug, string $accept): void
    {
        config(['app.debug' => $debug]);
        Route::get('/api/v1/test-http-error', fn () => abort(500, 'SQL password=private; C:/private/config'));

        $this->withHeader('Accept', $accept)->get('/api/v1/test-http-error')
            ->assertStatus(500)->assertExactJson(['error' => [
                'code' => 'internal_error', 'status' => 500, 'message' => 'Server Error',
            ]]);
    }

    public function test_custom_not_found_message_is_redacted(): void
    {
        Route::get('/api/v1/test-not-found', fn () => abort(404, 'Private record details'));

        $this->get('/api/v1/test-not-found')->assertNotFound()->assertExactJson(['error' => [
            'code' => 'not_found', 'status' => 404, 'message' => 'Not Found',
        ]]);
    }

    public function test_non_validation_422_does_not_expose_exception_details_as_fields(): void
    {
        Route::get('/api/v1/test-unprocessable', fn () => abort(422, 'Private implementation detail'));

        $this->get('/api/v1/test-unprocessable')->assertUnprocessable()->assertExactJson(['error' => [
            'code' => 'validation_failed', 'status' => 422, 'message' => 'Unprocessable Content',
        ]]);
    }

    public function test_retry_after_header_survives_error_normalization(): void
    {
        Route::get('/api/v1/test-rate-limit', fn () => abort(429, 'Private quota details', ['Retry-After' => '60']));

        $this->get('/api/v1/test-rate-limit')->assertStatus(429)->assertHeader('Retry-After', '60')
            ->assertExactJson(['error' => ['code' => 'http_error', 'status' => 429, 'message' => 'Too Many Requests']]);
    }
}
