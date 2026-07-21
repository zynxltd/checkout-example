@php
    $name = $name ?? 'close';
    $class = trim('yg-icon yg-icon--' . $name . ' ' . ($class ?? ''));
    $icons = [
        'close' => 'icon-close.svg',
        'trash' => 'icon-trash.png',
        'plus' => 'icon-plus.svg',
        'minus' => 'icon-minus.svg',
        'arrow-right' => 'icon-arrow-right.svg',
        'arrow-forest' => 'icon-arrow-right-forest.svg',
        'wheelbarrow' => 'icon-wheelbarrow.png',
        'cart' => 'icon-cart.svg',
        'menu' => 'icon-menu.svg',
        'search' => 'icon-search.svg',
        'account' => 'icon-account.svg',
        'home' => 'icon-home.svg',
    ];
    $file = $icons[$name] ?? $icons['close'];
    $path = public_path('images/icons/' . $file);
@endphp
@if(is_readable($path))
@php
    $iconUrl = asset('images/icons/' . $file);
    if (str_ends_with($file, '.png') || str_ends_with($file, '.svg')) {
        $iconUrl .= '?v=' . filemtime($path);
    }
@endphp
<img src="{{ $iconUrl }}" alt="" class="{{ e($class) }}" @if(!empty($width)) width="{{ (int) $width }}" @endif @if(!empty($height)) height="{{ (int) $height }}" @endif>
@endif
