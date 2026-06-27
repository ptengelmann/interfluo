'use client';

import { CreateOrganization, useOrganization, useOrganizationList } from '@clerk/nextjs';
import type { ReactNode } from 'react';

export function OrgGuard({ children }: { children: ReactNode }) {
  const { organization, isLoaded: orgLoaded } = useOrganization();
  const { isLoaded: listLoaded } = useOrganizationList({
    userMemberships: { infinite: false },
  });

  if (!orgLoaded || !listLoaded) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-[14px] text-ink-soft">
        <span className="mr-3 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        Loading workspace…
      </div>
    );
  }

  if (organization) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="flex flex-col items-center gap-5 text-center">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">
            One last step
          </p>
          <h1 className="font-display mt-2 text-[34px] leading-[1.1] text-ink">Create your firm</h1>
          <p className="mt-2 max-w-md text-[14.5px] text-ink-soft">
            Interfluo scopes every matter, document, and Report on Title to a firm. Name yours below
            — you can invite colleagues from settings later.
          </p>
        </div>
        <CreateOrganization afterCreateOrganizationUrl="/" skipInvitationScreen />
      </div>
    </div>
  );
}
