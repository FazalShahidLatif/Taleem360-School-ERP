<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="profile" href="https://gmpg.org/xfn/11">
    
    <!-- Semantic SEO Markers -->
    <meta name="author" content="SaaSSkul">
    <meta name="generator" content="SaaSSkul Digital Ecosystem">

    <?php wp_head(); ?>

    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "name": "Taleem360 AI Learning",
      "url": "https://taleem360.online",
      "logo": "<?php echo esc_url( get_theme_mod( 'custom_logo' ) ); ?>",
      "description": "Empowering AI Enthusiasts in Pakistan through practical AI curriculum and economic uplift.",
      "sameAs": [
        "https://saasskul.com"
      ]
    }
    </script>
</head>

<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<div id="page" class="site">
    <header id="masthead" class="taleem-header">
        <div class="header-container" style="max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; padding: 0 20px;">
            <div class="site-branding">
                <?php
                if ( has_custom_logo() ) :
                    the_custom_logo();
                else :
                    ?>
                    <h1 class="site-title"><a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home" style="color: white; text-decoration: none; font-weight: 800;"><?php bloginfo( 'name' ); ?></a></h1>
                    <?php
                endif;
                ?>
            </div>

            <nav id="site-navigation" class="main-navigation">
                <?php
                wp_nav_menu( array(
                    'theme_location' => 'primary-menu',
                    'menu_id'        => 'primary-menu',
                    'container'      => false,
                    'menu_class'     => 'nav-menu',
                ) );
                ?>
            </nav>
            
            <style>
                .nav-menu { list-style: none; display: flex; gap: 30px; margin: 0; }
                .nav-menu a { color: white; text-decoration: none; font-weight: 600; font-size: 1.1rem; }
                .nav-menu a:hover { color: var(--accent-color); }
            </style>
        </div>
    </header>
