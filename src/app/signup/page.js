import StarterPage from "@/components/StarterPage";

export const metadata = {
  title: "Sign Up",
  description: "Create an account with The Open Shelf.",
};

export default function SignUpPage() {
  return (
    <StarterPage
      eyebrow="Join the community"
      title="Create your account"
      description="The account registration form will be available here. Join The Open Shelf to keep your reading life together."
      actionLabel="Already have an account? Sign in"
      actionHref="/signin"
    />
  );
}
