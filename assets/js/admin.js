// Admin taxonomy live filter for Classic screens and Gutenberg sidebar.
// Backward compatible with existing behavior.
(function($){
    'use strict';

    // Inject a search input into a container and wire live filtering
    function addFilterInput($container, taxonomyLabel){
        if (!$container || !$container.length) return;
        if ($container.data('pcf-active')) return;

        var placeholder = (window.pcfPlugin && pcfPlugin.placeholder)
            ? pcfPlugin.placeholder.replace('%s', taxonomyLabel || 'categories')
            : 'Filter categories';

        var $input = $('<input/>', {
            type: 'search',
            class: 'pcf-search',
            placeholder: placeholder,
            style: 'width:100%; margin-bottom:6px;'
        });

        $container.prepend($input);
        $container.attr('data-pcf-active', '1');

        function getItems() {
            // Classic editor and quick edit lists
            var $classic = $container.find('.categorychecklist li, .cat-checklist li');

            // Gutenberg hierarchical terms list and common checkbox wrappers
            var $gb = $container.find(
                '.editor-post-taxonomies__hierarchical-terms-list li,' +
                '.components-checkbox-control'
            );

            // Prefer classic if present; otherwise use Gutenberg selectors
            return $classic.length ? $classic : $gb;
        }

        $input.on('input', function(){
            var term = $.trim($(this).val()).toLowerCase();
            var $items = getItems();

            if (!$items.length) return;

            if (!term) {
                $items.show();
                return;
            }
            $items.hide().filter(function(){
                return $(this).text().toLowerCase().indexOf(term) !== -1;
            }).show();
        });
    }

    // Classic editor and quick/bulk edit bootstrap
    function bootClassic(){
        // Post editor metaboxes (classic and legacy taxonomy boxes)
        $('.categorydiv, .taxonomydiv').each(function(){
            var $box = $(this);
            var label = $box.find('h2, h3, .handlediv').first().text() || 'categories';
            addFilterInput($box.find('.tabs-panel, .inside').first(), label);
        });

        // Quick edit on posts list
        $('.inline-edit-categories').each(function(){
            var $qe = $(this);
            addFilterInput($qe, 'categories');
        });
    }

    // Gutenberg bootstrap: find the Categories panel in the editor sidebar
    function bootGutenberg(){
        // Sidebar root varies across WP versions
        var $sidebar = $('.edit-post-sidebar, .interface-interface-skeleton__sidebar');
        if (!$sidebar.length) return;

        // Try by aria-label first (localized installs may differ)
        var $catPanels = $sidebar.find('[aria-label="Categories"], [aria-label="Category"], [aria-label*="Categor"]');

        // Fallback: panels whose text contains "Categories"/"Category"
        if (!$catPanels.length) {
            $catPanels = $sidebar.find('.components-panel, .components-panel__body').filter(function(){
                var txt = $(this).text().toLowerCase();
                return txt.indexOf('categories') !== -1 || txt.indexOf('category') !== -1;
            });
        }

        $catPanels.each(function(){
            var $panel = $(this);

            // Common Gutenberg list wrapper for hierarchical taxonomies
            var $listWrap = $panel.find('.editor-post-taxonomies__hierarchical-terms-list').first();

            // Fallback to the panel body if wrapper not found yet (DOM may mount lazily)
            if (!$listWrap.length) {
                $listWrap = $panel.find('.components-panel__body, .components-panel').first();
            }

            if ($listWrap.length) {
                addFilterInput($listWrap, 'categories');
            }
        });
    }

    function bootAll(){
        bootClassic();
        if (window.pcfPlugin && pcfPlugin.enableGutenberg !== false) {
			bootGutenberg();
		}
    }

    $(document).ready(bootAll);

    // Subscribe for dynamic DOM updates in Gutenberg
    if (window.wp && wp.data && typeof wp.data.subscribe === 'function') {
        var scheduled = false;
        wp.data.subscribe(function(){
            if (scheduled) return;
            scheduled = true;
            setTimeout(function(){
                scheduled = false;
                bootAll();
            }, 200);
        });
    }
})(window.jQuery || jQuery);