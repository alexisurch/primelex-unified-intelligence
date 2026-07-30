import { useState } from "react";
import { BrandingProvider } from "@/lib/branding";
import { AppToaster } from "@/lib/toast";
import LandingPage from "./routes/LandingPage";
import { RegisterScreen } from "./screens/RegisterScreen";
import { LoginScreen } from "./screens/LoginScreen";

type View = "landing" | "register" | "login" | "signed-in";

export default function App() {
  const [view, setView] = useState<View>("landing");

  return (
    <BrandingProvider>
      {view === "landing" && (
        <LandingPage
          onCreateOrganisation={() => setView("register")}
          onSignIn={() => setView("login")}
        />
      )}
      {view === "register" && (
        <RegisterScreen
          onBack={() => setView("landing")}
          onGoToLogin={() => setView("login")}
        />
      )}
      {view === "login" && (
        <LoginScreen
          onBack={() => setView("landing")}
          onGoToRegister={() => setView("register")}
          onSignedIn={() => setView("signed-in")}
        />
      )}
      {view === "signed-in" && <SignedInScreen onBack={() => setView("landing")} />}
      <AppToaster />
    </BrandingProvider>
  );
}

function SignedInScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card/60 p-10 text-center backdrop-blur">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-success/15">
          <span className="text-2xl">✓</span>
        </div>
        <h2 className="text-xl font-semibold">You're signed in</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Your organisation workspace is loaded. The full dashboard is part of the connected
          application workspace.
        </p>
        <button
          onClick={onBack}
          className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
        >
          Back to home
        </button>
      </div>
    </div>
  );
}
