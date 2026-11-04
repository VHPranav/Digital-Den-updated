import {
  internationalProjects as fallbackProjects,
  startupPrograms as fallbackPrograms,
  type InternationalProject,
  type StartupProgram,
} from '@/lib/programsContent';

const API_VERSION = '2025-02-19';

const programsQuery = `*[_type == "startupProgram" && defined(title)] | order(order asc) {
  "id": slug.current,
  order,
  title,
  status,
  "image": {"src": image.asset->url, "alt": coalesce(image.alt, title)},
  overview,
  location,
  format,
  duration,
  audience,
  benefits,
  "partners": partners[]{name, href, "src": logo.asset->url, "alt": coalesce(logo.alt, name)},
  "gallery": gallery[]{"src": asset->url, "alt": coalesce(alt, "")},
  application {href, active, opensAt, closesAt}
}`;

const projectsQuery = `*[_type == "internationalProject" && defined(title)] | order(order asc) {
  "id": slug.current,
  order,
  title,
  status,
  period,
  description,
  "image": {"src": image.asset->url, "alt": coalesce(image.alt, title)},
  "partners": partners[]{name, href, "src": logo.asset->url, "alt": coalesce(logo.alt, name)},
  "funders": funders[]{name, href, "src": logo.asset->url, "alt": coalesce(logo.alt, name)},
  acknowledgement,
  officialUrl,
  "requiresFundingVisibility": coalesce(requiresFundingVisibility, true)
}`;

type ProgramRecord = Partial<StartupProgram> & { id?: string; image?: StartupProgram['image'] };
type ProjectRecord = Partial<InternationalProject> & { id?: string };

async function querySanity<T>(query: string): Promise<T[]> {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'inise1vg';
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
  const token = process.env.SANITY_READ_TOKEN;
  const params = new URLSearchParams({ query });
  const response = await fetch(`https://${projectId}.api.sanity.io/v${API_VERSION}/data/query/${dataset}?${params}`, {
    headers: {
      accept: 'application/json',
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    cache: 'force-cache',
  });

  if (!response.ok) throw new Error(`Sanity query failed (${response.status})`);
  const payload = (await response.json()) as { result?: T[] };
  return payload.result ?? [];
}

function withProgramDefaults(records: ProgramRecord[]): StartupProgram[] {
  const titledRecords = records.filter((record): record is ProgramRecord & { title: string } => Boolean(record.title));
  return titledRecords.map((record, index) => {
    const fallback = fallbackPrograms.find((program) => program.id === record.id);
    return {
      ...fallback,
      ...record,
      id: record.id || fallback?.id || `program-${index + 1}`,
      order: record.order ?? fallback?.order ?? (index + 1) * 10,
      status: record.status ?? null,
      image: record.image?.src ? record.image : fallback?.image ?? { src: '/images/programs/readiness.jpg', alt: record.title ?? 'Program' },
      benefits: record.benefits ?? fallback?.benefits ?? [],
      partners: record.partners ?? fallback?.partners ?? [],
      gallery: record.gallery ?? fallback?.gallery ?? [],
      application: record.application ?? null,
    };
  });
}

function withProjectDefaults(records: ProjectRecord[]): InternationalProject[] {
  const titledRecords = records.filter((record): record is ProjectRecord & { title: string } => Boolean(record.title));
  return titledRecords.map((record, index) => {
    const fallback = fallbackProjects.find((project) => project.id === record.id);
    return {
      ...fallback,
      ...record,
      id: record.id || fallback?.id || `project-${index + 1}`,
      order: record.order ?? fallback?.order ?? (index + 1) * 10,
      image: record.image?.src ? record.image : fallback?.image,
      partners: record.partners ?? fallback?.partners ?? [],
      funders: record.funders ?? fallback?.funders ?? [],
      requiresFundingVisibility: record.requiresFundingVisibility ?? fallback?.requiresFundingVisibility ?? true,
    };
  });
}

export async function getProgramsContent(): Promise<{
  programs: StartupProgram[];
  projects: InternationalProject[];
}> {
  try {
    const [programRecords, projectRecords] = await Promise.all([
      querySanity<ProgramRecord>(programsQuery),
      querySanity<ProjectRecord>(projectsQuery),
    ]);
    return {
      programs: programRecords.length ? withProgramDefaults(programRecords) : fallbackPrograms,
      projects: projectRecords.length ? withProjectDefaults(projectRecords) : fallbackProjects,
    };
  } catch (error) {
    console.warn('Unable to load Programs content from Sanity; using the approved local placeholders.', error);
    return { programs: fallbackPrograms, projects: fallbackProjects };
  }
}
