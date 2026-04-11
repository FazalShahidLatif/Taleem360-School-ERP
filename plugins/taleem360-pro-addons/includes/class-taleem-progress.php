<?php
/**
 * Taleem360 Course Progress Manager
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Taleem_Progress {

	private static $instance;

	public static function get_instance() {
		if ( ! isset( self::$instance ) ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	public function __construct() {
		add_action( 'wp_ajax_taleem_mark_complete', array( $this, 'ajax_mark_complete' ) );
		add_shortcode( 'taleem_mark_complete', array( $this, 'render_complete_button' ) );
	}

	/**
	 * AJAX Handler for marking a course complete
	 */
	public function ajax_mark_complete() {
		check_ajax_referer( 'taleem_progress_nonce', 'security' );

		if ( ! is_user_logged_in() ) {
			wp_send_json_error( array( 'message' => 'Please login to track progress.' ) );
		}

		$course_id = isset( $_POST['course_id'] ) ? intval( $_POST['course_id'] ) : 0;
		$user_id   = get_current_user_id();

		if ( ! $course_id ) {
			wp_send_json_error( array( 'message' => 'Invalid Course ID.' ) );
		}

		$completed = get_user_meta( $user_id, 'taleem_completed_courses', true );
		if ( ! is_array( $completed ) ) {
			$completed = array();
		}

		if ( ! in_array( $course_id, $completed ) ) {
			$completed[] = $course_id;
			update_user_meta( $user_id, 'taleem_completed_courses', $completed );
			wp_send_json_success( array( 'message' => 'Course marked as complete!' ) );
		} else {
			wp_send_json_success( array( 'message' => 'Course already completed.' ) );
		}
	}

	/**
	 * Render the Mark as Complete button
	 */
	public function render_complete_button( $atts ) {
		if ( ! is_user_logged_in() ) {
			return '<p><a href="' . wp_login_url() . '">Login</a> to track your learning progress.</p>';
		}

		$course_id = get_the_ID();
		if ( ! $course_id ) return '';

		$user_id   = get_current_user_id();
		$completed = get_user_meta( $user_id, 'taleem_completed_courses', true );
		$is_done   = is_array( $completed ) && in_array( $course_id, $completed );

		$nonce = wp_create_nonce( 'taleem_progress_nonce' );

		ob_start();
		?>
		<div class="taleem-progress-container" style="margin-top: 40px; padding: 20px; border-top: 1px solid #eee;">
			<button id="taleem-complete-btn" 
					data-course-id="<?php echo $course_id; ?>" 
					data-nonce="<?php echo $nonce; ?>"
					style="background: <?php echo $is_done ? '#4caf50' : 'var(--primary-color)'; ?>; color: white; border: none; padding: 12px 30px; border-radius: 5px; cursor: pointer; font-weight: 700;"
					<?php disabled( $is_done ); ?>>
				<?php echo $is_done ? '<span class="dashicons dashicons-yes"></span> Finished' : 'Mark as Complete'; ?>
			</button>
		</div>

		<script>
		jQuery(document).ready(function($) {
			$('#taleem-complete-btn').on('click', function() {
				var btn = $(this);
				var course_id = btn.data('course-id');
				var nonce = btn.data('nonce');

				btn.text('Processing...').prop('disabled', true);

				$.ajax({
					url: '<?php echo admin_url( 'admin-ajax.php' ); ?>',
					type: 'POST',
					data: {
						action: 'taleem_mark_complete',
						course_id: course_id,
						security: nonce
					},
					success: function(response) {
						if (response.success) {
							btn.text('Finished').css('background', '#4caf50');
						} else {
							alert(response.data.message);
							btn.text('Mark as Complete').prop('disabled', false);
						}
					}
				});
			});
		});
		</script>
		<?php
		return ob_get_clean();
	}
}
