<?php
/**
 * Plugin Name: Taleem360 Pro Addons
 * Plugin URI: https://taleem360.online
 * Description: Advanced AI modules and core settings for the Taleem360-AI Learning ecosystem. Branded and Licensed by SaaSSkul.
 * Version: 1.0.0
 * Author: SaaSSkul
 * Author URI: https://saasskul.com
 * License: GPL2
 * Text Domain: taleem360-pro
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Define Constants
define( 'TALEEM_PRO_VERSION', '1.0.0' );
define( 'TALEEM_PRO_PATH', plugin_dir_path( __FILE__ ) );
define( 'TALEEM_PRO_URL', plugin_dir_url( __FILE__ ) );

/**
 * Initialize Plugin
 */
require_once TALEEM_PRO_PATH . 'includes/class-taleem-licensing.php';
require_once TALEEM_PRO_PATH . 'includes/class-taleem-settings.php';
require_once TALEEM_PRO_PATH . 'includes/class-taleem-content.php';
require_once TALEEM_PRO_PATH . 'includes/class-taleem-course.php';
require_once TALEEM_PRO_PATH . 'includes/class-taleem-progress.php';

class Taleem360_Pro {

    public function __construct() {
        add_action( 'init', array( $this, 'init' ) );
        add_filter( 'taleem_is_pro_active', array( $this, 'is_pro_active' ) );
    }

    public function init() {
        Taleem_Licensing::get_instance();
        Taleem_Settings::get_instance();
        Taleem_Content::get_instance();
        Taleem_Course::get_instance();
        Taleem_Progress::get_instance();
    }

    /**
     * Bridge function for the theme to check Pro status
     */
    public function is_pro_active() {
        return Taleem_Licensing::get_instance()->check_pro_status();
    }
}

new Taleem360_Pro();
