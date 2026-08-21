<?php
/**
 * The template for displaying the footer
 *
 * @package WordPress
 * @subpackage truth-quran
 * @since 1.0.0
 */
?>

<footer class="site-footer bg-[#0e1015]/90 border-t border-[#d9b45c]/15 py-12">
    <div class="footer-container max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        <!-- Left Column: Dynamic Branding Details -->
        <div class="footer-brand md:col-span-4 space-y-4">
            <h3 class="font-sans font-extrabold text-sm tracking-widest uppercase">
                Truth <span class="text-[#d9b45c]">Quran</span> Academy
            </h3>
            <p class="text-xs text-[#c9c2ab] leading-relaxed max-w-sm">
                Empowering Muslims globally to learn tajweed, recitation and hifz from absolute certified native experts inside personal 1-on-1 virtual suites.
            </p>
        </div>

        <!-- Center Column: Direct Helpline Navigation Links -->
        <div class="footer-contacts md:col-span-4 space-y-4">
            <h4 class="text-xs font-sans uppercase font-bold text-[#d9b45c] tracking-widest">Inquiries & Helpline</h4>
            <ul class="space-y-2 text-xs text-[#c9c2ab]">
                <li class="flex items-center space-x-2">
                    <span>Phone:</span>
                    <a href="tel:<?php echo esc_attr( str_replace(' ', '', get_theme_mod( 'truth_quran_phone', '+92 321 9347471' ) ) ); ?>" class="hover:text-white">
                        <?php echo esc_html( get_theme_mod( 'truth_quran_phone', '+92 321 9347471' ) ); ?>
                    </a>
                </li>
                <li class="flex items-center space-x-2">
                    <span>Email:</span>
                    <a href="mailto:<?php echo esc_attr( get_theme_mod( 'truth_quran_email', 'muhammadzain92624@gmail.com' ) ); ?>" class="hover:text-white">
                        <?php echo esc_html( get_theme_mod( 'truth_quran_email', 'muhammadzain92624@gmail.com' ) ); ?>
                    </a>
                </li>
            </ul>
        </div>

        <!-- Right Column: Navigation Links Menu -->
        <div class="footer-links md:col-span-4 space-y-4">
            <h4 class="text-xs font-sans uppercase font-bold text-[#d9b45c] tracking-widest">Quick Navigation</h4>
            <?php
            wp_nav_menu( array(
                'theme_location' => 'footer',
                'container'      => false,
                'menu_class'     => 'footer-menu-links space-y-1.5 text-xs text-[#c9c2ab]',
                'fallback_cb'    => '__return_false',
            ) );
            ?>
        </div>
    </div>

    <!-- Divider Line -->
    <div class="max-w-7xl mx-auto px-6"><div class="h-[1px] bg-[#d9b45c]/10 my-8"></div></div>

    <!-- Copy & Author Signature Block -->
    <div class="footer-bottom max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#c9c2ab]/70">
        <div>
            &copy; <?php echo esc_html( date( 'Y' ) ); ?> Truth Quran Academy. All Rights Reserved.
        </div>
        <div class="developer-credit-tag font-serif italic text-[#d9b45c]">
            Designed & Developed by <span class="font-sans font-bold uppercase tracking-wider text-white text-[10px]"><?php echo esc_html( get_theme_mod( 'truth_quran_developer_name', 'Muhammad Zain' ) ); ?></span>
        </div>
    </div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
