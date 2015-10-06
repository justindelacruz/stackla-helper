(function($) {
    'use strict';

    /**
     * Module to add Preview links into dropdown menus.
     *
     * @returns {{setup: Function}}
     * @constructor
     */
    var PreviewHelper = function() {
        var timeoutId;

        /**
         * Listen for changes to the DOM.
         */
        var setupEvents = function () {
            var allContent = document.getElementById('all_content');
            var tbody =  allContent.getElementsByTagName('tbody')[0];
            tbody.addEventListener("DOMSubtreeModified", _handleDOMSubtreeModified, false);
        };

        /**
         * Handle "DOMSubtreeModified" event to DOM.
         * Uses setTimeout() for performance reasons-- this method is called very frequently.
         *
         * @private
         */
        var _handleDOMSubtreeModified = function() {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(_addPreviewButton, 1000);
        };

        /**
         * When a change is detected to DOM, attempt to add Preview links.
         *
         * @private
         */
        var _addPreviewButton = function() {
            // Page has two views: "Table View" and "Grid View".
            // We need to add Preview links to dropdowns in both views.
            _addPreviewToTableView();
            _addPreviewToGridView();
        };

        /**
         * Add Preview links to each tile in the Table View.
         *
         * @private
         */
        var _addPreviewToTableView = function() {
            var allContent = document.getElementById('all_content');
            var tiles = allContent.getElementsByTagName('tr');

            Array.prototype.forEach.call(tiles, function(el, i) {
                var tileId =  el.getAttribute('id');
                _addPreviewToTile(el, tileId);
            });
        };

        /**
         * Add Preview links to each tile in the Grid View.
         *
         * @private
         */
        var _addPreviewToGridView = function() {
            var gridContainer = document.getElementsByClassName('moderation-grid-container')[0];
            var tiles = gridContainer.getElementsByClassName('cell');

            Array.prototype.forEach.call(tiles, function(el, i) {
                var tileId =  el.getAttribute('id').split('-')[1];
                _addPreviewToTile(el, tileId);
            });
        };

        /**
         * Add Preview links to the dropdown menu.
         *
         * @param el
         * @param tileId
         * @private
         */
        var _addPreviewToTile = function(el, tileId) {
            var previewClass = 'preview-' + tileId;
            var dropdownMenu = el.getElementsByClassName('st-dropdown-menu')[0];
            var previewEl = '<li class="'+ previewClass +'"><a href="' + _generatePreviewUrl(tileId) + '" target="_blank">Preview</a></li>';
            // It's possible that this method executes multiple times, so let's prevent duplicates.
            if (!$(dropdownMenu).find('.' + previewClass).length) {
                $(dropdownMenu).prepend(previewEl);
            }
        };

        /**
         * Generate a Preview URL.
         *
         * @param {string} tileId
         * @returns {string}
         * @private
         */
        var _generatePreviewUrl = function(tileId) {
            return 'http://localhost/' + tileId;
        };

        return {
            setup: setupEvents
        };
    };

    var previewHelper = new PreviewHelper();
    previewHelper.setup();
})($);