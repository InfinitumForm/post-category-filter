<?php
/**
 * Plugin Name:       Post Category Filter (WP Admin)
 * Plugin URI:        https://infinitumform.com/projects/admin-category-filter
 * Description:       Quickly search and filter categories and taxonomies inside the WordPress admin.
 * Version:           1.7.0
 * Requires at least: 6.0
 * Requires PHP:      7.4
 * Author:            Ivijan Stefan Stipic
 * Author URI:        https://www.linkedin.com/in/ivijanstefanstipic/
 * License:           GPLv2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       admin-category-filter
 * Domain Path:       /languages
 *
 * ------------------------------------------------------------------------
 * This plugin is a maintained continuation (adoption) of the original
 * "Post Category Filter" plugin created by Javier Villanueva (jahvi).
 *
 * Copyright (c) 2013-2018 Javier Villanueva (Original Author)
 * Copyright (c) 2025 Ivijan Stefan Stipic (Maintainer)
 * ------------------------------------------------------------------------
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// Define constants.
if ( ! defined( 'PCF_VERSION' ) ) {
    define( 'PCF_VERSION', '1.7.0' );
}

if ( ! defined( 'PCF_PLUGIN_FILE' ) ) {
    define( 'PCF_PLUGIN_FILE', __FILE__ );
}

if ( ! defined( 'PCF_PLUGIN_DIR' ) ) {
    define( 'PCF_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
}

if ( ! defined( 'PCF_PLUGIN_URL' ) ) {
    define( 'PCF_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
}

// Load text domain.
function pcf_load_textdomain() {
    load_plugin_textdomain( 'admin-category-filter', false, dirname( plugin_basename( __FILE__ ) ) . '/languages' );
}
add_action( 'plugins_loaded', 'pcf_load_textdomain' );

// Only load in admin screens (non-AJAX bootstrap).
if ( is_admin() && ( ! defined( 'DOING_AJAX' ) || ! DOING_AJAX ) ) {
    require_once PCF_PLUGIN_DIR . 'inc/class-category-filter.php';
    add_action( 'plugins_loaded', array( 'Post_Category_Filter', 'get_instance' ) );
}
