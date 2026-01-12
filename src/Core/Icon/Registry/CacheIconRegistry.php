<?php

declare(strict_types=1);

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

use Psr\Cache\CacheItemPoolInterface;
use OmniIcon\Core\Icon\Exception\IconNotFoundException;
use OmniIcon\Core\Icon\Icon;
use OmniIcon\Core\Icon\IconRegistryInterface;

/**
 * Icon registry that wraps another registry with caching capabilities.
 *
 * @author Kevin Bond <kevinbond@gmail.com>
 */
final class CacheIconRegistry implements IconRegistryInterface
{
    public function __construct(
        private IconRegistryInterface $inner, 
        private CacheItemPoolInterface $cache
    ) {
    }

    public function get(string $name, bool $refresh = false): Icon
    {
        if (!Icon::isValidName($name)) {
            throw new IconNotFoundException(\sprintf('The icon name "%s" is not valid.', $name));
        }

        $cacheKey = Icon::nameToId($name);
        $cacheItem = $this->cache->getItem($cacheKey);

        if (!$refresh && $cacheItem->isHit()) {
            return $cacheItem->get();
        }

        $icon = $this->inner->get($name);
        
        $cacheItem->set($icon);
        $this->cache->save($cacheItem);

        return $icon;
    }
}