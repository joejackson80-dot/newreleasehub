import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';

export async function getSessionArtist(options: { includeReleases?: boolean; includeSupporters?: boolean } = {}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const legacyOrgId = user.user_metadata?.legacy_org_id;

  const org = await prisma.organization.findFirst({
    where: {
      OR: [
        { id: legacyOrgId || undefined },
        { email: user.email || undefined }
      ]
    },
    include: {
      Releases: options.includeReleases || false,
      Supporters: options.includeSupporters || false,
      _count: true
    }
  });

  return org;
}

export async function getSessionFan() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const fan = await prisma.user.findUnique({
    where: { email: user.email! }
  });

  return fan;
}

export async function getSessionArtistId() {
  const org = await getSessionArtist();
  return org?.id || null;
}

export async function getSessionFanId() {
  const fan = await getSessionFan();
  return fan?.id || null;
}

export async function getSessionUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email! }
  });

  return dbUser;
}
