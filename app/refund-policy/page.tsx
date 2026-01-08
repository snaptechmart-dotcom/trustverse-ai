export default function RefundPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Refund & Cancellation Policy
      </h1>

      <p className="mb-4">
        At <strong>Trustverse AI</strong>, we aim to provide reliable and
        high-quality AI-powered trust, fraud detection, and verification
        services. We value transparency and customer satisfaction while also
        ensuring fair usage of our digital products.
      </p>

      <p className="mb-4">
        This Refund Policy outlines the conditions under which refunds may be
        requested, in compliance with applicable consumer protection laws and
        Paddle’s mandatory refund requirements.
      </p>

      {/* 14 DAY POLICY */}
      <h2 className="text-xl font-semibold mt-8 mb-2">
        ✅ 14-Day Refund Eligibility
      </h2>

      <p className="mb-4">
        We offer a <strong>minimum 14-day refund period</strong> from the date of
        purchase for eligible transactions, in accordance with Paddle’s refund
        policy and international consumer protection regulations.
      </p>

      <p className="mb-4">
        Refund requests must be submitted within 14 days of the original
        purchase date by contacting our support team.
      </p>

      {/* CREDIT BASED SYSTEM */}
      <h2 className="text-xl font-semibold mt-8 mb-2">
        🔐 Credit-Based Usage Policy
      </h2>

      <p className="mb-4">
        Trustverse AI operates on a <strong>credit-based system</strong>, where
        users purchase credits to access AI tools such as trust score analysis,
        phone verification, email checks, and fraud detection features.
      </p>

      <ul className="list-disc ml-6 space-y-2 mb-4">
        <li>
          Once AI credits are <strong>used or consumed</strong>, they are
          considered delivered and are <strong>non-refundable</strong>.
        </li>
        <li>
          Partially used credit bundles may be eligible for a{" "}
          <strong>partial refund</strong> at our discretion.
        </li>
        <li>
          Fully used credits are not eligible for refunds.
        </li>
      </ul>

      {/* SUBSCRIPTIONS */}
      <h2 className="text-xl font-semibold mt-8 mb-2">
        📦 Subscriptions & Plans
      </h2>

      <ul className="list-disc ml-6 space-y-2 mb-4">
        <li>
          Subscription plans may be cancelled within the 14-day refund window,
          provided no substantial usage has occurred.
        </li>
        <li>
          After the refund window or after significant usage, subscriptions are
          non-refundable.
        </li>
        <li>
          Cancelled subscriptions will remain active until the end of the
          current billing cycle.
        </li>
      </ul>

      {/* NON REFUNDABLE */}
      <h2 className="text-xl font-semibold mt-8 mb-2">
        ❌ Non-Refundable Scenarios
      </h2>

      <ul className="list-disc ml-6 space-y-2 mb-4">
        <li>Credits that have been fully used or exhausted.</li>
        <li>Requests made after the 14-day refund period.</li>
        <li>Refund requests based on misunderstanding of features.</li>
        <li>Failure to read product descriptions or documentation.</li>
      </ul>

      {/* EXCEPTIONS */}
      <h2 className="text-xl font-semibold mt-8 mb-2">
        ⚠️ Exceptional Refund Cases
      </h2>

      <p className="mb-4">
        Refunds may be granted in exceptional circumstances, including:
      </p>

      <ul className="list-disc ml-6 space-y-2 mb-4">
        <li>Duplicate or accidental charges.</li>
        <li>Technical billing errors.</li>
        <li>Unauthorized transactions (subject to investigation).</li>
      </ul>

      {/* PROCESS */}
      <h2 className="text-xl font-semibold mt-8 mb-2">
        📩 How to Request a Refund
      </h2>

      <p className="mb-4">
        To request a refund, please contact us within 14 days of purchase at:
      </p>

      <p className="mb-6">
        <strong>support@trustverseai.com</strong>
      </p>

      <p className="mb-4">
        Please include your registered email address, transaction ID, and a
        brief explanation of your refund request.
      </p>

      {/* FINAL NOTE */}
      <p className="mt-10 text-sm text-gray-600 italic">
        Final refund decisions are made in accordance with Paddle’s policies,
        applicable laws, and Trustverse AI’s internal review process. Approved
        refunds are processed back to the original payment method.
      </p>

      <p className="mt-10 text-center text-gray-500">
        Last Updated: {new Date().getFullYear()}
      </p>
    </div>
  );
}
