// Google Identity Services(https://accounts.google.com/gsi/client)에서 쓰는 부분만 타입 선언
interface GoogleCredentialResponse {
  credential: string
  select_by?: string
}

interface GoogleButtonOptions {
  type?: 'standard' | 'icon'
  theme?: 'outline' | 'filled_blue' | 'filled_black'
  size?: 'large' | 'medium' | 'small'
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin'
  shape?: 'rectangular' | 'pill' | 'circle' | 'square'
  logo_alignment?: 'left' | 'center'
  width?: number
  locale?: string
}

interface Window {
  google?: {
    accounts: {
      id: {
        initialize(options: {
          client_id: string
          callback: (response: GoogleCredentialResponse) => void
          auto_select?: boolean
          cancel_on_tap_outside?: boolean
          use_fedcm_for_prompt?: boolean
        }): void
        renderButton(parent: HTMLElement, options: GoogleButtonOptions): void
        disableAutoSelect(): void
      }
    }
  }
}
