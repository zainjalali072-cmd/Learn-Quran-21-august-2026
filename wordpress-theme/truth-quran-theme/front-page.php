<?php
/**
 * The template for displaying the home landing page
 *
 * @package WordPress
 * @subpackage truth-quran
 * @since 1.0.0
 */

get_header(); ?>

<!-- 1. HERO HEADER SECTION -->
<section id="hero" class="relative pt-16 pb-24 md:py-32 overflow-hidden flex items-center min-h-screen">
    <!-- Background Sparkle Blurs -->
    <div class="absolute inset-0 pointer-events-none" style="background: radial-gradient(circle, rgba(217,180,92,0.12) 0%, transparent 65%);"></div>
    
    <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full relative z-10">
        
        <!-- Left: Text & CTAs -->
        <div class="lg:col-span-7 space-y-6 text-left">
            <div class="flex items-center space-x-2">
                <span class="w-1.5 h-1.5 rounded-full bg-[#d9b45c]" style="box-shadow: 0 0 8px #d9b45c;"></span>
                <span class="text-[11px] font-sans uppercase font-bold tracking-[0.2em] text-[#d9b45c]">
                    <?php echo esc_html( get_theme_mod( 'truth_quran_hero_kicker', 'Premium 1-on-1 Online Quranic Academy' ) ); ?>
                </span>
            </div>

            <h1 class="font-serif text-3xl md:text-5xl lg:text-6xl text-[#f3ecd8] font-medium leading-[1.1] tracking-tight">
                <?php echo wp_kses_post( get_theme_mod( 'truth_quran_hero_title', 'Embark on a Spiritual <br />Journey with <span class="text-[#d9b45c] italic font-normal">Divine</span> Precision' ) ); ?>
            </h1>

            <p class="text-xs md:text-sm text-[#c9c2ab] leading-relaxed max-w-xl font-light">
                <?php echo esc_html( get_theme_mod( 'truth_quran_hero_desc', 'Learn Holy Quran recitation, Tajweed, Hifz, and Arabic language from native certified Arab tutors in private 1-on-1 virtual classrooms. Structured curriculums tailored perfectly for children, sisters, and busy professionals.' ) ); ?>
            </p>

            <div class="flex flex-wrap gap-4 pt-4">
                <a href="<?php echo esc_url( get_theme_mod( 'truth_quran_whatsapp', 'https://wa.me/923219347471' ) ); ?>" class="btn-primary-whatsapp uppercase font-sans font-bold tracking-wider text-xs px-6 py-4 rounded-full bg-[#1fae5b] text-white shadow-lg inline-block hover:-translate-y-0.5 transition-transform" target="_blank" rel="noopener noreferrer">
                    <?php echo esc_html( get_theme_mod( 'truth_quran_hero_btn1', 'Book Free Trial Session' ) ); ?>
                </a>
            </div>
        </div>

        <!-- Right: Animated Sacred Quran Layout Emblem (Simulated) -->
        <div class="lg:col-span-5 flex justify-center items-center">
            <div class="emblem-container relative w-80 h-80 md:w-[400px] md:h-[400px]">
                <!-- Outer gold ring border -->
                <div class="absolute inset-0 rounded-full border-4 border-[#d9b45c] shadow-lg flex items-center justify-center">
                    <!-- Elegant inner circular script styling around the center -->
                    <div class="sacred-rotating-text text-[#f2d98a] uppercase font-serif text-[10px] tracking-widest absolute">
                        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ✦ قُلْ هُوَ اللَّهُ أَحَدٌ ✦ اللَّهُ الصَّمَدُ
                    </div>
                </div>
            </div>
        </div>

    </div>
</section>

