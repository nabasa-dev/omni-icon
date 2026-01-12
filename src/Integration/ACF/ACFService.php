<?php

declare (strict_types=1);
namespace OmniIcon\Integration\ACF;

use Bricks\Integrations\Dynamic_Data\Providers as BricksProvider;
use Bricks\Integrations\Dynamic_Data\Providers\Provider_Acf as BricksProviderAcf;
use OMNI_ICON;
use OmniIcon\Core\Discovery\Attributes\Hook;
use OmniIcon\Core\Discovery\Attributes\Service;
use OmniIcon\Integration\ACF\Fields\IconField;
use OmniIcon\Services\ViteService;
use function acf_register_field_type;
/**
 * Service for registering and managing ACF integration
 */
#[Service]
class ACFService
{
    public function __construct(private ViteService $viteService)
    {
    }
    /**
     * Register the ACF custom field type
     *
     * Registers Omni Icon field type for ACF when ACF is active.
     */
    #[Hook('acf/include_field_types', priority: 10)]
    public function register_field_type(): void
    {
        // Check if ACF is active
        if (!function_exists('acf_register_field_type')) {
            return;
        }
        acf_register_field_type(IconField::class);
    }
    /**
     * @see Bricks\Integrations\Dynamic_Data\Providers\Provider_Acf::register_tags()
     */
    #[Hook('wp_loaded')]
    public function bricks_integration(): void
    {
        // Check if ACF is active
        if (!function_exists('acf_register_field_type')) {
            return;
        }
        // Bricks integration
        if (class_exists(BricksProvider::class)) {
            /** @var BricksProviderAcf */
            $bricks_acf = BricksProvider::get_registered_provider('acf');
            if (!$bricks_acf) {
                return;
            }
            $bricks_acf->tags = array_merge($bricks_acf->tags, ['omni_icon' => ['name' => '{omni_icon}', 'label' => esc_html__('Omni Icon', 'bricks'), 'group' => 'ACF', 'provider' => 'acf', 'queryFiltersExcludeTag' => \true]]);
        }
    }
    /**
     * Enqueue admin assets for ACF field editor
     */
    #[Hook('acf/input/admin_enqueue_scripts', priority: 10)]
    public function admin_assets(): void
    {
        // Check if ACF is active
        if (!function_exists('acf_register_field_type')) {
            return;
        }
        // Enqueue omni-icon web component
        $this->viteService->enqueue_asset('resources/webcomponents/omni-icon.ts', ['handle' => OMNI_ICON::TEXT_DOMAIN . ':web-component:omni-icon', 'in-footer' => \true]);
        // Enqueue Gutenberg icon block styles (reuse for ACF)
        $this->viteService->enqueue_asset('resources/integration/gutenberg/blocks/icon-block/editor.css', ['handle' => OMNI_ICON::TEXT_DOMAIN . ':gutenberg-icon-block-editor-styles']);
        // Enqueue ACF field editor integration script
        $this->viteService->enqueue_asset('resources/integration/acf/editor.ts', ['handle' => OMNI_ICON::TEXT_DOMAIN . ':integration-acf-editor', 'in_footer' => \true, 'dependencies' => ['wp-element', 'wp-components', 'wp-i18n', 'wp-data', 'react', 'react-dom']]);
    }
}
