import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

import { PrismaClient } from "../src/generated/prisma/client/client";

type SeedItemType = {
  id: string;
  icon: string;
  color: string;
  isSystem: boolean;
};

type SeedItem = {
  id: string;
  title: string;
  content: string;
  itemTypeId: string;
  fileExtension: string;
  isPinned?: boolean;
  createdAt: string;
  updatedAt: string;
};

type SeedCollection = {
  id: string;
  name: string;
  description: string;
  items: SeedItem[];
};

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required to run the seed script.");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const DEMO_USER_EMAIL = "demo@devstash.io";
const DEMO_USER_ID = "user-demo-devstash";
const DEMO_USER_NAME = "Demo User";
const DEMO_USER_PASSWORD = "12345678";

const seedItemTypes: SeedItemType[] = [
  { id: "snippet", icon: "Code", color: "#3b82f6", isSystem: true },
  { id: "prompt", icon: "Sparkles", color: "#8b5cf6", isSystem: true },
  { id: "command", icon: "Terminal", color: "#f97316", isSystem: true },
  { id: "note", icon: "StickyNote", color: "#fde047", isSystem: true },
  { id: "file", icon: "File", color: "#6b7280", isSystem: true },
  { id: "image", icon: "Image", color: "#ec4899", isSystem: true },
  { id: "link", icon: "Link", color: "#10b981", isSystem: true },
];

