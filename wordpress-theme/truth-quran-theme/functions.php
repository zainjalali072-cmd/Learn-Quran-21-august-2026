<?php
/**
 * Truth Quran Academy functions and definitions
 *
 * @package WordPress
 * @subpackage truth-quran
 * @since 1.0.0
 */

// 1. Theme Setup and Support
if ( ! function_exists( 'truth_quran_setup' ) ) :
    function truth_quran_setup() {
        // Add default posts and comments RSS feed links to head.
        add_theme_support( 'automatic-feed-links' );

        // Let WordPress manage the document title dynamically.
        add_theme_support( 'title-tag' );

        // Enable support for Post Thumbnails on posts and pages.
        add_theme_support( 'post-thumbnails' );

        // Register Primary and Footer Nav Menus
        register_nav_menus( array(
            'primary' => esc_html__( 'Primary Navigation Menu', 'truth-quran' ),
            'footer'  => esc_html__( 'Footer Quick Links Menu', 'truth-quran' ),
        ) );

        // Switch default core markup for search form, comment form, and comments to output valid HTML5.
        add_theme_support( 'html5', array(
            'search-form',
            'comment-form',
            'comment-list',
            'gallery',
            'caption',
            'style',
            'script',
        ) );

        // Add support for custom logo
        add_theme_support( 'custom-logo', array(
            'height'      => 120,
            'width'       => 120,
            'flex-height' => true,
            'flex-width'  => true,
        ) );
    }
endif;
add_action( 'after_setup_theme', 'truth_quran_setup' );

