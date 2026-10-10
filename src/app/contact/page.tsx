export default function Contact() {
  return (
    <div className="p-10 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Contact Me</h1>

      <form className="space-y-4">
        <input
          className="w-full p-3 border rounded"
          placeholder="Your Name"
        />
        <input
          className="w-full p-3 border rounded"
          placeholder="Email"
        />
        <textarea
          className="w-full p-3 border rounded"
          placeholder="Message"
          rows={5}
        />

        <button className="bg-black text-white px-6 py-2 rounded">
          Send Message
        </button>
      </form>
    </div>
  );
}