<?php
/**
 * Taleem360 Core Theme Functions
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Global Constants
define( 'TALEEM_VERSION', '1.0.0' );
define( 'TALEEM_AUTHOR', 'SaaSSkul' );
define( 'TALEEM_SAASSKUL_URL', 'https://saasskul.com' );

/**
 * Theme Setup
 */
function taleem360_setup() {
    add_theme_support( 'title-tag' );
    add_theme_support( 'post-thumbnails' );
    add_theme_support( 'html5', array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption' ) );
    add_theme_support( 'custom-logo' );

    register_nav_menus( array(
        'primary-menu' => esc_html__( 'Primary Menu', 'taleem360-core' ),
    ) );
}
add_action( 'after_setup_theme', 'taleem360_setup' );

/**
 * Enqueue Scripts and Styles
 */
function taleem360_scripts() {
    // Fonts
    wp_enqueue_style( 'taleem-fonts', 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;700;800&display=swap', array(), null );
    
    // Main Stylesheet
    wp_enqueue_style( 'taleem-style', get_stylesheet_uri(), array(), TALEEM_VERSION );

    // Custom JS for header behavior
    wp_add_inline_script( 'jquery', "
        jQuery(window).scroll(function() {
            if (jQuery(this).scrollTop() > 50) {
                jQuery('.taleem-header').addClass('scrolled');
            } else {
                jQuery('.taleem-header').removeClass('scrolled');
            }
        });
    " );
}
add_action( 'wp_enqueue_scripts', 'taleem360_scripts' );

/**
 * Theme Customizer Integration
 */
function taleem360_customize_register( $wp_customize ) {
    // Header Section
    $wp_customize->add_section( 'taleem_header_section', array(
        'title'    => __( 'Header Customization', 'taleem360-core' ),
        'priority' => 30,
    ) );

    $wp_customize->add_setting( 'taleem_header_bg_color', array(
        'default'   => '#0c1e3d',
        'transport' => 'refresh',
    ) );

    $wp_customize->add_control( new WP_Customize_Color_Control( $wp_customize, 'taleem_header_bg_color', array(
        'label'    => __( 'Scrolled Header Background', 'taleem360-core' ),
        'section'  => 'taleem_header_section',
        'settings' => 'taleem_header_bg_color',
    ) ) );

    // Footer Section
    $wp_customize->add_section( 'taleem_footer_section', array(
        'title'    => __( 'Footer Customization', 'taleem360-core' ),
        'priority' => 35,
    ) );

    $wp_customize->add_setting( 'taleem_footer_copy', array(
        'default'   => 'Empowering AI Enthusiasts in Pakistan.',
        'transport' => 'refresh',
    ) );

    $wp_customize->add_control( 'taleem_footer_copy', array(
        'label'    => __( 'Footer Credits', 'taleem360-core' ),
        'section'  => 'taleem_footer_section',
        'type'     => 'text',
    ) );
}
add_action( 'customize_register', 'taleem360_customize_register' );

/**
 * Pro Status Helper (To be overridden by plugin)
 */
if ( ! function_exists( 'taleem_is_pro_active' ) ) {
    function taleem_is_pro_active() {
        return apply_filters( 'taleem_is_pro_active', false );
    }
}
