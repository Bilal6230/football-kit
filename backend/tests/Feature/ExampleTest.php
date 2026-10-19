<?php

namespace Tests\Feature;

use Tests\TestCase;

class ExampleTest extends TestCase
{
    public function test_web_root_is_not_a_storefront(): void
    {
        $this->get('/')->assertNotFound();
    }
}
