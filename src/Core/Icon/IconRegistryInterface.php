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

namespace OmniIcon\Core\Icon;

use OmniIcon\Core\Icon\Exception\IconNotFoundException;

/**
 * Icon registry interface for managing icon collections.
 * 
 * @author Kevin Bond <kevinbond@gmail.com>
 * @extends \IteratorAggregate<string>
 */
interface IconRegistryInterface
{
    /**
     * Get an icon by name.
     *
     * @throws IconNotFoundException
     */
    public function get(string $name): Icon;
}