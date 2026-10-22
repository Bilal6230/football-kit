<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Route;
use Tests\TestCase;

class HealthTest extends TestCase
{
    public function test_health_returns_json_without_accept_header(): void
    {
        $this->get('/api/v1/health')->assertOk()
            ->assertHeader('Content-Type', 'application/json')
            ->assertExactJson(['data' => ['status' => 'ok']]);
    }

    public function test_unknown_api_route_returns_consistent_json(): void
    {
        $this->get('/api/v1/missing')->assertNotFound()
            ->assertExactJson(['error' => ['code' => 'not_found', 'status' => 404, 'message' => 'Not Found']]);
    }

    public function test_server_error_hides_sensitive_details_even_with_debug_enabled(): void
    {
        config(['app.debug' => true]);
        Route::get('/api/v1/test-error', fn () => throw new \RuntimeException('secret database credentials'));

        $this->get('/api/v1/test-error')->assertStatus(500)
            ->assertExactJson(['error' => ['code' => 'internal_error', 'status' => 500, 'message' => 'Server Error']]);
    }

    public function test_explicit_local_origin_is_allowed(): void
    {
        config(['cors.allowed_origins' => ['http://localhost:3000']]);
        $this->withHeader('Origin', 'http://localhost:3000')->get('/api/v1/health')
            ->assertHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    }

    public function test_production_server_error_is_generic(): void
    {
        $this->app->instance('env', 'production');
        config(['app.debug' => false]);
        Route::get('/api/v1/test-production-error', fn () => throw new \RuntimeException('secret connection string'));

        $this->get('/api/v1/test-production-error')->assertStatus(500)
            ->assertExactJson(['error' => ['code' => 'internal_error', 'status' => 500, 'message' => 'Server Error']]);
    }

    public function test_empty_origin_allowlist_denies_cross_origin_access(): void
    {
        config(['cors.allowed_origins' => []]);
        $this->withHeader('Origin', 'http://localhost:3000')->get('/api/v1/health')
            ->assertHeaderMissing('Access-Control-Allow-Origin');
    }

    public function test_unlisted_origin_is_not_allowed(): void
    {
        config(['cors.allowed_origins' => ['http://localhost:3000', 'http://127.0.0.1:3000']]);
        $this->withHeader('Origin', 'https://untrusted.example')->get('/api/v1/health')
            ->assertHeaderMissing('Access-Control-Allow-Origin');
    }

    public function test_local_preflight_allows_get(): void
    {
        config(['cors.allowed_origins' => ['http://localhost:3000']]);
        $this->withHeaders([
            'Origin' => 'http://localhost:3000',
            'Access-Control-Request-Method' => 'GET',
        ])->options('/api/v1/health')->assertNoContent()
            ->assertHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
            ->assertHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
            ->assertHeaderMissing('Access-Control-Allow-Credentials');
    }

    public function test_disallowed_preflight_has_no_origin_permission(): void
    {
        config(['cors.allowed_origins' => ['http://localhost:3000', 'http://127.0.0.1:3000']]);
        $this->withHeaders([
            'Origin' => 'https://untrusted.example',
            'Access-Control-Request-Method' => 'GET',
        ])->options('/api/v1/health')->assertNoContent()
            ->assertHeaderMissing('Access-Control-Allow-Origin');
    }

    public function test_single_origin_configuration_does_not_reflect_an_unlisted_origin(): void
    {
        config(['cors.allowed_origins' => ['http://localhost:3000']]);
        // A fixed allow-origin value is also a denial when it differs from Origin.
        $this->withHeader('Origin', 'https://untrusted.example')->get('/api/v1/health')
            ->assertHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    }

    public function test_json_errors_remain_readable_by_the_allowed_frontend(): void
    {
        config(['cors.allowed_origins' => ['http://localhost:3000']]);
        $this->withHeader('Origin', 'http://localhost:3000')->get('/api/v1/missing')
            ->assertNotFound()->assertJsonPath('error.code', 'not_found')
            ->assertHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    }

    public function test_wrong_method_retains_allow_header(): void
    {
        $this->postJson('/api/v1/health')->assertStatus(405)
            ->assertHeader('Allow', 'GET, HEAD')
            ->assertExactJson(['error' => ['code' => 'method_not_allowed', 'status' => 405, 'message' => 'Method Not Allowed']]);
    }
}
