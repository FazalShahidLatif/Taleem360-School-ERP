<?php
/**
 * Taleem360 Course Custom Post Type
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Taleem_Course {

	private static $instance;

	public static function get_instance() {
		if ( ! isset( self::$instance ) ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	public function __construct() {
		add_action( 'init', array( $this, 'register_cpt' ) );
		add_filter( 'template_include', array( $this, 'course_template_include' ) );
	}

	/**
	 * Register Course Custom Post Type and Taxonomies
	 */
	public function register_cpt() {
		$labels = array(
			'name'               => _x( 'Courses', 'post type general name', 'taleem360-pro' ),
			'singular_name'      => _x( 'Course', 'post type singular name', 'taleem360-pro' ),
			'menu_name'          => _x( 'Courses', 'admin menu', 'taleem360-pro' ),
			'name_admin_bar'     => _x( 'Course', 'add new on admin bar', 'taleem360-pro' ),
			'add_new'            => _x( 'Add New', 'course', 'taleem360-pro' ),
			'add_new_item'       => __( 'Add New Course', 'taleem360-pro' ),
			'new_item'           => __( 'New Course', 'taleem360-pro' ),
			'edit_item'          => __( 'Edit Course', 'taleem360-pro' ),
			'view_item'          => __( 'View Course', 'taleem360-pro' ),
			'all_items'          => __( 'All Courses', 'taleem360-pro' ),
			'search_items'       => __( 'Search Courses', 'taleem360-pro' ),
			'not_found'          => __( 'No courses found.', 'taleem360-pro' ),
		);

		$args = array(
			'labels'             => $labels,
			'public'             => true,
			'publicly_queryable' => true,
			'show_ui'            => true,
			'show_in_menu'       => 'taleem360-settings',
			'query_var'          => true,
			'rewrite'            => array( 'slug' => 'course' ),
			'capability_type'    => 'post',
			'has_archive'        => true,
			'hierarchical'       => false,
			'menu_position'      => null,
			'supports'           => array( 'title', 'editor', 'author', 'thumbnail', 'excerpt', 'comments' ),
			'show_in_rest'       => true,
		);

		register_post_type( 'taleem_course', $args );

		// Register Level Taxonomy
		register_taxonomy( 'course_level', 'taleem_course', array(
			'label'        => __( 'Levels', 'taleem360-pro' ),
			'rewrite'      => array( 'slug' => 'course-level' ),
			'hierarchical' => true,
			'show_in_rest' => true,
		) );
	}

	/**
	 * Template Include logic for Course pages
	 */
	public function course_template_include( $template ) {
		if ( is_singular( 'taleem_course' ) ) {
			// Logic to load custom template if needed
		}
		return $template;
	}
}
