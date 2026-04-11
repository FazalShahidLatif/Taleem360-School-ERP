<?php
/**
 * Taleem360 Settings & Dashboard
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Taleem_Settings {

	private static $instance;

	public static function get_instance() {
		if ( ! isset( self::$instance ) ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	public function __construct() {
		add_action( 'admin_menu', array( $this, 'add_admin_menu' ) );
		add_action( 'admin_init', array( $this, 'register_settings' ) );
	}

	public function add_admin_menu() {
		add_menu_page(
			'Taleem360 AI',
			'Taleem360',
			'manage_options',
			'taleem360-settings',
			array( $this, 'render_settings_page' ),
			'dashicons-brain',
			30
		);
	}

	public function register_settings() {
		register_setting( 'taleem360-settings-group', 'taleem_saasskul_license_key' );
		register_setting( 'taleem360-settings-group', 'taleem_community_module_enabled' );
	}

	public function render_settings_page() {
		?>
		<div class="wrap taleem-settings-wrap">
			<h1>Taleem360-AI Learning Dashboard</h1>
            <p>Empowering Pakistan through AI. Maintained by <a href="https://saasskul.com" target="_blank">SaaSSkul Digital Marketplace</a>.</p>

			<form method="post" action="options.php" style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); max-width: 800px;">
				<?php settings_fields( 'taleem360-settings-group' ); ?>
				<?php do_settings_sections( 'taleem360-settings-group' ); ?>

				<table class="form-table">
					<tr valign="top">
						<th scope="row">SaaSSkul License Key</th>
						<td>
                            <input type="text" name="taleem_saasskul_license_key" value="<?php echo esc_attr( get_option( 'taleem_saasskul_license_key' ) ); ?>" class="regular-text" placeholder="SAAS-T360-XXXX" />
                            <p class="description">Enter your license key to unlock Pro features and community modules.</p>
                        </td>
					</tr>
					
					<tr valign="top">
						<th scope="row">Community Modules</th>
						<td>
							<input type="checkbox" name="taleem_community_module_enabled" value="1" <?php checked( 1, get_option( 'taleem_community_module_enabled' ), true ); ?> />
							Enable community-driven earning resources (Beta).
						</td>
					</tr>
				</table>

				<?php submit_button( 'Save Ecosystem Settings' ); ?>
			</form>

            <!-- Comparison Table -->
            <div class="taleem-comparison-wrap" style="margin-top: 50px; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); max-width: 800px;">
                <h2 style="margin-top:0;">Ecosystem Tiers (SaaSSkul Standard)</h2>
                <p>Unlock the full power of Taleem360 with a SaaSSkul license.</p>

                <table class="wp-list-table widefat fixed striped" style="margin-top:20px;">
                    <thead>
                        <tr>
                            <th>Feature</th>
                            <th>Free Edition</th>
                            <th>Pro Edition</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Customizer Access</strong></td>
                            <td>Partial (Colors Only)</td>
                            <td>Full (Images & Content)</td>
                        </tr>
                        <tr>
                            <td><strong>AI Curriculum Modules</strong></td>
                            <td>1 Module (NotebookLM)</td>
                            <td>Unlimited AI Modules</td>
                        </tr>
                        <tr>
                            <td><strong>Community Earning Tools</strong></td>
                            <td><span class="dashicons dashicons-no"></span></td>
                            <td><span class="dashicons dashicons-yes" style="color:green;"></span> Enabled</td>
                        </tr>
                        <tr>
                            <td><strong>White Label Branding</strong></td>
                            <td><span class="dashicons dashicons-no"></span></td>
                            <td><span class="dashicons dashicons-yes" style="color:green;"></span> Enabled</td>
                        </tr>
                    </tbody>
                </table>
                
                <?php if ( ! Taleem_Licensing::get_instance()->check_pro_status() ) : ?>
                    <div style="margin-top:20px; background: #fff8e5; padding: 15px; border-left: 4px solid #ffcc00;">
                        <p><strong>Heads up!</strong> You are currently on the Free Edition. <a href="https://saasskul.com" target="_blank">Upgrade to SaaSSkul Pro</a> to unlock all modules.</p>
                    </div>
                <?php endif; ?>
            </div>
            
            <div class="taleem-admin-footer" style="margin-top: 40px; border-top: 1px solid #ddd; padding-top: 20px;">
                <img src="https://saasskul.com/wp-content/uploads/2026/01/saasskul-logo-dark.png" alt="SaaSSkul Logo" style="height: 30px; opacity: 0.5;">
                <p style="font-size: 0.9rem; color: #777;">&copy; <?php echo date('Y'); ?> SaaSSkul Digital Ecosystem. All Rights Reserved.</p>
            </div>
		</div>
		<?php
	}
}
