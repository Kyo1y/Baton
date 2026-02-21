import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for the Baton playlist transfer app.",
};

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12 lg:py-16 bg-black z-10">
      <header className="mb-10 space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Terms of Service
        </h1>
        <p className="text-sm text-muted-foreground">
          Last updated: December 13, 2025
        </p>
      </header>

      <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">1. Introduction</h2>
          <p>
            These Terms of Service (&quot;<strong>Terms</strong>&quot;) govern your access
            to and use of Baton and any related websites, apps, and services
            (collectively, the &quot;<strong>Service</strong>&quot; or
            &quot;<strong>Services</strong>&quot;).
          </p>
          <p>
            The Service is provided by <strong>Kairat Sadyrbekov</strong>, an
            individual (&quot;<strong>Baton</strong>,&quot; &quot;<strong>we</strong>,&quot;
            &quot;<strong>us</strong>,&quot; or &quot;<strong>our</strong>&quot;). You can
            contact us at <strong>sadyrbekov.kairat@gmail.com</strong>.
          </p>
          <p>
            By creating an account, connecting a third-party music service, or using
            Baton in any way, you (&quot;<strong>you</strong>&quot; or
            &quot;<strong>User</strong>&quot;) agree to be bound by these Terms. If you
            do not agree to these Terms, you may not use the Service.
          </p>
          <p>
            If you are using the Service on behalf of an organization, you represent
            and warrant that you have authority to accept these Terms on its behalf,
            and &quot;you&quot; will include that organization.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            2. Eligibility and Accounts
          </h2>
          <h3 className="font-medium text-foreground">2.1 Eligibility</h3>
          <p>
            You may use the Service only if you: (a) are at least the age of
            majority in your place of residence (typically 18), or have the consent
            of a parent or legal guardian; and (b) are legally capable of entering
            into a binding contract. If you are under 13, you may not use the
            Service.
          </p>

          <h3 className="font-medium text-foreground">2.2 Account Registration</h3>
          <p>
            To use certain features of Baton, you may need to create an account or
            sign in through a third-party provider (for example, Google, Spotify,
            Apple Music). You agree to provide accurate and complete information when
            creating your account, to keep your login credentials confidential, and
            to notify us promptly if you suspect any unauthorized use of your
            account. You are responsible for all activity that occurs under your
            account.
          </p>

          <h3 className="font-medium text-foreground">2.3 Third-Party Accounts</h3>
          <p>
            When you connect a third-party music service (for example, Spotify, Apple
            Music, YouTube Music), you authorize Baton to access that account as
            permitted by that service&apos;s permissions and APIs, solely to provide
            the Services (such as reading playlists, creating or editing playlists,
            or transferring playlists at your request).
          </p>
          <p>
            Your use of any third-party service is also governed by that service&apos;s
            own terms and privacy policies. We are not responsible for those
            services, their content, or their handling of your data.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            3. Description of the Service
          </h2>
          <p>
            Baton is a tool that helps you transfer and manage playlists between
            supported music streaming services. Among other things, Baton may allow
            you to:
          </p>
          <ul className="list-disc space-y-1 pl-6">
            <li>Connect one or more third-party music streaming accounts;</li>
            <li>
              Read and list your playlists and associated metadata (such as track
              name, artist, album, playlist names, and descriptions);
            </li>
            <li>
              Create or update playlists on your connected services based on your
              instructions.
            </li>
          </ul>
          <p>
            Baton does <strong>not</strong> host or stream music files. Actual
            streaming, licensing, and content availability are handled entirely by
            the underlying music services you connect.
          </p>
          <p>
            We may modify, expand, or limit features of the Service at any time, as
            described in Section 11.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            4. License and Acceptable Use
          </h2>
          <h3 className="font-medium text-foreground">4.1 License</h3>
          <p>
            Subject to these Terms, we grant you a limited, non-exclusive,
            non-transferable, revocable license to access and use the Service solely
            for personal or internal business purposes and in accordance with these
            Terms.
          </p>

          <h3 className="font-medium text-foreground">4.2 Acceptable Use</h3>
          <p>You agree not to:</p>
          <ul className="list-disc space-y-1 pl-6">
            <li>
              Use the Service in any way that violates applicable law or third-party
              rights (including copyright and music licensing).
            </li>
            <li>
              Violate the terms of any third-party music service you connect to
              Baton.
            </li>
            <li>
              Reverse engineer, decompile, disassemble, or attempt to derive the
              source code of the Service, except where permitted by law.
            </li>
            <li>
              Circumvent or attempt to circumvent any technical or security
              protections of the Service or the APIs we rely on.
            </li>
            <li>
              Use any automated means (for example, bots or scrapers) to access the
              Service in a manner that could interfere with its normal operation.
            </li>
            <li>
              Upload or transmit any malware, virus, or other harmful code.
            </li>
            <li>
              Attempt to access data or accounts that do not belong to you.
            </li>
          </ul>
          <p>
            We may investigate and take appropriate action for any violation of this
            Section, including suspension or termination of your account.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            5. User Content and Intellectual Property
          </h2>

          <h3 className="font-medium text-foreground">5.1 Your Content</h3>
          <p>
            &quot;<strong>User Content</strong>&quot; means any data, playlists,
            metadata, profile information, or other content you provide to or through
            the Service, including content imported from your connected third-party
            services.
          </p>
          <p>
            You retain ownership of your User Content. By using the Service, you
            grant Baton a worldwide, non-exclusive, royalty-free license to host,
            store, process, transmit, display, and otherwise use your User Content
            solely as necessary to provide, maintain, secure, and improve the
            Service.
          </p>

          <h3 className="font-medium text-foreground">5.2 Baton&apos;s Intellectual Property</h3>
          <p>
            The Service and all related content, features, and functionality
            (including software, design, text, graphics, logos, and trademarks) are
            owned by Baton or its licensors and are protected by copyright,
            trademark, and other laws. Except for the limited license granted in
            Section 4.1, these Terms do not grant you any rights to Baton&apos;s
            intellectual property. You may not use Baton&apos;s name, logo, or
            trademarks without our prior written permission.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            6. Third-Party Services and Links
          </h2>
          <p>
            The Service depends on and may contain links or integrations to
            third-party services (such as Spotify, Apple Music, YouTube, Google, or
            other platforms).
          </p>
          <p>
            You acknowledge and agree that Baton is not responsible for the content,
            terms, privacy practices, or actions of any third-party services. Baton
            has no control over the availability, features, or policies of those
            services, and they may change or discontinue their APIs or services at
            any time. Your interactions with any third-party service are solely
            between you and that third party.
          </p>
          <p>
            If a third-party platform changes its API, pricing, policies, or access
            rights in a way that affects Baton, we are not liable for resulting
            issues, limitations, or loss of functionality.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            7. Payments and Subscriptions
          </h2>

          <h3 className="font-medium text-foreground">7.1 Currently Free</h3>
          <p>
            As of the &quot;Last updated&quot; date above, the Service is provided
            free of charge for personal use. You are not currently required to pay
            any fees to use Baton.
          </p>

          <h3 className="font-medium text-foreground">7.2 Future Paid Plans</h3>
          <p>
            We may introduce paid features, subscriptions, or other pricing plans in
            the future. If we do, we will update these Terms and provide clear
            information about applicable fees, billing terms, and cancellation
            options before charging you for any paid Service. You will have the
            choice whether or not to subscribe to any paid features.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            8. Disclaimer of Warranties
          </h2>
          <p>
            To the maximum extent permitted by law, the Service is provided
            &quot;as is&quot; and &quot;as available,&quot; without warranties of any
            kind, whether express, implied, or statutory.
          </p>
          <p>
            Without limiting the foregoing, we specifically disclaim any implied
            warranties of merchantability, fitness for a particular purpose,
            non-infringement, and quiet enjoyment. We do not warrant that the
            Service will be uninterrupted, secure, or error-free, that any defects
            will be corrected, that the Service will meet your requirements, or that
            any data (including playlists, track matches, or metadata) will be
            accurate, complete, or preserved without loss. You use the Service at
            your own risk and are responsible for maintaining your own backups of
            any important playlists or data.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            9. Limitation of Liability
          </h2>
          <p>
            To the maximum extent permitted by law, Baton and its officers,
            directors, employees, agents, partners, and licensors will not be liable
            for any indirect, incidental, special, consequential, or punitive
            damages, including lost profits, lost data, or loss of goodwill, arising
            out of or related to your use of or inability to use the Service, even
            if we have been advised of the possibility of such damages.
          </p>
          <p>
            To the maximum extent permitted by law, our total aggregate liability
            for any and all claims arising out of or relating to the Service or
            these Terms will not exceed <strong>fifty US dollars (US $50)</strong>.
          </p>
          <p>
            We are not liable for any actions or omissions of third-party service
            providers (including music streaming platforms and payment processors),
            for any unauthorized access to or use of your accounts on third-party
            services to the extent not caused by our failure to implement reasonable
            security measures, or for any loss, corruption, or inaccuracy of data
            stored by third-party services.
          </p>
          <p>
            Some jurisdictions do not allow the exclusion of certain warranties or
            the limitation of liability for consequential or incidental damages. In
            such jurisdictions, our liability will be limited to the fullest extent
            permitted by law.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            10. Security; No Absolute Guarantee
          </h2>
          <p>
            We use reasonable technical and organizational measures designed to
            protect your information and secure the Service. However, no method of
            transmission over the Internet or method of electronic storage is
            completely secure. Accordingly, we cannot and do not guarantee absolute
            security of your data.
          </p>
          <p>
            You are responsible for maintaining the security of your login
            credentials and for all activity under your account. If you suspect that
            your account or data has been compromised, you should notify us
            immediately at <strong>[your-email@example.com]</strong>.
          </p>
          <p>
            Where required by applicable law, if we become aware of a security
            incident involving your personal data, we will notify you and/or
            relevant authorities and take reasonable steps to mitigate the impact.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            11. Changes, Suspension, and Termination
          </h2>

          <h3 className="font-medium text-foreground">11.1 Changes to the Service</h3>
          <p>
            We may modify, suspend, or discontinue all or part of the Service at any
            time, with or without notice, including the availability of any feature,
            database, or content.
          </p>

          <h3 className="font-medium text-foreground">11.2 Suspension or Termination by Us</h3>
          <p>
            We may suspend or terminate your access to the Service (including your
            account) if you violate these Terms, if we reasonably believe your use
            of the Service may cause harm or legal risk, or if we decide to
            discontinue the Service. Where reasonably possible, we will attempt to
            notify you before termination, but we are not obligated to do so in
            urgent or severe cases (for example, abuse, fraud, or security risk).
          </p>

          <h3 className="font-medium text-foreground">11.3 Termination by You</h3>
          <p>
            You may stop using the Service at any time. You may also request
            deletion of your account as described in our Privacy Policy. Upon
            termination, your right to use the Service will immediately cease, and
            certain provisions of these Terms that by their nature should survive
            will continue to apply (including ownership provisions, disclaimers,
            limitation of liability, and dispute resolution provisions).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">12. Indemnification</h2>
          <p>
            You agree to indemnify, defend, and hold harmless Baton and its
            officers, directors, employees, and agents from and against any claims,
            liabilities, damages, judgments, losses, and expenses (including
            reasonable attorneys&apos; fees) arising out of or related to: (a) your
            use of the Service; (b) your violation of these Terms; (c) your
            violation of any third-party rights (including intellectual property or
            privacy rights); or (d) your violation of the terms or policies of any
            third-party service you connect to Baton.
          </p>
          <p>
            We reserve the right to assume the exclusive defense and control of any
            matter otherwise subject to indemnification by you, in which case you
            agree to cooperate with us in asserting any available defenses.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            13. Governing Law and Dispute Resolution
          </h2>
          <p>
            These Terms and any dispute arising out of or related to them or the
            Service will be governed by and construed in accordance with the laws of
            the State of New York and the federal laws of the United States of
            America, without regard to its conflict of law rules.
          </p>
          <p>
            Any disputes arising under or in connection with these Terms will be
            subject to the exclusive jurisdiction of the state and federal courts
            located in New York County, New York, United States, and you and Baton
            consent to the personal jurisdiction of such courts.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">14. Changes to These Terms</h2>
          <p>
            We may update these Terms from time to time. When we do, we will update
            the &quot;Last updated&quot; date at the top of this page and may
            provide additional notice (for example, by email or in-app notification)
            if the changes are material. By continuing to access or use the Service
            after the updated Terms become effective, you agree to be bound by the
            updated Terms. If you do not agree to the updated Terms, you must stop
            using the Service.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">15. General</h2>
          <p>
            <strong>Entire Agreement.</strong> These Terms, together with any
            additional policies or terms referenced herein (such as our Privacy
            Policy), constitute the entire agreement between you and Baton regarding
            the Service.
          </p>
          <p>
            <strong>Severability.</strong> If any provision of these Terms is found
            to be invalid or unenforceable, the remaining provisions will remain in
            full force and effect.
          </p>
          <p>
            <strong>No Waiver.</strong> Our failure to enforce any provision of
            these Terms will not be deemed a waiver of our right to enforce that
            provision or any other provision in the future.
          </p>
          <p>
            <strong>Assignment.</strong> You may not assign or transfer these Terms
            or your rights under them without our prior written consent. We may
            assign these Terms without restriction, including in connection with a
            merger, acquisition, sale of assets, or by operation of law.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">16. Contact Us</h2>
          <p>
            If you have any questions about these Terms or the Service, you can
            contact us at:
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
