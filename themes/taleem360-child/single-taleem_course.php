<?php
/**
 * Single Course Template
 * Located in Child Theme
 */

get_header(); ?>

<main id="primary" class="site-main">

    <div class="course-header" style="background: var(--primary-color); padding: 100px 0 60px; color: white; text-align: center;">
        <div class="container" style="max-width: 900px; margin: 0 auto; padding: 0 20px;">
            <h1 class="entry-title" style="font-size: 3.5rem; margin-bottom: 20px;"><?php the_title(); ?></h1>
            <div class="course-meta" style="opacity: 0.8; font-size: 1.1rem;">
                <?php echo get_the_term_list( get_the_ID(), 'course_level', 'Level: ', ', ' ); ?>
            </div>
        </div>
    </div>

    <div class="course-content-wrap" style="padding: 80px 0;">
        <div class="container" style="max-width: 800px; margin: 0 auto; padding: 0 20px; line-height: 1.8; font-size: 1.15rem;">
            
            <?php if ( has_post_thumbnail() ) : ?>
                <div class="course-featured-image" style="margin-bottom: 40px; border-radius: 15px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
                    <?php the_post_thumbnail( 'large', array( 'style' => 'width: 100%; height: auto; display: block;' ) ); ?>
                </div>
            <?php endif; ?>

            <div class="entry-content">
                <?php
                while ( have_posts() ) :
                    the_post();
                    the_content();
                endwhile;
                ?>
            </div>

            <!-- Student Tracking Section -->
            <div class="course-tracking" style="margin-top: 60px;">
                <h3 style="margin-bottom: 20px;">Course Progress</h3>
                <?php echo do_shortcode( '[taleem_mark_complete]' ); ?>
            </div>

        </div>
    </div>

</main>

<?php get_footer(); ?>
