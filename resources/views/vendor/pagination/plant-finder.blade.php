@if ($paginator->hasPages())
    <nav role="navigation" aria-label="Plant finder pages">
        <ul class="finder-page-list">
            @if ($paginator->onFirstPage())
                <li class="disabled" aria-disabled="true">
                    <span aria-hidden="true">‹</span>
                    <span class="visually-hidden">Previous</span>
                </li>
            @else
                <li>
                    <a href="{{ $paginator->previousPageUrl() }}" rel="prev" aria-label="Previous page">‹</a>
                </li>
            @endif

            @foreach ($elements as $element)
                @if (is_string($element))
                    <li class="disabled" aria-disabled="true"><span>{{ $element }}</span></li>
                @endif

                @if (is_array($element))
                    @foreach ($element as $page => $url)
                        @if ($page == $paginator->currentPage())
                            <li class="active" aria-current="page"><span>{{ $page }}</span></li>
                        @else
                            <li><a href="{{ $url }}" aria-label="Go to page {{ $page }}">{{ $page }}</a></li>
                        @endif
                    @endforeach
                @endif
            @endforeach

            @if ($paginator->hasMorePages())
                <li><a href="{{ $paginator->nextPageUrl() }}" rel="next" aria-label="Next page">›</a></li>
            @else
                <li class="disabled" aria-disabled="true">
                    <span aria-hidden="true">›</span>
                    <span class="visually-hidden">Next</span>
                </li>
            @endif
        </ul>
    </nav>
@endif
