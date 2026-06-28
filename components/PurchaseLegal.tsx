import Link from 'next/link';

export function PurchaseLegal() {
  return (
    <div className="purchase-legal">
      <p className="purchase-legal-refund">
        Digital product · <Link href="/legal/refunds">Refund Policy</Link>
      </p>
      <p className="purchase-legal-agree">
        By purchasing, you agree to the{' '}
        <Link href="/legal/terms">Terms of Service</Link> and{' '}
        <Link href="/legal/license">Software License</Link>.
      </p>
    </div>
  );
}
