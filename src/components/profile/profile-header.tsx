import { UserAvatar } from "@/components/auth/user-avatar";

export function ProfileHeader({
  user,
}: {
  user: {
    name: string | null;
    email: string | null;
    image: string | null;
    createdAt: Date;
  };
}) {
  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric"
  });

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 rounded-3xl border border-white/10 bg-black/40 p-6 shadow-xl shadow-black/20 backdrop-blur">
      <UserAvatar className="h-24 w-24 text-2xl shrink-0" image={user.image} name={user.name || "User"} />
      <div className="text-center sm:text-left">
        <h2 className="text-2xl font-bold text-white">{user.name || "User"}</h2>
        <p className="text-zinc-400">{user.email}</p>
        <p className="mt-3 text-sm font-medium text-zinc-500 uppercase tracking-wider">Member since {memberSince}</p>
      </div>
    </div>
  );
}
