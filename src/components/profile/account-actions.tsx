"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";

export function AccountActions({ isEmailUser }: { isEmailUser: boolean }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }

    setIsChangingPassword(true);
    setPasswordError("");

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setPasswordError(data.message || "Failed to change password.");
        return;
      }

      toast.success("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setPasswordError("An unexpected error occurred.");
    } finally {
      setIsChangingPassword(false);
    }
  }

  async function handleDeleteAccount(e: React.FormEvent) {
    e.preventDefault();
    if (deleteConfirmation !== "DELETE") {
      setDeleteError("Please type DELETE to confirm.");
      return;
    }

    setIsDeleting(true);
    setDeleteError("");

    try {
      const response = await fetch("/api/auth/delete-account", {
        method: "POST",
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setDeleteError(data.message || "Failed to delete account.");
        setIsDeleting(false);
        return;
      }

      toast.success("Account deleted. We're sorry to see you go.");
      await signOut({ callbackUrl: "/sign-in" });
    } catch {
      setDeleteError("An unexpected error occurred.");
      setIsDeleting(false);
    }
  }

  return (
    <div className="space-y-8">
      {isEmailUser && (
        <div className="rounded-3xl border border-white/10 bg-black/40 p-6 shadow-xl shadow-black/20 backdrop-blur">
          <h3 className="text-xl font-semibold text-white mb-1">Change Password</h3>
          <p className="text-sm text-zinc-400 mb-6">Update your password to keep your account secure.</p>
          
          {passwordError ? (
            <div className="mb-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {passwordError}
            </div>
          ) : null}

          <form onSubmit={handleChangePassword} className="space-y-4">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-zinc-200">Current Password</span>
              <Input
                type="password"
                required
                disabled={isChangingPassword}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
              />
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-zinc-200">New Password</span>
                <Input
                  type="password"
                  required
                  disabled={isChangingPassword}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-zinc-200">Confirm New Password</span>
                <Input
                  type="password"
                  required
                  disabled={isChangingPassword}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </label>
            </div>
            <div className="pt-2">
              <Button type="submit" variant="premium" disabled={isChangingPassword}>
                {isChangingPassword ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="rounded-3xl border border-rose-500/20 bg-rose-950/10 p-6 shadow-xl shadow-black/20 backdrop-blur">
        <h3 className="text-xl font-semibold text-rose-500 mb-1">Delete Account</h3>
        <p className="text-sm text-rose-200/70 mb-6">
          Once you delete your account, there is no going back. All of your collections, items, and settings will be permanently deleted.
        </p>

        {deleteError ? (
          <div className="mb-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {deleteError}
          </div>
        ) : null}

        <form onSubmit={handleDeleteAccount} className="space-y-4">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-rose-200/80">Type <span className="font-bold text-rose-400">DELETE</span> to confirm</span>
            <Input
              className="border-rose-500/30 bg-rose-950/20 text-rose-100 placeholder:text-rose-500/50 focus-visible:ring-rose-500/50"
              placeholder="DELETE"
              required
              disabled={isDeleting}
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
            />
          </label>
          <div className="pt-2">
            <Button 
              type="submit" 
              className="bg-rose-600 text-white hover:bg-rose-700 w-full sm:w-auto" 
              disabled={isDeleting || deleteConfirmation !== "DELETE"}
            >
              {isDeleting ? "Deleting Account..." : "Permanently Delete Account"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
