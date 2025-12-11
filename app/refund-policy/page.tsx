export default function RefundPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6 text-center">Refund Policy</h1>

      <p className="mb-4">
        At <strong>Trustverse AI</strong>, we are committed to providing high quality AI tools 
        and services. However, due to the nature of digital products, all purchases made 
        on Trustverse AI are <strong>non-refundable</strong>.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">📝 When Refunds Are Not Provided</h2>
      <ul className="list-disc ml-6 space-y-2">
        <li>AI Credits once used cannot be reversed.</li>
        <li>No refund for subscription plans after activation.</li>
        <li>No refund if tools or features are fully accessible after payment.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">📌 Exceptional Cases</h2>
      <p className="mb-4">
        Refunds may be considered only if:
      </p>
      <ul className="list-disc ml-6 space-y-2">
        <li>You were charged incorrectly.</li>
        <li>Duplicate payment was made accidentally.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">📩 Contact Us</h2>
      <p>
        If you believe you are eligible for a refund, please contact our support team at:  
        <br />
        <strong>support@trustverseai.com</strong>
      </p>

      <p className="mt-10 text-center text-gray-500">
        Last Updated: {new Date().getFullYear()}
      </p>
    </div>
  );
}
