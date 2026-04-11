<?php
/**
 * Taleem360 Front Page Template
 */

get_header(); ?>

<main id="primary" class="site-main">

    <!-- Hero Section -->
    <section class="hero-section" style="background-image: url('<?php echo get_template_directory_uri(); ?>/assets/images/hero_bg.png');">
        <div class="hero-overlay"></div>
        <div class="hero-content">
            <h2 class="hero-title">Elevating Pakistan Through AI</h2>
            <p class="hero-description">The ultimate destination for AI enthusiasts, students, and community leaders. From the classroom to the marketplace, we build a smarter future together.</p>
            <div class="hero-cta">
                <a href="#features" class="btn-primary" style="background: var(--gold-accent); color: var(--primary-color); padding: 15px 40px; border-radius: 50px; text-decoration: none; font-weight: 800; text-transform: uppercase;">Explore AI Ecosystem</a>
            </div>
        </div>
    </section>

    <!-- Features Section -->
    <div id="features" class="features-wrapper">
        
        <!-- Feature 1: Academic -->
        <section class="feature-section">
            <div class="feature-container">
                <div class="feature-image">
                    <img src="<?php echo get_template_directory_uri(); ?>/assets/images/academic.png" alt="AI Academic Excellence Pakistan" style="width: 100%; display: block;">
                </div>
                <div class="feature-content">
                    <span class="feature-tag" style="background: var(--accent-color); color: var(--primary-color); padding: 5px 15px; border-radius: 20px; font-size: 0.8rem; font-weight: 700; text-transform: uppercase;">Academic Excellence</span>
                    <h3 class="feature-title">Next-Gen AI Curriculum</h3>
                    <p>Designed for the new 10th Class Computer Science syllabus, our modules make AI accessible, ethical, and practical. We prepare students not just for exams, but for the future global workforce.</p>
                    <a href="#" class="learn-more" style="color: var(--accent-color); font-weight: 700; text-decoration: none;">View Course Material &rarr;</a>
                </div>
            </div>
        </section>

        <!-- Feature 2: Economics (Alternating) -->
        <section class="feature-section" style="background: #f9f9f9;">
            <div class="feature-container">
                <div class="feature-image">
                    <img src="<?php echo get_template_directory_uri(); ?>/assets/images/freelancing.png" alt="AI Economic Empowerment" style="width: 100%; display: block;">
                </div>
                <div class="feature-content">
                    <span class="feature-tag" style="background: var(--gold-accent); color: var(--primary-color); padding: 5px 15px; border-radius: 20px; font-size: 0.8rem; font-weight: 700; text-transform: uppercase;">Economic Growth</span>
                    <h3 class="feature-title">Earning Through AI</h3>
                    <p>Fighting poverty through technology. We teach AI-driven freelancing, prompt engineering, and visual design. Transform your skills into a sustainable earning resource in the global digital marketplace.</p>
                    <a href="#" class="learn-more" style="color: var(--primary-color); font-weight: 700; text-decoration: none;">Start Earning with AI &rarr;</a>
                </div>
            </div>
        </section>

        <!-- Feature 3: Community -->
        <section class="feature-section">
            <div class="feature-container">
                <div class="feature-image">
                    <img src="<?php echo get_template_directory_uri(); ?>/assets/images/community.png" alt="AI Community Uplift" style="width: 100%; display: block;">
                </div>
                <div class="feature-content">
                    <span class="feature-tag" style="background: var(--primary-color); color: white; padding: 5px 15px; border-radius: 20px; font-size: 0.8rem; font-weight: 700; text-transform: uppercase;">Community Uplift</span>
                    <h3 class="feature-title">AI for Social Impact</h3>
                    <p>Empowering local communities to solve their own challenges. Our "AI enthusiasts" hub provides tools for community leaders to implement practical AI solutions across all spheres of life in Pakistan.</p>
                    <a href="#" class="learn-more" style="color: var(--accent-color); font-weight: 700; text-decoration: none;">Join the Community &rarr;</a>
                </div>
            </div>
        </section>

    </div>

</main><!-- #primary -->

<?php get_footer(); ?>
