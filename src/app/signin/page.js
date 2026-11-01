import StarterPage from "@/components/StarterPage";

export const metadata = {
  title: "Sign In",
  description: "Sign in to your Open Shelf account.",
};

export default function SignInPage() {
  return (
    <StarterPage
      eyebrow="Welcome back"
      title="Sign in"
      description="Your Open Shelf account sign-in form will be available here."
      actionLabel="Create an account"
      actionHref="/signup"
    />
  );
}
