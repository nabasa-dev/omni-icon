<?php

declare (strict_types=1);
/*
 * This file is part of the Symfony package.
 *
 * (c) Fabien Potencier <fabien@symfony.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * Modified for OmniIcon WordPress plugin.
 */
namespace OmniIcon\Core\Icon\Registry;

use OmniIcon\Core\Icon\Exception\IconNotFoundException;
use OmniIcon\Core\Icon\Icon;
use OmniIcon\Core\Icon\IconRegistryInterface;
/**
 * Chains multiple icon registries to check for icons in priority order.
 *
 * @author Kevin Bond <kevinbond@gmail.com>
 */
final class ChainIconRegistry implements IconRegistryInterface
{
    /**
     * @param IconRegistryInterface[] $registries
     */
    public function __construct(private iterable $registries)
    {
    }
    public function get(string $name): Icon
    {
        foreach ($this->registries as $registry) {
            try {
                return $registry->get($name);
            } catch (IconNotFoundException $e) {
            }
        }
        $message = \sprintf('Icon "%s" not found.', $name);
        if (isset($e)) {
            $message .= " {$e->getMessage()}";
        }
        throw new IconNotFoundException($message, previous: $e ?? null);
    }
}
