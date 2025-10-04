import Script from 'next/script';

export default function ConfirmLayout({ children }) {
  return (
    <>
      {children}
      <Script 
        src="https://app.sandbox.midtrans.com/snap/snap.js" 
        data-client-key="Mid-client-E-Q5p49F6YexvEAj"
        strategy="beforeInteractive"
      />
    </>
  );
}