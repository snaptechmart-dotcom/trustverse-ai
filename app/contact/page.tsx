export default function Contact() {
  return (
    <div className="max-w-3xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <p className="mb-6">
        If you have questions, feedback, or need support — we are here to help.
      </p>

      <h2 className="text-xl font-semibold mb-2">Support Email</h2>
      <p className="mb-6">📧 support@trustverseai.com</p>

      <h2 className="text-xl font-semibold mb-2">Business Hours</h2>
      <p className="mb-6">Mon – Sat : 10:00 AM to 6:00 PM</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Send us a message</h2>

      <form className="grid gap-4 mt-4">
        <input
          type="text"
          placeholder="Your Name"
          className="p-3 rounded bg-gray-800 border border-gray-700"
        />

        <input
          type="email"
          placeholder="Your Email"
          className="p-3 rounded bg-gray-800 border border-gray-700"
        />

        <textarea
          placeholder="Your Message"
          rows={4}
          className="p-3 rounded bg-gray-800 border border-gray-700"
        ></textarea>

        <button
          type="submit"
          className="p-3 bg-blue-600 hover:bg-blue-700 rounded font-semibold"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}
