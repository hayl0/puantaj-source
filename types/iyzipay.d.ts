declare module 'iyzipay' {
  interface IyzipayConfig {
    apiKey: string;
    secretKey: string;
    uri: string;
  }

  class Iyzipay {
    constructor(config: IyzipayConfig);
    
    checkoutFormInitialize: {
      create(request: any, callback: (err: any, result: any) => void): void;
    };
    
    checkoutForm: {
      retrieve(request: any, callback: (err: any, result: any) => void): void;
    };

    payment: {
      create(request: any, callback: (err: any, result: any) => void): void;
    };
  }

  export = Iyzipay;
}
