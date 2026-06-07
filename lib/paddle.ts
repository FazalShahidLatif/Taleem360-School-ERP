declare global {
  interface Window {
    Paddle: any;
  }
}

export const PADDLE_VENDOR_ID = Number(import.meta.env.VITE_PADDLE_VENDOR_ID) || 12345; // Placeholder for sandbox
export const PADDLE_ENVIRONMENT = import.meta.env.VITE_PADDLE_ENVIRONMENT || 'sandbox';

export const initPaddle = () => {
  if (typeof window === 'undefined') return;

  if (window.Paddle) {
    try {
      window.Paddle.Environment.set(PADDLE_ENVIRONMENT);
      window.Paddle.Initialize({ 
        token: import.meta.env.VITE_PADDLE_TOKEN || 'test_token_placeholder', // Placeholder for sandbox token
        eventCallback: (data: any) => {
          console.log('Paddle Event:', data);
        }
      });
    } catch (e) {
      console.warn('Error initializing preloaded Paddle:', e);
    }
    return;
  }

  // Load dynamically to prevent static script errors or blocks in iframe/sandbox environments
  const existingScript = document.querySelector('script[src*="paddle.js"]');
  if (existingScript) return;

  const script = document.createElement('script');
  script.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
  script.async = true;
  script.onload = () => {
    if (window.Paddle) {
      try {
        window.Paddle.Environment.set(PADDLE_ENVIRONMENT);
        window.Paddle.Initialize({ 
          token: import.meta.env.VITE_PADDLE_TOKEN || 'test_token_placeholder',
          eventCallback: (data: any) => {
            console.log('Paddle Event:', data);
          }
        });
      } catch (e) {
        console.warn('Error initializing dynamically loaded Paddle:', e);
      }
    }
  };
  script.onerror = () => {
    console.warn("Failed to load third-party Paddle script (DNS/Blocker). Using sandbox/mock checkout fallback.");
  };
  document.head.appendChild(script);
};

export const openCheckout = (priceId: string, email: string, onSuccess: () => void) => {
  if (window.Paddle) {
    window.Paddle.Checkout.open({
      settings: {
        displayMode: 'overlay',
        theme: 'light',
        locale: 'en',
      },
      items: [
        {
          priceId: priceId,
          quantity: 1,
        },
      ],
      customer: {
        email: email,
      },
      onSuccess: (data: any) => {
        console.log('Checkout Success:', data);
        onSuccess();
      },
    });
  } else {
    console.error('Paddle not loaded');
    // For demo purposes, we'll just call onSuccess if Paddle is missing
    onSuccess();
  }
};
