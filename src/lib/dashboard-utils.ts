import { mockDashboardData, type DashboardItemTypeId } from "./mock-data";

export const itemTypeRouteMap: Record<DashboardItemTypeId, string> = {
  snippet: "snippets",
  prompt: "prompts",
  command: "commands",
  note: "notes",
  file: "files",
  image: "images",
  link: "links",
};

export const itemTypeIconMap: Record<DashboardItemTypeId, string> = {
  snippet: "</>",
  prompt: "AI",
  command: ">_",
  note: "N",
  file: "F",
  image: "IMG",
  link: "URL",
};

export const recentCollections = mockDashboardData.collections
  .map((collection) => {
    const lastViewedAt = mockDashboardData.items
      .filter((item) => item.collectionId === collection.id)
      .map((item) => item.lastViewedAt)
      .sort((left, right) => right.localeCompare(left))[0];

    return {
      ...collection,
      lastViewedAt,
    };
  })
  .sort((left, right) =>
    (right.lastViewedAt ?? "").localeCompare(left.lastViewedAt ?? "")
  )
  .slice(0, 3);

export const favoriteCollections = mockDashboardData.collections.filter(
  (collection) => collection.isFavorite
);