// 2. Enqueue Custom Scripts and Google Fonts
function truth_quran_scripts() {
    // Load elegant luxury fonts
    wp_enqueue_style( 'truth-quran-fonts', 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Noto+Naskh+Arabic:wght@500;700&family=Inter:wght@300;400;600;700&display=swap', array(), null );

    // Enqueue primary stylesheet
    wp_enqueue_style( 'truth-quran-style', get_stylesheet_uri(), array(), '1.0.0' );

    // Inline Tailwind configuration and styling script for modular deployment (or custom build target)
    wp_add_inline_style( 'truth-quran-style', '/* Theme styles will be generated here */' );
}
add_action( 'wp_enqueue_scripts', 'truth_quran_scripts' );

// 3. Register Custom Post Types (Courses & Testimonials)
function truth_quran_register_cpts() {
    // Courses Post Type
    register_post_type( 'course', array(
        'labels'      => array(
            'name'          => __( 'Courses', 'truth-quran' ),
            'singular_name' => __( 'Course', 'truth-quran' ),
            'add_new_item'  => __( 'Add New Course Program', 'truth-quran' ),
            'edit_item'     => __( 'Edit Course', 'truth-quran' ),
        ),
        'public'      => true,
        'has_archive' => true,
        'supports'    => array( 'title', 'editor', 'thumbnail', 'excerpt' ),
        'menu_icon'   => 'dashicons-welcome-learn-more',
        'rewrite'     => array( 'slug' => 'programs' ),
    ) );

    // Testimonials Post Type
    register_post_type( 'testimonial', array(
        'labels'      => array(
            'name'          => __( 'Testimonials', 'truth-quran' ),
            'singular_name' => __( 'Testimonial', 'truth-quran' ),
            'add_new_item'  => __( 'Add New Student Review', 'truth-quran' ),
        ),
        'public'      => true,
        'supports'    => array( 'title', 'editor' ),
        'menu_icon'   => 'dashicons-testimonial',
    ) );
}
add_action( 'init', 'truth_quran_register_cpts' );

// 4. Customizer API for Direct Section Management (No Hardcoded Values)
function truth_quran_customize_register( $wp_customize ) {
    
    // SECTION: HEADER & GENERAL CONTACTS
    $wp_customize->add_section( 'truth_quran_contact_section', array(
        'title'    => __( 'Academy Contact & WhatsApp Options', 'truth-quran' ),
        'priority' => 30,
    ) );
    
    $wp_customize->add_setting( 'truth_quran_phone', array( 'default' => '+92 321 9347471', 'sanitize_callback' => 'sanitize_text_field' ) );
    $wp_customize->add_control( 'truth_quran_phone', array( 'label' => __( 'Helpline Phone Number', 'truth-quran' ), 'section' => 'truth_quran_contact_section', 'type' => 'text' ) );

    $wp_customize->add_setting( 'truth_quran_email', array( 'default' => 'muhammadzain92624@gmail.com', 'sanitize_callback' => 'sanitize_email' ) );
    $wp_customize->add_control( 'truth_quran_email', array( 'label' => __( 'Official Inquiry Email', 'truth-quran' ), 'section' => 'truth_quran_contact_section', 'type' => 'text' ) );

    $wp_customize->add_setting( 'truth_quran_whatsapp', array( 'default' => 'https://wa.me/923219347471', 'sanitize_callback' => 'esc_url_raw' ) );
    $wp_customize->add_control( 'truth_quran_whatsapp', array( 'label' => __( 'WhatsApp Call/Msg Link', 'truth-quran' ), 'section' => 'truth_quran_contact_section', 'type' => 'url' ) );

    // SECTION: HERO SECTION CUSTOMIZER
    $wp_customize->add_section( 'truth_quran_hero_section', array(
        'title'    => __( 'Academy Hero Header Section', 'truth-quran' ),
        'priority' => 40,
    ) );

    $wp_customize->add_setting( 'truth_quran_hero_kicker', array( 'default' => 'Premium 1-on-1 Online Quranic Academy', 'sanitize_callback' => 'sanitize_text_field' ) );
    $wp_customize->add_control( 'truth_quran_hero_kicker', array( 'label' => __( 'Hero Eyebrow Kicker Text', 'truth-quran' ), 'section' => 'truth_quran_hero_section', 'type' => 'text' ) );

    $wp_customize->add_setting( 'truth_quran_hero_title', array( 'default' => 'Embark on a Spiritual Journey with Divine Precision', 'sanitize_callback' => 'wp_kses_post' ) );
    $wp_customize->add_control( 'truth_quran_hero_title', array( 'label' => __( 'Main Heading', 'truth-quran' ), 'section' => 'truth_quran_hero_section', 'type' => 'textarea' ) );

    $wp_customize->add_setting( 'truth_quran_hero_desc', array( 'default' => 'Learn Holy Quran recitation from native certified Arab tutors in private 1-on-1 classrooms.', 'sanitize_callback' => 'sanitize_text_field' ) );
    $wp_customize->add_control( 'truth_quran_hero_desc', array( 'label' => __( 'Subheading Description', 'truth-quran' ), 'section' => 'truth_quran_hero_section', 'type' => 'textarea' ) );

    $wp_customize->add_setting( 'truth_quran_hero_btn1', array( 'default' => 'Book Free Trial Session', 'sanitize_callback' => 'sanitize_text_field' ) );
    $wp_customize->add_control( 'truth_quran_hero_btn1', array( 'label' => __( 'Primary Action Text (Green)', 'truth-quran' ), 'section' => 'truth_quran_hero_section', 'type' => 'text' ) );

    // SECTION: DEVELOPER CREDENTIAL / AUTHOR SIGNATURE
    $wp_customize->add_section( 'truth_quran_developer_section', array(
        'title'    => __( 'Developer / Lead Architect Section', 'truth-quran' ),
        'priority' => 50,
    ) );

    $wp_customize->add_setting( 'truth_quran_developer_name', array( 'default' => 'Muhammad Zain', 'sanitize_callback' => 'sanitize_text_field' ) );
    $wp_customize->add_control( 'truth_quran_developer_name', array( 'label' => __( 'Developer Name', 'truth-quran' ), 'section' => 'truth_quran_developer_section', 'type' => 'text' ) );

    $wp_customize->add_setting( 'truth_quran_developer_role', array( 'default' => 'Lead Architect', 'sanitize_callback' => 'sanitize_text_field' ) );
    $wp_customize->add_control( 'truth_quran_developer_role', array( 'label' => __( 'Developer Role Tag', 'truth-quran' ), 'section' => 'truth_quran_developer_section', 'type' => 'text' ) );
}
add_action( 'customize_register', 'truth_quran_customize_register' );

// 5. Explicit Support Announcement for Rank Math Pro
// This ensures sitemaps, schemas, redirections, and social graphs are active on CPTs and frontpages
add_theme_support( 'rank-math-breadcrumbs' );

add_filter( 'rank_math/frontend/breadcrumb/settings', function( $settings ) {
    $settings['separator'] = ' ✦ ';
    return $settings;
} );
