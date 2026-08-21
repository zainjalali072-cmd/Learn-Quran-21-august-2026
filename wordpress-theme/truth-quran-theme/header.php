<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="profile" href="https://gmpg.org/xfn/11">
    <?php wp_head(); ?>
    <style>
        /* Smooth scrolling, layout colors, and styling rules matching our React designs */
        :root {
            --color-ink: #FAF8F5;
            --color-gold: #d9b45c;
            --color-gold-bright: #f2d98a;
            --bg-dark: #07080b;
        }
        body {
            background-color: var(--bg-dark);
            color: var(--color-ink);
        }
    </style>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<header class="sticky-header">
    <div class="header-container">
        <!-- Site Branding Logo -->
        <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="logo-link flex items-center space-x-2">
            <?php 
            if ( has_custom_logo() ) {
                the_custom_logo();
            } else {
                ?>
                <div class="custom-text-logo">
                    <span class="logo-text-bold">Truth <span class="logo-gold">Quran</span></span>
                    <span class="logo-subtext-italic">Academy</span>
                </div>
                <?php
            }
            ?>
        </a>

        <!-- Desktop Navigation Menu -->
        <nav class="desktop-navigation">
            <?php
            wp_nav_menu( array(
                'theme_location' => 'primary',
                'container'      => false,
                'menu_class'     => 'nav-menu flex space-x-6 uppercase font-sans text-xs font-semibold tracking-wider',
                'fallback_cb'    => '__return_false',
            ) );
            ?>
        </nav>

        <!-- Header CTA Buttons (dynamic WhatsApp Trial link) -->
        <div class="header-cta">
            <a href="<?php echo esc_url( get_theme_mod( 'truth_quran_whatsapp', 'https://wa.me/923219347471' ) ); ?>" class="btn-green-whatsapp" target="_blank" rel="noopener noreferrer">
                <span>Free Evaluation</span>
            </a>
        </div>
    </div>
</header>
