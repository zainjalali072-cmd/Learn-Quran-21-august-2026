<?php
/**
 * The template for displaying all single posts
 *
 * @package WordPress
 * @subpackage truth-quran
 * @since 1.0.0
 */

get_header(); ?>

<main class="max-w-4xl mx-auto px-6 py-16 md:py-24 space-y-8">

    <?php
    if ( have_posts() ) :
        while ( have_posts() ) : the_post();
            ?>
            <!-- 1. Breadcrumbs integrated with Rank Math Pro -->
            <?php if ( function_exists('rank_math_the_breadcrumbs') ) : ?>
                <div class="rank-math-breadcrumbs text-xs font-sans text-[#d9b45c]/70 tracking-wide mb-6">
                    <?php rank_math_the_breadcrumbs(); ?>
                </div>
            <?php endif; ?>

            <article id="post-<?php the_ID(); ?>" <?php post_class( 'single-article-content space-y-8 text-left' ); ?>>
                
                <!-- Category and Title Header -->
                <div class="space-y-4">
                    <div class="flex items-center space-x-3 text-xs uppercase tracking-widest text-[#d9b45c]">
                        <span><?php the_category(', '); ?></span>
                        <span>•</span>
                        <span><?php echo esc_html( get_the_date() ); ?></span>
                    </div>

                    <h1 class="font-serif text-3xl md:text-5xl text-[#f3ecd8] font-bold leading-tight">
                        <?php the_title(); ?>
                    </h1>

                    <!-- Author Meta Bar -->
                    <div class="flex items-center space-x-3 py-2 border-y border-[#d9b45c]/10 text-xs text-[#c9c2ab]">
                        <span>Written By: <strong class="text-[#f3ecd8]"><?php the_author(); ?></strong></span>
                    </div>
                </div>

                <!-- Featured Cover Image -->
                <?php if ( has_post_thumbnail() ) : ?>
                    <div class="article-featured-image w-full rounded-2xl overflow-hidden shadow-lg border border-[#d9b45c]/10">
                        <?php the_post_thumbnail( 'large', array( 'class' => 'w-full object-cover' ) ); ?>
                    </div>
                <?php endif; ?>

                <!-- Primary Content Body -->
                <div class="prose prose-invert max-w-none text-[#c9c2ab] leading-relaxed text-sm md:text-base space-y-6">
                    <?php the_content(); ?>
                </div>

                <!-- Tags Row -->
                <?php if ( has_tag() ) : ?>
                    <div class="tags-container pt-6 border-t border-[#d9b45c]/10 text-xs">
                        <span class="text-[#d9b45c] font-bold">Tags: </span>
                        <?php the_tags( '<span class="tag-pill px-2.5 py-1 rounded bg-[#12141b]/80 border border-[#d9b45c]/10 text-[#c9c2ab] mr-1.5 inline-block">', '</span><span class="tag-pill px-2.5 py-1 rounded bg-[#12141b]/80 border border-[#d9b45c]/10 text-[#c9c2ab] mr-1.5 inline-block">', '</span>' ); ?>
                    </div>
                <?php endif; ?>

                <!-- Comments Area (WordPress native template) -->
                <?php
                if ( comments_open() || get_comments_number() ) :
                    comments_template();
                endif;
                ?>

            </article>
            <?php
        endwhile;
    endif;
    ?>

</main>

<?php get_footer(); ?>