const seedCollections: SeedCollection[] = [
  {
    id: "collection-react-patterns",
    name: "React Patterns",
    description: "Reusable React patterns and hooks",
    items: [
      {
        id: "item-react-use-debounce",
        title: "useDebounce Hook",
        itemTypeId: "snippet",
        fileExtension: ".ts",
        isPinned: true,
        createdAt: "2026-02-10T08:15:00.000Z",
        updatedAt: "2026-03-18T09:20:00.000Z",
        content: `export function useDebounce<T>(value: T, delay = 250) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => window.clearTimeout(timeoutId);
  }, [value, delay]);

  return debouncedValue;
}`,
      },
      {
        id: "item-react-use-local-storage",
        title: "useLocalStorage Hook",
        itemTypeId: "snippet",
        fileExtension: ".ts",
        createdAt: "2026-02-12T10:00:00.000Z",
        updatedAt: "2026-03-16T11:10:00.000Z",
        content: `export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = window.localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : initialValue;
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}`,
      },
      {
        id: "item-react-compound-components",
        title: "Compound Components Pattern",
        itemTypeId: "snippet",
        fileExtension: ".ts",
        isPinned: true,
        createdAt: "2026-02-15T13:30:00.000Z",
        updatedAt: "2026-03-20T07:45:00.000Z",
        content: `type TabsContextValue = {
  value: string;
  onChange: (nextValue: string) => void;
};

const TabsContext = createContext<TabsContextValue | null>(null);

export function Tabs({ value, onChange, children }: PropsWithChildren<TabsContextValue>) {
  return <TabsContext.Provider value={{ value, onChange }}>{children}</TabsContext.Provider>;
}

export function TabsTrigger({ value, children }: PropsWithChildren<{ value: string }>) {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabsTrigger must be used inside Tabs");

  return <button onClick={() => context.onChange(value)}>{children}</button>;
}`,
      },
    ],
  },
  {
    id: "collection-ai-workflows",
    name: "AI Workflows",
    description: "AI prompts and workflow automations",
    items: [
      {
        id: "item-ai-code-review-prompt",
        title: "Code Review Prompt",
        itemTypeId: "prompt",
        fileExtension: ".prompt",
        isPinned: true,
        createdAt: "2026-02-18T06:00:00.000Z",
        updatedAt: "2026-03-19T12:00:00.000Z",
        content: `Review the following diff like a senior engineer.
Focus on correctness, regressions, edge cases, and missing tests.
Summarize findings by severity and include file references when relevant.
Then list any assumptions or open questions before suggesting fixes.`,
      },
      {
        id: "item-ai-docs-generation-prompt",
        title: "Documentation Generation Prompt",
        itemTypeId: "prompt",
        fileExtension: ".prompt",
        createdAt: "2026-02-20T09:45:00.000Z",
        updatedAt: "2026-03-17T15:25:00.000Z",
        content: `Turn the code and route structure below into concise developer documentation.
Explain the purpose, request flow, key types, and configuration points.
Prefer examples over theory and keep the output friendly for onboarding.`,
      },
      {
        id: "item-ai-refactor-assistant-prompt",
        title: "Refactoring Assistance Prompt",
        itemTypeId: "prompt",
        fileExtension: ".prompt",
        createdAt: "2026-02-22T14:20:00.000Z",
        updatedAt: "2026-03-21T10:50:00.000Z",
        content: `Propose a safe refactor for the code below.
Preserve behavior, reduce duplication, and call out migration risks.
Return a step-by-step plan, the revised implementation, and validation steps.`,
      },
    ],
  },
  {
    id: "collection-devops",
    name: "DevOps",
    description: "Infrastructure and deployment resources",
    items: [
      {
        id: "item-devops-docker-ci-snippet",
        title: "Docker CI Build Snippet",
        itemTypeId: "snippet",
        fileExtension: ".yml",
        createdAt: "2026-02-25T08:40:00.000Z",
        updatedAt: "2026-03-18T13:00:00.000Z",
        content: `name: Build and Test

on:
  push:
    branches: ["main"]

jobs:
  app:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci
      - run: npm run lint
      - run: docker build -t devstash-app .`,
      },
      {
        id: "item-devops-deploy-command",
        title: "Production Deploy Command",
        itemTypeId: "command",
        fileExtension: ".sh",
        isPinned: true,
        createdAt: "2026-02-26T11:05:00.000Z",
        updatedAt: "2026-03-18T18:40:00.000Z",
        content: `npm run build
npx prisma migrate deploy --schema=prisma/schema
npm run start`,
      },
      {
        id: "item-devops-docker-docs",
        title: "Docker Compose Docs",
        itemTypeId: "link",
        fileExtension: ".url",
        createdAt: "2026-02-27T09:10:00.000Z",
        updatedAt: "2026-03-14T09:10:00.000Z",
        content: `https://docs.docker.com/compose/`,
      },
      {
        id: "item-devops-github-actions-docs",
        title: "GitHub Actions Docs",
        itemTypeId: "link",
        fileExtension: ".url",
        createdAt: "2026-02-27T09:15:00.000Z",
        updatedAt: "2026-03-14T09:15:00.000Z",
        content: `https://docs.github.com/en/actions`,
      },
    ],
  },
  {
    id: "collection-terminal-commands",
    name: "Terminal Commands",
    description: "Useful shell commands for everyday development",
    items: [
      {
        id: "item-terminal-git-operations",
        title: "Git Cleanup Workflow",
        itemTypeId: "command",
        fileExtension: ".sh",
        createdAt: "2026-02-28T07:30:00.000Z",
        updatedAt: "2026-03-18T07:30:00.000Z",
        content: `git fetch origin
git status
git rebase origin/main
git push --force-with-lease`,
      },
      {
        id: "item-terminal-docker-commands",
        title: "Docker Debug Commands",
        itemTypeId: "command",
        fileExtension: ".sh",
        createdAt: "2026-03-01T06:50:00.000Z",
        updatedAt: "2026-03-18T06:50:00.000Z",
        content: `docker ps
docker logs <container-id>
docker exec -it <container-id> sh
docker compose down --volumes`,
      },
      {
        id: "item-terminal-process-management",
        title: "Process Management Cheatsheet",
        itemTypeId: "command",
        fileExtension: ".sh",
        createdAt: "2026-03-02T05:40:00.000Z",
        updatedAt: "2026-03-18T05:40:00.000Z",
        content: `lsof -i :3000
ps aux | grep node
kill -9 <pid>
top -o cpu`,
      },
      {
        id: "item-terminal-package-manager",
        title: "Package Manager Utilities",
        itemTypeId: "command",
        fileExtension: ".sh",
        createdAt: "2026-03-03T12:25:00.000Z",
        updatedAt: "2026-03-18T12:25:00.000Z",
        content: `npm outdated
npm audit
npm dedupe
npx prisma generate --schema=prisma/schema`,
      },
    ],
  },
  {
    id: "collection-design-resources",
    name: "Design Resources",
    description: "UI/UX resources and references",
    items: [
      {
        id: "item-design-tailwind-docs",
        title: "Tailwind CSS Docs",
        itemTypeId: "link",
        fileExtension: ".url",
        createdAt: "2026-03-04T08:00:00.000Z",
        updatedAt: "2026-03-15T08:00:00.000Z",
        content: `https://tailwindcss.com/docs`,
      },
      {
        id: "item-design-shadcn-ui",
        title: "shadcn/ui",
        itemTypeId: "link",
        fileExtension: ".url",
        createdAt: "2026-03-05T08:05:00.000Z",
        updatedAt: "2026-03-15T08:05:00.000Z",
        content: `https://ui.shadcn.com/`,
      },
      {
        id: "item-design-material-design",
        title: "Material Design 3",
        itemTypeId: "link",
        fileExtension: ".url",
        createdAt: "2026-03-06T08:10:00.000Z",
        updatedAt: "2026-03-15T08:10:00.000Z",
        content: `https://m3.material.io/`,
      },
      {
        id: "item-design-lucide-icons",
        title: "Lucide Icons",
        itemTypeId: "link",
        fileExtension: ".url",
        createdAt: "2026-03-07T08:15:00.000Z",
        updatedAt: "2026-03-15T08:15:00.000Z",
        content: `https://lucide.dev/icons/`,
      },
    ],
  },
];

