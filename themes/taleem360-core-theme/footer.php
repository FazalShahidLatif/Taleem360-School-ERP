<?php
/**
 * Taleem360 Core Theme Footer
 */
?>
    <footer id="colophon" class="taleem-footer">
        <div class="footer-container" style="max-width: 1200px; margin: 0 auto; display: flex; flex-wrap: wrap; gap: 40px; padding: 0 20px;">
            <div class="footer-widget" style="flex: 1; min-width: 250px;">
                <h3 style="color: var(--accent-color); font-weight: 800;">Taleem360 AI</h3>
                <p><?php echo esc_html( get_theme_mod( 'taleem_footer_copy', 'Empowering AI Enthusiasts in Pakistan.' ) ); ?></p>
            </div>
            
            <div class="footer-widget" style="flex: 1; min-width: 200px;">
                <h4 style="color: white; margin-bottom: 15px;">Resources</h4>
                <ul style="list-style: none; padding: 0; line-height: 2;">
                    <li><a href="#" style="color: rgba(255,255,255,0.7); text-decoration: none;">AI Curriculum</a></li>
                    <li><a href="#" style="color: rgba(255,255,255,0.7); text-decoration: none;">Freelancing Guide</a></li>
                    <li><a href="#" style="color: rgba(255,255,255,0.7); text-decoration: none;">Community Projects</a></li>
                </ul>
            </div>

            <div class="footer-widget" style="flex: 1; min-width: 200px;">
                <h4 style="color: white; margin-bottom: 15px;">Powered By</h4>
                <p><a href="<?php echo esc_url( TALEEM_SAASSKUL_URL ); ?>" target="_blank" style="color: var(--gold-accent); text-decoration: none; font-weight: 700;">SaaSSkul Digital Marketplace</a></p>
                <p style="font-size: 0.8rem; opacity: 0.6;">High-performance AI ecosystems for Pakistan.</p>
            </div>
        </div>

        <div class="footer-bottom">
            <p>&copy; <?php echo date('Y'); ?> <a href="https://taleem360.online">Taleem360.online</a>. All Rights Reserved. Licensed under <a href="<?php echo esc_url( TALEEM_SAASSKUL_URL ); ?>">SaaSSkul</a>.</p>
        </div>
    </footer>
</div><!-- #page -->

<?php wp_footer(); ?>

</body>
</html>
