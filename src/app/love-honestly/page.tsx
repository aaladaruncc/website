import type { Metadata } from "next";

const linkClass =
  "font-medium text-rose-800 underline decoration-rose-300 underline-offset-4 transition hover:text-rose-950 hover:decoration-rose-700";

const supportEmail = "info@ocal.ai";

export const metadata: Metadata = {
  title: "Love Honestly — Privacy, Support, and Safety",
  description:
    "Privacy policy, subscription support, and public crisis-response protocol for Love Honestly.",
};

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a className={linkClass} href={href} rel="noopener noreferrer" target="_blank">
      {children}
    </a>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-8 border-t border-stone-200 pt-12">
      <h2 className="text-2xl font-semibold tracking-tight text-stone-950">{title}</h2>
      <div className="mt-6 space-y-5 text-[15px] leading-7 text-stone-700">{children}</div>
    </section>
  );
}

export default function LoveHonestlyCompliance() {
  return (
    <main className="mx-auto max-w-[760px] px-6 py-12 md:py-20">
      <header className="rounded-[2rem] bg-[#fff7f4] px-6 py-8 md:px-10 md:py-10">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-800">
          Love Honestly
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950 md:text-4xl">
          Privacy, support, and safety
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-stone-700">
          Public information for the initial App Store release candidate. Love Honestly is a
          private conversation-rehearsal tool for people age 16 and over. It is not therapy and
          is not an emergency service.
        </p>
        <nav aria-label="Page sections" className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          <a className={linkClass} href="#privacy">
            Privacy policy
          </a>
          <a className={linkClass} href="#support">
            Support
          </a>
          <a className={linkClass} href="#crisis-protocol">
            Crisis-response protocol
          </a>
        </nav>
      </header>

      <div className="mt-14 space-y-14">
        <Section id="privacy" title="Privacy policy">
          <p>
            <strong>Last updated:</strong> August 15, 2026
          </p>

          <h3 className="text-lg font-semibold text-stone-950">What the app collects</h3>
          <p>
            Love Honestly has no account, no sign-in, and no developer-operated server that
            receives your conversations. The initial release processes rehearsal content on your
            device. We do not have a copy of what you write in the app.
          </p>

          <h3 className="text-lg font-semibold text-stone-950">Where your conversations live</h3>
          <p>
            Your intake, rehearsal text, plans, and debriefs live in the app&apos;s protected storage
            on your iPhone. The release candidate is designed to exclude that content from iCloud
            and computer backups. If you lose or replace the device, that content does not return
            with your subscription. Export is the user-controlled backup path.
          </p>

          <h3 className="text-lg font-semibold text-stone-950">What can leave your device</h3>
          <p>Content leaves the app only when you deliberately use one of these controls:</p>
          <ol className="list-decimal space-y-3 pl-6">
            <li>
              <strong>Share.</strong> The app shows a preview before opening Apple&apos;s share sheet.
              Identifying details are removed by default. You choose the destination.
            </li>
            <li>
              <strong>Export.</strong> An export contains the data you asked the app to export. The
              exported file is no longer protected by the app and goes wherever you choose.
            </li>
          </ol>
          <p>
            Apple separately handles App Store purchases and subscriptions. A small set of app
            settings may be included in your Apple device backup; those settings do not contain
            your conversation text. If speech input is available, the app turns speech into text
            without writing a reusable audio file into the app&apos;s storage.
          </p>

          <h3 className="text-lg font-semibold text-stone-950">Third parties</h3>
          <p>
            The initial release sends rehearsal content to no external AI provider. It uses no ad
            SDK, no third-party crash reporter, and no in-app analytics service. Apple&apos;s on-device
            Foundation Models framework performs supported AI generation locally. StoreKit
            communicates with Apple for purchases and entitlement status.
          </p>

          <h3 className="text-lg font-semibold text-stone-950">Retention, deletion, and export</h3>
          <p>
            App content remains on the device until you delete an individual record, use the
            delete-all control, or remove the app. Delete-all works without a network connection,
            cancels reminders created by the app, and cannot be undone. It cannot erase words your
            iPhone keyboard learned or copies you previously exported, copied, or shared.
          </p>
          <p>
            You can export the information the app holds before deleting it. Because the initial
            release does not send rehearsal content to a developer or external AI provider, there
            is no server-side conversation copy or transmission consent to revoke.
          </p>

          <h3 className="text-lg font-semibold text-stone-950">Age and intended use</h3>
          <p>
            Love Honestly is for people age 16 and over. The app asks about age before entering and
            does not collect a birth date or identity document. Love Honestly is not therapy, does
            not diagnose a person or relationship, and is not a substitute for professional care.
          </p>

          <h3 className="text-lg font-semibold text-stone-950">This website</h3>
          <p>
            This compliance page is hosted by Vercel, which may process ordinary request metadata
            such as an IP address and browser information to deliver and secure the page. Vercel
            Analytics is disabled on Love Honestly compliance routes. This page has no support
            form and should never be used to submit conversation text, screenshots, or crisis
            information.
          </p>
        </Section>

        <Section id="support" title="Support">
          <p>
            <strong>Support contact:</strong>{" "}
            <a className={linkClass} href={`mailto:${supportEmail}`}>
              {supportEmail}
            </a>
          </p>
          <p>
            Please describe the app problem without including relationship details, rehearsal
            text, screenshots of conversations, or crisis information.
          </p>

          <h3 className="text-lg font-semibold text-stone-950">Manage or cancel a subscription</h3>
          <p>
            Apple manages billing. On iPhone, open <strong>Settings</strong>, tap your name, then
            tap <strong>Subscriptions</strong> and choose Love Honestly. You can also use Apple&apos;s{" "}
            <ExternalLink href="https://support.apple.com/118428">
              subscription-management instructions
            </ExternalLink>
            . Deleting your conversations or deleting the app does not cancel a subscription.
          </p>

          <h3 className="text-lg font-semibold text-stone-950">Restore purchases</h3>
          <p>
            Use Restore Purchases inside Love Honestly while signed into the Apple Account that
            bought the subscription. A restore returns access; it does not restore conversations,
            plans, or debriefs from another device.
          </p>

          <h3 className="text-lg font-semibold text-stone-950">Billing privacy</h3>
          <p>
            Subscription billing is not invisible. Apple may email a receipt, record the purchase
            in the Apple Account&apos;s history, and show an Apple billing descriptor on a payment
            statement. For a family account using Ask to Buy, a purchase request can identify Love
            Honestly to the family organizer before the purchase is approved.
          </p>

          <h3 className="text-lg font-semibold text-stone-950">Device loss and deletion</h3>
          <p>
            Your Apple Account can restore subscription access, but it cannot restore local Love
            Honestly conversations. Export is the only user-controlled backup. If you delete local
            app data, that deletion cannot be undone.
          </p>

          <h3 className="text-lg font-semibold text-stone-950">Urgent help</h3>
          <p>
            Support is not monitored as an emergency channel. If you are in immediate danger, call
            911. If you are struggling or thinking about suicide, call or text 988. Additional
            resources and the complete public protocol are below.
          </p>
        </Section>

        <Section id="crisis-protocol" title="Public crisis-response protocol">
          <p>
            <strong>Protocol last reviewed:</strong> August 15, 2026
          </p>
          <p>
            Love Honestly is a practice tool, not an emergency service. No human watches a session,
            and the app does not contact emergency services, a partner, a parent, or anyone else on
            the user&apos;s behalf.
          </p>

          <h3 className="text-lg font-semibold text-stone-950">How the protocol works</h3>
          <ol className="list-decimal space-y-3 pl-6">
            <li>
              A persistent, discreet resources route is available independently of automated safety
              checks.
            </li>
            <li>
              Local, recall-oriented safety checks examine user-authored text for patterns associated
              with self-harm, harm to another person, threats, coercive control, stalking, or abuse.
              Those checks run on the device.
            </li>
            <li>
              When a critical pattern matches, the app stops or pauses roleplay and shows fixed,
              reviewed resource information. It does not generate the resource response with AI.
            </li>
            <li>
              Frightening-partner or coercive-control contexts lead with domestic-violence and dating-
              abuse resources rather than generic coaching. The app does not coach the user toward a
              confrontation.
            </li>
            <li>
              The user can dismiss a false interruption. Automated checks can be wrong in both
              directions and are never represented as a diagnosis, assessment, or guarantee of
              detection.
            </li>
          </ol>

          <h3 className="text-lg font-semibold text-stone-950">United States resources</h3>
          <ul className="space-y-4">
            <li>
              <strong>Immediate danger:</strong> call <a className={linkClass} href="tel:911">911</a>.
            </li>
            <li>
              <strong>988 Suicide &amp; Crisis Lifeline:</strong> call or text{" "}
              <a className={linkClass} href="tel:988">988</a>, or use{" "}
              <ExternalLink href="https://chat.988lifeline.org/">988 chat</ExternalLink>. Available
              24/7.
            </li>
            <li>
              <strong>National Domestic Violence Hotline:</strong> call{" "}
              <a className={linkClass} href="tel:+18007997233">1-800-799-7233</a>, text START to
              88788, or use <ExternalLink href="https://www.thehotline.org/">live chat</ExternalLink>.
            </li>
            <li>
              <strong>love is respect:</strong> for teens and young adults, call{" "}
              <a className={linkClass} href="tel:+18663319474">1-866-331-9474</a>, text LOVEIS to
              22522, or use <ExternalLink href="https://www.loveisrespect.org/">live chat</ExternalLink>.
            </li>
            <li>
              <strong>Crisis Text Line:</strong> text HOME to 741741. Spanish support: text HOLA to
              741741.
            </li>
            <li>
              <strong>The Trevor Project:</strong> for LGBTQ+ young people, call{" "}
              <a className={linkClass} href="tel:+18664887386">1-866-488-7386</a>, text START to
              678678, or visit the{" "}
              <ExternalLink href="https://www.thetrevorproject.org/get-help/">Get Help page</ExternalLink>.
            </li>
          </ul>
          <p>
            These are U.S. resources. If you are outside the United States, contact local emergency
            services or a verified local crisis or relationship-safety organization.
          </p>
        </Section>
      </div>

      <footer className="mt-14 border-t border-stone-200 pt-8 text-sm text-stone-500">
        <p>© 2026 Love Honestly. Initial App Store release candidate.</p>
      </footer>
    </main>
  );
}
