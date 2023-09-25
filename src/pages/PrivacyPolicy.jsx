const PrivacyPolicy = () => {
  return (
    <main className="p-3">
      <div className="container mx-auto mt-8">
        <h1 className="text-2xl font-semibold mb-4">
          Privacy Policy for Calendar Next Gen
        </h1>
        <p className="mb-4">
          Welcome to Calendar Next Gen! This Privacy Policy outlines how we
          collect, use, store, and protect your personal information when you
          use our application.
        </p>
        <h2 className="text-xl font-semibold mb-4">Information We Collect</h2>
        <p className="mb-4">We collect the following types of information:</p>
        <ul className="list-disc ml-8 mb-4">
          <li>
            Usernames: We collect usernames to personalize your experience and
            provide account-specific features.
          </li>
          <li>
            Emails: Your email address is used for account-related communication
            and password recovery.
          </li>
          <li>
            Web Push Subscriptions: We may collect web push subscriptions to
            send you notifications related to your calendar events and
            application updates. You can manage your notification preferences in
            your account settings.
          </li>
          <li>
            Images: If you choose to upload images to personalize your calendar
            or events, we store these images securely and use them solely for
            your benefit within the app.
          </li>
          <li>
            Data Created Through the App: This includes event details, notes,
            and any other data you input into the application. Your data is
            stored to ensure a seamless user experience and to provide you with
            access to your calendar information.
          </li>
        </ul>
        <h2 className="text-xl font-semibold mb-4">
          How We Use Your Information
        </h2>
        <p className="mb-4">
          We use the collected information for the following purposes:
        </p>
        <ul className="list-disc ml-8 mb-4">
          <li>
            Providing Services: Your information is used to deliver the core
            functionality of Calendar Next Gen, including creating, managing,
            and displaying your calendar events and data.
          </li>
          <li>
            Improving User Experience: We analyze user data to enhance our
            application's features and usability.
          </li>
          <li>
            Communication: We may use your email address to send you important
            updates, announcements, and account-related information. You can opt
            out of promotional emails.
          </li>
        </ul>
        {/* Add more sections as needed */}
        <p className="mb-4">
          Data Security: We take data security seriously and employ
          industry-standard measures to protect your information from
          unauthorized access, loss, or disclosure.
        </p>
        <p className="mb-4">
          User Rights: You have the right to access, correct, or delete your
          personal information stored in Calendar Next Gen. You can manage your
          account settings to control the data you share with us.
        </p>
        <p className="mb-4">
          No Information Sale or Distribution: We do not sell or distribute your
          personal information to any person or company. Your data is solely for
          the benefit of your user experience within Calendar Next Gen, and
          access is restricted to you unless you choose to share it with others.
        </p>
        <h2 className="text-xl font-semibold mb-4">Policy Updates</h2>
        <p className="mb-4">
          We may update this Privacy Policy to reflect changes in our practices
          or to comply with legal requirements. We will notify you of any
          significant updates via email or by posting a notice within the
          application.
        </p>
        <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
        <p className="mb-4">
          If you have any questions or concerns about your privacy or this
          Privacy Policy, please contact us at [Your Contact Information].
        </p>
        <p className="mb-4">
          By using Calendar Next Gen, you agree to the terms outlined in this
          Privacy Policy. Please review this policy regularly for updates.
        </p>
        <p>
          Thank you for trusting Calendar Next Gen with your calendar and event
          data.
        </p>
      </div>
    </main>
  );
}

export default PrivacyPolicy;
