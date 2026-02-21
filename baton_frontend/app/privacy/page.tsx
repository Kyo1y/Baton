import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for the Baton playlist transfer app.",
};

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12 lg:py-16 bg-black z-10">
      <header className="mb-10 space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="text-sm text-muted-foreground">
          Last updated: December 13, 2025
        </p>
      </header>

      <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
        {/* 1. Introduction */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">1. Introduction</h2>
          <p>
            This Privacy Policy explains how Baton (&quot;
            <strong>Baton</strong>,&quot; &quot;<strong>we</strong>,&quot; &quot;
            <strong>us</strong>,&quot; or &quot;<strong>our</strong>&quot;), operated
            by <strong>Kairat Sadyrbekov</strong> as an individual, collects, uses,
            and shares information about you when you use our websites, apps, and
            related services (collectively, the &quot;
            <strong>Service</strong>&quot; or &quot;<strong>Services</strong>&quot;).
          </p>
          <p>
            By using the Service, you agree to the collection and use of information
            in accordance with this Privacy Policy. If you do not agree with this
            Policy, please do not use the Service.
          </p>
        </section>

        {/* 2. Scope */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">2. Scope</h2>
          <p>
            This Privacy Policy applies to information we collect through:
          </p>
          <ul className="list-disc space-y-1 pl-6">
            <li>The Baton web application and any related pages or interfaces;</li>
            <li>
              Your interactions with Baton through connected third-party music
              services (such as Spotify, Apple Music, YouTube Music, or other
              platforms);
            </li>
            <li>Any other online services that link to this Privacy Policy.</li>
          </ul>
          <p>
            This Privacy Policy does not apply to third-party websites, apps, or
            services that you connect to Baton. Those services are governed by their
            own privacy policies and terms.
          </p>
        </section>

        {/* 3. Information We Collect */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            3. Information We Collect
          </h2>
          <p>
            The information we collect depends on how you use Baton. We may collect
            the following types of information:
          </p>

          <h3 className="font-medium text-foreground">3.1 Information You Provide</h3>
          <ul className="list-disc space-y-1 pl-6">
            <li>
              <strong>Account information.</strong> When you sign in or create an
              account, we may receive information such as your name, email address,
              and profile photo from your identity provider (for example, Google).
            </li>
            <li>
              <strong>Connected music services.</strong> When you connect a
              third-party music service (for example, Spotify, Apple Music, YouTube
              Music), we may receive identifiers and profile information associated
              with that account, such as your display name or service-specific user
              ID.
            </li>
            <li>
              <strong>Support and communications.</strong> If you contact us
              directly (for example, by email), we may receive your name, contact
              information, and the contents of your message.
            </li>
          </ul>

          <h3 className="font-medium text-foreground">3.2 Information from Connected Services</h3>
          <p>
            When you authorize Baton to access a third-party music account, we may
            access and process information such as:
          </p>
          <ul className="list-disc space-y-1 pl-6">
            <li>Playlist names, descriptions, and cover images;</li>
            <li>
              Playlist contents, including track titles, artists, albums, and other
              metadata allowed by the relevant API;
            </li>
            <li>
              Information needed to create or update playlists on your behalf (such
              as track IDs or playlist IDs);
            </li>
            <li>
              Access tokens or similar credentials provided by the third-party
              service so we can perform actions you request (for example, creating a
              playlist on another platform).
            </li>
          </ul>
          <p>
            Baton does not control the data that third-party services choose to
            share with us; this is governed by your settings and their APIs and
            policies.
          </p>

          <h3 className="font-medium text-foreground">3.3 Automatically Collected Information</h3>
          <p>
            When you use the Service, we may automatically collect certain
            information, such as:
          </p>
          <ul className="list-disc space-y-1 pl-6">
            <li>
              <strong>Usage data.</strong> Information about how you use the
              Service, including pages viewed, buttons clicked, and the time, date,
              and duration of your sessions.
            </li>
            <li>
              <strong>Device and log information.</strong> IP address, browser type
              and version, operating system, referrer URL, and other standard
              technical data provided by your browser.
            </li>
            <li>
              <strong>Cookies and similar technologies.</strong> Small data files
              stored on your device to maintain your session, remember preferences,
              and support basic analytics.
            </li>
          </ul>
        </section>

        {/* 4. How We Use Information */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            4. How We Use Your Information
          </h2>
          <p>We use the information we collect for purposes such as:</p>
          <ul className="list-disc space-y-1 pl-6">
            <li>
              <strong>Providing and maintaining the Service.</strong> To operate
              Baton, connect to third-party music services, transfer playlists,
              maintain your account, and deliver core functionality.
            </li>
            <li>
              <strong>Improving the Service.</strong> To understand how users
              interact with Baton, troubleshoot issues, and develop new features or
              enhancements.
            </li>
            <li>
              <strong>Security and abuse prevention.</strong> To protect the Service
              and our users, including detecting, preventing, and responding to
              fraud, abuse, and security incidents.
            </li>
            <li>
              <strong>Communication.</strong> To respond to your inquiries, send you
              important notices about changes to the Service or this Policy, and
              provide support.
            </li>
            <li>
              <strong>Legal compliance.</strong> To comply with applicable laws,
              regulations, legal processes, and enforce our Terms of Service.
            </li>
          </ul>
        </section>

        {/* 5. Legal Bases (EU/UK) */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            5. Legal Bases for Processing (EEA/UK Users)
          </h2>
          <p>
            If you are located in the European Economic Area (EEA) or the United
            Kingdom, we process your personal data only when we have a valid legal
            basis. These bases may include:
          </p>
          <ul className="list-disc space-y-1 pl-6">
            <li>
              <strong>Contract.</strong> Processing that is necessary to provide the
              Service you requested, such as transferring playlists between
              platforms at your direction.
            </li>
            <li>
              <strong>Legitimate interests.</strong> Processing necessary for our
              legitimate interests, such as improving the Service, safeguarding
              security, or preventing misuse, provided these interests are not
              overridden by your rights and interests.
            </li>
            <li>
              <strong>Legal obligations.</strong> Processing necessary to comply
              with laws and regulations.
            </li>
            <li>
              <strong>Consent.</strong> In some situations, we may ask for your
              consent (for example, for certain optional cookies or future features).
              You can withdraw your consent at any time where applicable.
            </li>
          </ul>
        </section>

        {/* 6. How We Share Information */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            6. How We Share Your Information
          </h2>
          <p>
            We do not sell your personal information. We may share your information
            in the following limited circumstances:
          </p>

          <h3 className="font-medium text-foreground">6.1 Service Providers</h3>
          <p>
            We may share information with third-party service providers that perform
            services on our behalf, such as hosting, storage, logging, analytics, or
            email delivery. These providers are authorized to use your information
            only as necessary to provide services to us and are typically bound by
            contractual confidentiality and data protection obligations.
          </p>

          <h3 className="font-medium text-foreground">6.2 Connected Third-Party Services</h3>
          <p>
            When you use Baton to transfer or manage playlists, we share information
            with the third-party music services you connect, as necessary to perform
            the actions you request (for example, creating a playlist on another
            platform or adding tracks to a playlist). These services use your data
            in accordance with their own privacy policies.
          </p>

          <h3 className="font-medium text-foreground">6.3 Legal and Safety</h3>
          <p>
            We may disclose information if we believe in good faith that such
            disclosure is reasonably necessary to:
          </p>
          <ul className="list-disc space-y-1 pl-6">
            <li>Comply with any applicable law, regulation, or legal process;</li>
            <li>
              Protect the rights, property, or safety of Baton, our users, or the
              public;
            </li>
            <li>
              Detect, prevent, or address fraud, security, or technical issues.
            </li>
          </ul>

          <h3 className="font-medium text-foreground">6.4 Business Changes</h3>
          <p>
            If Baton (or substantially all of its assets) is acquired, merged, or
            reorganized in the future, your information may be transferred as part
            of that transaction, subject to the same or similar privacy commitments.
          </p>
        </section>

        {/* 7. Cookies */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            7. Cookies and Similar Technologies
          </h2>
          <p>
            We may use cookies and similar technologies to operate and improve the
            Service. These may include:
          </p>
          <ul className="list-disc space-y-1 pl-6">
            <li>
              <strong>Strictly necessary cookies</strong> to keep you signed in and
              maintain session state.
            </li>
            <li>
              <strong>Preference cookies</strong> to remember certain settings, such
              as your theme preferences (light/dark mode).
            </li>
            <li>
              <strong>Basic analytics</strong> to understand aggregate usage of the
              Service (for example, which pages are visited most).
            </li>
          </ul>
          <p>
            Depending on your location and applicable law, you may have the ability
            to control or opt out of certain cookies through your browser settings
            or in-app controls if provided.
          </p>
        </section>

        {/* 8. Data Retention */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            8. Data Retention
          </h2>
          <p>
            We retain personal information for as long as reasonably necessary to:
          </p>
          <ul className="list-disc space-y-1 pl-6">
            <li>Provide and maintain the Service;</li>
            <li>Comply with our legal obligations;</li>
            <li>Resolve disputes and enforce our agreements;</li>
            <li>Protect our legitimate interests as described in this Policy.</li>
          </ul>
          <p>
            If you request that we delete your account, we will take reasonable
            steps to delete or anonymize your personal information, subject to any
            legal obligations to retain certain data for a longer period (for
            example, for legal, accounting, or security purposes).
          </p>
        </section>

        {/* 9. Security */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            9. Data Security
          </h2>
          <p>
            We use reasonable technical and organizational measures designed to
            protect your information and secure the Service. These measures are
            intended to reduce the risk of loss, misuse, unauthorized access,
            disclosure, or alteration of your information.
          </p>
          <p>
            However, no method of transmission over the Internet or method of
            electronic storage is completely secure. We cannot and do not guarantee
            absolute security of your data. You are responsible for maintaining the
            security of your login credentials and for all activity under your
            account.
          </p>
          <p>
            If we become aware of a security incident that affects your personal
            data, we will investigate and, where required by applicable law, notify
            you and/or relevant authorities and take reasonable steps to mitigate
            the impact.
          </p>
        </section>

        {/* 10. International Transfers */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            10. International Data Transfers
          </h2>
          <p>
            Baton is operated from the United States. If you access or use the
            Service from outside the United States, your information may be
            transferred to, stored, and processed in the United States and other
            countries, which may have data protection laws that are different from
            those in your country of residence.
          </p>
          <p>
            By using the Service, you consent to the transfer of your information to
            the United States and other jurisdictions as described in this Privacy
            Policy, subject to any rights you may have under applicable law.
          </p>
        </section>

        {/* 11. Your Rights & Choices */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            11. Your Rights and Choices
          </h2>
          <p>
            Depending on your location and applicable law, you may have certain
            rights regarding your personal information, which can include:
          </p>
          <ul className="list-disc space-y-1 pl-6">
            <li>
              <strong>Access.</strong> Request access to the personal information we
              hold about you.
            </li>
            <li>
              <strong>Correction.</strong> Request that we correct inaccurate or
              incomplete personal information.
            </li>
            <li>
              <strong>Deletion.</strong> Request that we delete your personal
              information, subject to legal or legitimate retention obligations.
            </li>
            <li>
              <strong>Restriction.</strong> Request that we restrict certain
              processing of your data.
            </li>
            <li>
              <strong>Portability.</strong> Request a copy of your personal
              information in a structured, commonly used, and machine-readable
              format where technically feasible.
            </li>
            <li>
              <strong>Objection.</strong> Object to certain processing, including
              processing based on legitimate interests, in some circumstances.
            </li>
            <li>
              <strong>Withdraw consent.</strong> Where processing is based on your
              consent, you may withdraw that consent at any time.
            </li>
          </ul>
          <p>
            To exercise any of these rights (where available), please contact us at{" "}
            <strong>sadyrbekov.kairat@gmail.com</strong>. We may need to verify your
            identity before fulfilling your request. Your rights may be limited in
            some cases, for example where fulfilling your request would conflict
            with legal obligations or the rights of others.
          </p>
        </section>

        {/* 12. Children */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            12. Children&apos;s Privacy
          </h2>
          <p>
            The Service is not intended for children under the age of 13, and we do
            not knowingly collect personal information from children under 13. If
            you are a parent or guardian and believe that your child has provided us
            with personal information, please contact us at{" "}
            <strong>sadyrbekov.kairat@gmail.com</strong> so we can take appropriate
            action. If we become aware that a child under 13 has provided us with
            personal information, we will take steps to delete such information.
          </p>
        </section>

        {/* 13. Changes */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            13. Changes to This Privacy Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time. When we do, we will
            update the &quot;Last updated&quot; date at the top of this page. We
            may also provide additional notice (for example, by email or in-app
            notification) if the changes are significant.
          </p>
          <p>
            Your continued use of the Service after the updated Privacy Policy
            becomes effective means that you acknowledge the changes and agree to
            the updated Policy. If you do not agree with the updated Policy, you
            should stop using the Service.
          </p>
        </section>

        {/* 14. Contact */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">14. Contact Us</h2>
          <p>
            If you have any questions or concerns about this Privacy Policy or how
            we handle your information, you can contact us at:
          </p>
          <ul className="list-none space-y-1 pl-0">
            <li>
              <strong>Email:</strong> sadyrbekov.kairat@gmail.com
            </li>
            <li>
              <strong>Name:</strong> Kairat Sadyrbekov
            </li>
            {/* Optional:
            <li>
              <strong>Address:</strong> [Your city, state, country]
            </li>
            */}
          </ul>
        </section>
      </div>
    </main>
  );
}
