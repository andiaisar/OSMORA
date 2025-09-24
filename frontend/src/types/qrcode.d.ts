declare module 'qrcode' {
  export function toDataURL(value: string, options?: any): Promise<string>
  const _default: {
    toDataURL: typeof toDataURL
  }
  export default _default
}
