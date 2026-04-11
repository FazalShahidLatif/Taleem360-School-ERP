<?php
/**
 * Taleem360 Child Theme Functions
 */

function taleem360_child_enqueue_styles() {
    $parent_handle = 'taleem-style'; 
    $theme = wp_get_theme();
    
    wp_enqueue_style( $parent_handle, get_template_directory_uri() . '/style.css' );
    wp_enqueue_style( 'child-style', get_stylesheet_uri(), array( $parent_handle ), $theme->get('Version') );
}
add_action( 'wp_enqueue_scripts', 'taleem360_child_enqueue_styles' );
