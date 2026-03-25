# vp-wp

[![build status](https://github.com/nabasa-dev/vp-wp/actions/workflows/ci.yml/badge.svg)](https://github.com/nabasa-dev/vp-wp/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/%40nabasa%2Fvp-wp?logo=npm)](https://www.npmjs.com/package/@nabasa/vp-wp)
[![npm downloads](https://img.shields.io/npm/dm/%40nabasa%2Fvp-wp?logo=npm)](https://www.npmjs.com/package/@nabasa/vp-wp)
[![composer version](https://img.shields.io/packagist/v/nabasa/vp-wp?logo=packagist)](https://packagist.org/packages/nabasa/vp-wp)
[![composer downloads](https://img.shields.io/packagist/dt/nabasa/vp-wp?logo=packagist)](https://packagist.org/packages/nabasa/vp-wp)
[![pkg.pr.new](https://pkg.pr.new/badge/nabasa-dev/vp-wp)](https://pkg.pr.new/~/nabasa-dev/vp-wp)
[![license](https://img.shields.io/github/license/nabasa-dev/vp-wp)](https://github.com/nabasa-dev/vp-wp/blob/main/LICENSE)

`vp-wp` is a WordPress integration package for Vite+ projects.

It focuses on a smaller API, TypeScript source, Vite+ tooling, and a cleaner PHP runtime.

## Install

```sh
vp add -D vite-plus @nabasa/vp-wp
```

If you want to use the PHP helpers through Composer:

```sh
composer require nabasa/vp-wp
```

If you do not use Composer, copy `vp-wp.php` from this repository into your plugin or theme and require it manually.

## Vite+ config

```ts
import { defineConfig } from "vite-plus";
import { wordpress, wordpressExternals } from "@nabasa/vp-wp";

export default defineConfig({
  plugins: [
    wordpress({
      entry: {
        app: "resources/app.ts",
      },
      outDir: "assets/dist",
    }),
    wordpressExternals(),
  ],
});
```

Then use the standard Vite+ commands:

```sh
vp dev
vp build
```

`wordpress()` enables WordPress-friendly defaults:

- `base: './'`
- `build.manifest: 'manifest.json'`
- `build.modulePreload: false`
- `css.devSourcemap: true`
- a development manifest at `vite-dev-server.json`

`wordpressExternals()` externalizes common WordPress globals plus React by default.

## PHP runtime

```php
<?php

use function Nabasa\VitePlus\assets;

$vite = assets( __DIR__ . '/assets/dist' );

add_action( 'wp_enqueue_scripts', function () use ( $vite ): void {
	$vite->enqueue(
		'resources/app.ts',
		[
			'handle' => 'my-plugin-app',
			'dependencies' => [ 'react', 'react-dom' ],
			'in_footer' => true,
		]
	);
} );
```

Public PHP helpers:

- `Nabasa\VitePlus\assets()`
- `Nabasa\VitePlus\register_asset()`
- `Nabasa\VitePlus\enqueue_asset()`
- `Nabasa\VitePlus\asset_url()`

Public PHP filters:

- `nabasa_vite_plus/manifest_data`
- `nabasa_vite_plus/development_assets`
- `nabasa_vite_plus/production_assets`
- `nabasa_vite_plus/{scope}/manifest_data`
- `nabasa_vite_plus/{scope}/development_assets`
- `nabasa_vite_plus/{scope}/production_assets`

Use `assets()` when you want to bind a manifest directory once and reuse it:

```php
<?php

use function Nabasa\VitePlus\assets;

$vite = assets( __DIR__ . '/assets/dist' );

add_action( 'wp_enqueue_scripts', function () use ( $vite ): void {
	$vite->enqueue( 'resources/app.ts', [
		'handle' => 'theme-app',
	] );
} );
```

Pass a second argument to `assets()` when you want plugin- or theme-specific hooks:

```php
<?php

use function Nabasa\VitePlus\assets;

$vite = assets( __DIR__ . '/assets/dist', 'windpress' );

add_filter( 'nabasa_vite_plus/windpress/production_assets', function ( array $assets ) {
	return $assets;
} );
```

Scoped helpers fire both the shared `nabasa_vite_plus/*` hooks and the scoped `nabasa_vite_plus/{scope}/*` hooks. The scope is normalized with `sanitize_key()`.

If you prefer the function API, `register_asset()` and `enqueue_asset()` accept the same scope as a fourth argument.

Supported PHP options:

- `handle`
- `dependencies`
- `css_dependencies`
- `css_media`
- `css_only`
- `in_footer`

During `vp dev`, `vp-wp` reads `vite-dev-server.json` and loads assets from the live dev server. During `vp build`, it reads `manifest.json` and registers the built JavaScript and extracted CSS files.

Use `asset_url()` when you need the public URL for a file inside the built assets directory without going through the manifest:

```php
<?php

use function Nabasa\VitePlus\asset_url;

$logo_url = asset_url( __DIR__ . '/assets/dist', 'images/logo.svg' );
```

## Externals presets

```ts
wordpressExternals({ preset: "wordpress" });
```

Available presets:

- `wordpress`
- `wordpress+react`

You can also extend or trim the map:

```ts
wordpressExternals({
  include: {
    "@acme/ui": "AcmeUI",
  },
  exclude: ["lodash"],
});
```

## Development

```sh
vp install
vp check
vp test
vp pack
```

## Credits

`vp-wp` is a fork and rewrite inspired by [`@kucrut/vite-for-wp`](https://github.com/kucrut/vite-for-wp).
