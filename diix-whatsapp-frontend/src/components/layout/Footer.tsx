import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FooterProps {
  className?: string;
  showSocialLinks?: boolean;
  showVersion?: boolean;
}

const APP_VERSION = '1.0.0';

export function Footer({ 
  className, 
  showSocialLinks = true,
  showVersion = true 
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={cn(
        "glass-panel border-t border-white/10 px-4 sm:px-6 py-4 sm:py-6 mt-auto",
        className
      )}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Left - Copyright & Info */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-xs sm:text-sm text-text-muted">
                © {currentYear} DIIX WhatsApp Frontend. Todos os direitos reservados.
              </p>
            </motion.div>

            {showVersion && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="hidden sm:inline-flex items-center px-2 py-1 rounded-full bg-accent-primary/10 text-accent-primary text-xs font-medium"
              >
                v{APP_VERSION}
              </motion.span>
            )}
          </div>

          {/* Center - Quick Links */}
          <motion.nav
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-4 sm:gap-6"
          >
            <a
              href="/terms"
              className="text-xs sm:text-sm text-text-muted hover:text-accent-primary transition-colors duration-200"
              onClick={(e) => e.preventDefault()}
            >
              Termos de Uso
            </a>
            <a
              href="/privacy"
              className="text-xs sm:text-sm text-text-muted hover:text-accent-primary transition-colors duration-200"
              onClick={(e) => e.preventDefault()}
            >
              Privacidade
            </a>
            <a
              href="/support"
              className="text-xs sm:text-sm text-text-muted hover:text-accent-primary transition-colors duration-200"
              onClick={(e) => e.preventDefault()}
            >
              Suporte
            </a>
          </motion.nav>

          {/* Right - Social Links */}
          {showSocialLinks && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-3"
            >
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/5 hover:bg-accent-primary/10 text-text-muted hover:text-accent-primary transition-all duration-200"
                aria-label="GitHub"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-6.24 0-1.38.495-2.52 1.305-3.42-.135-.33-.57-1.68.12-3.495 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.69 1.815.255 3.165.12 3.495.81.9 1.305 2.025 1.305 3.42 0 4.92-2.805 5.94-5.475 6.24.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              </a>
              
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/5 hover:bg-accent-primary/10 text-text-muted hover:text-accent-primary transition-all duration-200"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>

              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/5 hover:bg-accent-primary/10 text-text-muted hover:text-accent-primary transition-all duration-200"
                aria-label="Twitter/X"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>

              <a
                href="mailto:suporte@diix.com.br"
                className="p-2 rounded-lg bg-white/5 hover:bg-accent-primary/10 text-text-muted hover:text-accent-primary transition-all duration-200"
                aria-label="Email"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
            </motion.div>
          )}
        </div>

        {/* Bottom Bar - Contact Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-4 pt-4 border-t border-white/10 text-center"
        >
          <p className="text-xs text-text-muted">
            Precisa de ajuda? Entre em contato:{' '}
            <a 
              href="mailto:suporte@diix.com.br" 
              className="text-accent-primary hover:underline"
            >
              suporte@diix.com.br
            </a>
          </p>
        </motion.div>
      </div>
    </footer>
  );
}

export default Footer;
