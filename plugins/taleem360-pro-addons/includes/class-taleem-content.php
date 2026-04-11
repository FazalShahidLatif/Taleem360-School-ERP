<?php
/**
 * Taleem360 Content Modules
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Taleem_Content {

	private static $instance;

	public static function get_instance() {
		if ( ! isset( self::$instance ) ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	public function __construct() {
		add_shortcode( 'taleem_ai_guide', array( $this, 'render_ai_guide' ) );
	}

	public function render_ai_guide( $atts ) {
		$atts = shortcode_atts( array(
			'type' => 'notebooklm',
		), $atts );

		if ( $atts['type'] === 'notebooklm' ) {
			return $this->get_notebooklm_guide();
		}

		return '';
	}

	private function get_notebooklm_guide() {
		return '
		<div class="taleem-guide-card" style="background: #fff; border-left: 5px solid var(--accent-color); padding: 30px; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
			<h3 style="margin-top:0;">Mastering Graphic Novels with NotebookLM</h3>
			<p>Learn how to use AI to transform complex information into engaging graphic novels. Ideal for "Dual-Coding" and visual learners.</p>
			
			<h4 style="color: var(--primary-color);">Step 1: The Core Source</h4>
			<p>Upload your research documents to NotebookLM to create a grounded knowledge base.</p>
			
			<h4 style="color: var(--primary-color);">Step 2: Scripting with Gemini</h4>
			<p>Use Gemini to generate a bilingual (English/Urdu) script based on the NotebookLM summary.</p>
			
			<h4 style="color: var(--primary-color);">Step 3: Visual Generation</h4>
			<p>Translate your script scenes into visual prompts for AI image generators, maintaining consistency for your characters.</p>
			
			<div style="margin-top:20px; padding-top:20px; border-top: 1px solid #eee;">
				<a href="https://saasskul.com" target="_blank" style="background: var(--primary-color); color: white; padding: 10px 25px; border-radius: 5px; text-decoration: none; font-weight: 600;">Download Full Curriculum (PDF)</a>
			</div>
		</div>';
	}
}
