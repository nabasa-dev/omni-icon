<?php

declare (strict_types=1);
namespace OmniIcon\Integration\Etch;

use OMNI_ICON;
use OmniIcon\Core\Discovery\Attributes\Hook;
use OmniIcon\Core\Discovery\Attributes\Service;
use OmniIcon\Services\ViteService;
/**
 * Service for registering and managing Etch editor integration
 * 
 * Tested with Etch version 0.22.0
 */
#[Service]
class EtchService
{
    public function __construct(private ViteService $viteService)
    {
    }
    /**
     * Check if Etch is active
     */
    private function is_etch_active(): bool
    {
        return defined('ETCH_PLUGIN_FILE');
    }
    /**
     * Check if we're in the Etch editor
     */
    private function is_etch_editor(): bool
    {
        // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- This is not a form submission
        return isset($_GET['etch']) && $_GET['etch'] === 'magic';
    }
    /**
     * Enqueue editor assets for Etch
     * 
     * Loads the icon picker integration when Etch editor is active
     */
    #[Hook('wp_enqueue_scripts', priority: 1000001)]
    public function editor_assets(): void
    {
        if (!$this->is_etch_active() || !$this->is_etch_editor()) {
            return;
        }
        $handle = OMNI_ICON::TEXT_DOMAIN . ':integration-etch-editor';
        // Enqueue omni-icon web component for the editor
        $this->viteService->enqueue_asset('resources/webcomponents/omni-icon.ts', ['handle' => OMNI_ICON::TEXT_DOMAIN . ':web-component:omni-icon', 'in-footer' => \true]);
        // Enqueue Gutenberg icon block styles (reuse for Etch)
        $this->viteService->enqueue_asset('resources/integration/gutenberg/blocks/icon-block/editor.css', ['handle' => OMNI_ICON::TEXT_DOMAIN . ':gutenberg-icon-block-editor-styles']);
        // Enqueue Etch editor integration script
        $this->viteService->enqueue_asset('resources/integration/etch/editor.ts', ['handle' => $handle, 'in_footer' => \true, 'dependencies' => ['wp-element', 'wp-components', 'wp-i18n', 'wp-data', 'wp-hooks', 'react', 'react-dom']]);
        // Add inline script to set up global variables
        wp_add_inline_script($handle, <<<JS
    // Initialize omniIconEtch global object
    if (typeof window.omniIconEtch === 'undefined') {
        window.omniIconEtch = {
            _version: '{$this->get_version()}',
            restUrl: '{$this->get_rest_url()}',
            nonce: '{$this->get_nonce()}'
        };
    }
JS
, 'before');
    }
    /**
     * Get plugin version
     */
    private function get_version(): string
    {
        return OMNI_ICON::VERSION;
    }
    /**
     * Get REST API URL
     */
    private function get_rest_url(): string
    {
        return esc_url_raw(rest_url(OMNI_ICON::REST_NAMESPACE));
    }
    /**
     * Get REST API nonce
     */
    private function get_nonce(): string
    {
        return wp_create_nonce('wp_rest');
    }
}
