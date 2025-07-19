// global.d.ts
interface PaystackResponse {
  reference: string
}

interface PaystackPopSetupOptions {
  key: string
  email: string
  amount: number
  ref: string
  callback: (response: PaystackResponse) => void
  onClose?: () => void
}

interface PaystackPop {
  setup(options: PaystackPopSetupOptions): {
    openIframe(): void
  }
}

interface Window {
  PaystackPop: PaystackPop
}
