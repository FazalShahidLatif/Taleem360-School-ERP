declare global {
  interface Window {
    Paddle: any;
  }
}

export const PADDLE_VENDOR_ID = Number(import.meta.env.VITE_PADDLE_VENDOR_ID) || 12345; // Placeholder for sandbox
export const PADDLE_ENVIRONMENT = import.meta.env.VITE_PADDLE_ENVIRONMENT || 'sandbox';

export const initPaddle = () => {
  if (window.Paddle) {
    window.Paddle.Environment.set(PADDLE_ENVIRONMENT);
    window.Paddle.Initialize({ 
      token: import.meta.env.VITE_PADDLE_TOKEN || 'test_token_placeholder', // Placeholder for sandbox token
      eventCallback: (data: any) => {
        console.log('Paddle Event:', data);
      }
    });
  }
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
