import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/config";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-background px-6 text-center">
      <p className="font-general-sans text-5xl font-medium text-foreground/25">
        404
      </p>
      <h1 className="font-general-sans text-2xl font-medium">
        That page doesn&rsquo;t exist
      </h1>
      <p className="max-w-sm text-sm leading-6 text-muted-foreground">
        The link may be out of date. Head back and start from the dashboard.
      </p>
      <div className="flex gap-2">
        <Button variant="heroPrimary" asChild>
          <Link to={ROUTES.app}>Go to Dashboard</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to={ROUTES.landing}>Back to website</Link>
        </Button>
      </div>
    </div>
  );
}
