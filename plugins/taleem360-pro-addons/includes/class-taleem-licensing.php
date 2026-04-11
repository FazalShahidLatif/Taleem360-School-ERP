<?php
/**
 * Taleem360 Licensing Manager
 * Branded for SaaSSkul
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Taleem_Licensing {

	private static $instance;

	const SUPER_ADMIN_EMAIL = 'info@saasskul.com';

	public static function get_instance() {
		if ( ! isset( self::$instance ) ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	public function __construct() {
		add_shortcode( 'taleem_license_status', array( $this, 'display_license_status' ) );
	}

	/**
	 * Check if the current environment has a Pro license
	 */
	public function check_pro_status() {
		$user = wp_get_current_user();
		
		// Priority 1: Super Admin (info@saasskul.com) always has Pro
		if ( $user && $user->user_email === self::SUPER_ADMIN_EMAIL ) {
			return true;
		}

		// Priority 2: Check database for license key
		$license_key = get_option( 'taleem_saasskul_license_key' );
		if ( ! empty( $license_key ) ) {
			// Verification logic: Starts with SAAS-T360-
			if ( strpos( $license_key, 'SAAS-T360-' ) === 0 ) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Status Shortcode
	 */
	public function display_license_status() {
		if ( $this->check_pro_status() ) {
			return '<div class="taleem-license-badge pro">SaaSSkul License Active: Pro Edition</div>';
		}
		return '<div class="taleem-license-badge free">SaaSSkul License: Free Edition</div>';
	}
}