<!-- 2. COURSES LOOPS (DYNAMIC QURAN PROGRAMS) -->
<section id="courses" class="py-20 md:py-28 border-y border-[#d9b45c]/10 bg-[#0e1015]/40">
    <div class="max-w-7xl mx-auto px-6">
        
        <div class="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span class="text-[12px] font-sans uppercase font-bold tracking-[0.22em] text-[#d9b45c]">
                Curriculums
            </span>
            <h2 class="font-serif text-3xl md:text-4xl text-[#f3ecd8] font-medium tracking-tight">
                Our Structured <span class="text-[#d9b45c] italic font-normal">Quran Programs</span>
            </h2>
        </div>

        <!-- WordPress Dynamic CPT Query Loop -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <?php
            $course_query = new WP_Query( array(
                'post_type'      => 'course',
                'posts_per_page' => 6,
                'orderby'        => 'date',
                'order'          => 'ASC'
            ) );

            if ( $course_query->have_posts() ) :
                while ( $course_query->have_posts() ) : $course_query->the_post();
                    ?>
                    <article class="course-card bg-[#12141b] border border-[#d9b45c]/15 rounded-2xl overflow-hidden hover:border-[#d9b45c]/45 transition-all p-6 space-y-4 flex flex-col justify-between">
                        <div>
                            <?php if ( has_post_thumbnail() ) : ?>
                                <div class="course-featured-image h-40 overflow-hidden rounded-xl mb-4">
                                    <?php the_post_thumbnail( 'medium', array( 'class' => 'w-full h-full object-cover' ) ); ?>
                                </div>
                            <?php endif; ?>
                            
                            <h3 class="font-sans font-bold text-base md:text-lg text-[#f3ecd8]"><?php the_title(); ?></h3>
                            <div class="text-xs text-[#c9c2ab] mt-2 leading-relaxed"><?php the_excerpt(); ?></div>
                        </div>

                        <div class="card-buttons pt-4 grid grid-cols-2 gap-3">
                            <a href="<?php echo esc_url( get_theme_mod( 'truth_quran_whatsapp', 'https://wa.me/923219347471' ) ); ?>" class="btn-enroll-whatsapp text-center text-[10px] uppercase font-sans font-bold py-2.5 rounded-full bg-[#d9b45c] text-black">
                                Enroll
                            </a>
                            <a href="<?php the_permalink(); ?>" class="btn-details-link text-center text-[10px] uppercase font-sans font-bold py-2.5 rounded-full border border-[#d9b45c]/20 text-[#c9c2ab]">
                                Read More
                            </a>
                        </div>
                    </article>
                    <?php
                endwhile;
                wp_reset_postdata();
            else :
                ?>
                <p class="text-xs text-[#c9c2ab] text-center col-span-3">No active programs found. Create your courses inside your WordPress Admin Dashboard under Programs post type.</p>
                <?php
            endif;
            ?>
        </div>

    </div>
</section>

<!-- 3. TESTIMONIALS LOOPS -->
<section id="testimonials" class="py-20 md:py-28">
    <div class="max-w-7xl mx-auto px-6">
        <div class="text-center max-w-2xl mx-auto mb-16">
            <span class="text-[12px] font-sans uppercase font-bold tracking-[0.22em] text-[#d9b45c]">Reviews</span>
            <h2 class="font-serif text-3xl md:text-4xl text-[#f3ecd8] font-medium tracking-tight">What Our Students Say</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <?php
            $review_query = new WP_Query( array(
                'post_type'      => 'testimonial',
                'posts_per_page' => 3
            ) );

            if ( $review_query->have_posts() ) :
                while ( $review_query->have_posts() ) : $review_query->the_post();
                    ?>
                    <div class="testimonial-card bg-[#12141b]/70 border border-[#d9b45c]/10 rounded-2xl p-6">
                        <p class="text-xs md:text-sm text-[#c9c2ab] italic leading-relaxed">"<?php echo esc_html( get_the_content() ); ?>"</p>
                        <div class="border-t border-[#d9b45c]/10 pt-4 mt-4 text-xs font-sans font-bold text-[#f3ecd8]">
                            <?php the_title(); ?>
                        </div>
                    </div>
                    <?php
                endwhile;
                wp_reset_postdata();
            endif;
            ?>
        </div>
    </div>
</section>

<?php get_footer(); ?>
