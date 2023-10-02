const TermsOfService = () => {
  return (
  	<main className="p-3">
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-semibold mb-4">
        Terms of Service for Calendar Next Gen
      </h1>
      <p className="mb-4">
        These Terms of Service govern your use of Calendar Next Gen. By using
        our application, you agree to comply with these terms.
      </p>
      <h2 className="text-xl font-semibold mb-4">Account Registration</h2>
      <p className="mb-4">
        You must create an account to use Calendar Next Gen. You are responsible
        for maintaining the security of your account credentials.
      </p>
      <h2 className="text-xl font-semibold mb-4">Prohibited Activities</h2>
      <p className="mb-4">
        You agree not to engage in any activities that violate these terms or
        applicable laws. This includes:
      </p>
      <ul className="list-disc ml-8 mb-4">
        <li>Unauthorized access to our system or data.</li>
        <li>Using Calendar Next Gen for illegal purposes.</li>
        <li>Interfering with the operation of the application.</li>
      </ul>
      {/* Add more sections as needed */}
      <h2 className="text-xl font-semibold mb-4">Termination</h2>
      <p className="mb-4">
        We reserve the right to terminate or suspend your account if you violate
        these terms or engage in activities that harm the operation of Calendar
        Next Gen.
      </p>
      <p className="mb-4">
        These Terms of Service may be updated, and continued use of the
        application constitutes acceptance of the updated terms.
      </p>
      <p className="mb-4">
        If you have any questions or concerns about these Terms of Service,
        please contact us at [Your Contact Information].
      </p>
      <p>
        Thank you for using Calendar Next Gen responsibly and in accordance with
        these terms.
      </p>
    </div>
    </main>
  );
};

export default TermsOfService;