const seededRecentItems = [
  {
    id: "recent-item-ai-code-review-prompt",
    itemId: "item-ai-code-review-prompt",
    visitedAt: "2026-03-21T10:50:00.000Z",
  },
  {
    id: "recent-item-react-compound-components",
    itemId: "item-react-compound-components",
    visitedAt: "2026-03-20T07:45:00.000Z",
  },
  {
    id: "recent-item-devops-deploy-command",
    itemId: "item-devops-deploy-command",
    visitedAt: "2026-03-18T18:40:00.000Z",
  },
  {
    id: "recent-item-design-lucide-icons",
    itemId: "item-design-lucide-icons",
    visitedAt: "2026-03-15T08:15:00.000Z",
  },
];

async function main() {
  const passwordHash = await bcrypt.hash(DEMO_USER_PASSWORD, 12);
  const emailVerified = new Date();
  await prisma.$connect();

  await prisma.user.upsert({
    where: { email: DEMO_USER_EMAIL },
    update: {
      name: DEMO_USER_NAME,
      password: passwordHash,
      isPro: false,
      emailVerified,
    },
    create: {
      id: DEMO_USER_ID,
      email: DEMO_USER_EMAIL,
      name: DEMO_USER_NAME,
      password: passwordHash,
      isPro: false,
      emailVerified,
    },
  });

  const demoUser = await prisma.user.findUniqueOrThrow({
    where: { email: DEMO_USER_EMAIL },
    select: { id: true },
  });

  await prisma.recentItem.deleteMany({
    where: { userId: demoUser.id },
  });

  await prisma.item.deleteMany({
    where: { userId: demoUser.id },
  });

  await prisma.collection.deleteMany({
    where: { userId: demoUser.id },
  });

  for (const itemType of seedItemTypes) {
    await prisma.itemType.upsert({
      where: { id: itemType.id },
      update: {
        icon: itemType.icon,
        color: itemType.color,
        isSystem: itemType.isSystem,
      },
      create: itemType,
    });
  }

  for (const collection of seedCollections) {
    await prisma.collection.create({
      data: {
        id: collection.id,
        name: collection.name,
        description: collection.description,
        userId: demoUser.id,
      },
    });

    await prisma.item.createMany({
      data: collection.items.map((item) => ({
        id: item.id,
        title: item.title,
        content: item.content,
        itemTypeId: item.itemTypeId,
        fileExtension: item.fileExtension,
        collectionId: collection.id,
        userId: demoUser.id,
        isPinned: item.isPinned ?? false,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
      })),
    });
  }

  await prisma.recentItem.createMany({
    data: seededRecentItems.map((recentItem) => ({
      id: recentItem.id,
      userId: demoUser.id,
      itemId: recentItem.itemId,
      visitedAt: new Date(recentItem.visitedAt),
    })),
  });

  console.log(
    `Seeded demo user, ${seedItemTypes.length} item types, ${seedCollections.length} collections, and ${seedCollections.reduce((total, collection) => total + collection.items.length, 0)} items.`,
  );
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
