<?php

namespace AwemaPL\ContextMenu;

use AwemaPL\BaseJS\AwemaProvider;

class ContextMenuServiceProvider extends AwemaProvider
{

    public function getPackageName(): string
    {
        return 'context-menu';
    }

    public function getPath(): string
    {
        return __DIR__;
    }
}
