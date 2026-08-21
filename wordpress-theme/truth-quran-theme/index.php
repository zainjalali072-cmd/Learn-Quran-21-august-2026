<?php
/**
 * The main template file for standard blog listing page
 *
 * @package WordPress
 * @subpackage truth-quran
 * @since 1.0.0
 */

get_header(); ?>

<main class="max-w-7xl mx-auto px-6 py-20">
    
    <!-- Title Area -->
    <div class="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <span class="text-[12px] font-sans uppercase font-bold tracking-[0.22em] text-[#d9b45c]">
            Education & Insights
        </span>
        <h1 class="font-serif text-3xl md:text-5xl text-[#f3ecd8] font-medium tracking-tight">
            The Academy <span className="text-[#d9b45c] italic font-normal">Insights Blog</span>
        </h1>
        <p class="text-xs md:text-sm text-[#c9c2ab] leading-relaxed">
            Read professional guide articles on Tajweed mechanics, traditional Hifz strategies, and classical Arabic linguistic studies.
        </p>
    </div>

    <!-- Blog Posts Dynamic Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <?php
        if ( have_posts() ) :
            while ( have_posts() ) : the_post();
                ?>
                <article id="post-<?php the_ID(); ?>" <?php post_class( 'blog-card bg-[#12141b] border border-[#d9b45c]/15 rounded-2xl overflow-hidden hover:border-[#d9b45c]/45 transition-all duration-300 flex flex-col justify-between' ); ?>>
                    
                    <div class="p-6 space-y-4">
                        <!-- Featured Image -->
                        <?php if ( has_post_thumbnail() ) : ?>
                            <div class="blog-cover h-48 overflow-hidden rounded-xl bg-black relative">
                                <?php the_post_thumbnail( 'large', array( 'class' => 'w-full h-full object-cover opacity-75' ) ); ?>
                            </div>
                        <?php endif; ?>

                        <!-- Meta: Category, Date -->
                        <div class="flex items-center justify-between text-[10px] uppercase font-sans tracking-widest text-[#d9b45c]">
                            <span><?php the_category( ', ' ); ?></span>
                            <span><?php echo esc_html( get_the_date() ); ?></span>
                        </div>

                        <!-- Title -->
                        <h2 class="font-serif text-lg md:text-xl text-[#f3ecd8] hover:text-[#f2d98a] transition-colors font-medium">
                            <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                        </h2>

                        <!-- Excerpt -->
                        <div class="text-xs text-[#c9c2ab] leading-relaxed">
                            <?php the_excerpt(); ?>
                        </div>
                    </div>

                    <!-- Author Meta Bar -->
                    <div class="p-6 border-t border-[#d9b45c]/10 flex items-center justify-between text-xs">
                        <div class="author-details flex items-center space-x-2">
                            <span class="text-[#f3ecd8] font-bold"><?php the_author(); ?></span>
                        </div>
                        <a href="<?php the_permalink(); ?>" class="text-[#d9b45c] font-bold hover:underline">Read More ✦</a>
                    </div>

                </article>
                <?php
            endwhile;

            // Pagination Controls
            ?>
            <div class="pagination-container col-span-1 md:col-span-3 pt-12 text-center text-xs text-[#c9c2ab]">
                <?php
                echo paginate_links( array(
                    'prev_text' => __( '« Previous', 'truth-quran' ),
                    'next_text' => __( 'Next »', 'truth-quran' ),
                ) );
                ?>
            </div>
            <?php

        else :
            ?>
            <p class="text-xs text-[#c9c2ab] text-center col-span-3">No academy guide posts found. Publish some articles from your WordPress Dashboard under Posts.</p>
            <?php
        endif;
        ?>
    </div>

</main>

<?php get_footer(); ?>
