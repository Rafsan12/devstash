"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import { updateEditorPreferencesAction } from "@/actions/editor-preferences";
import {
  areEditorPreferencesEqual,
  normalizeEditorPreferences,
  type EditorPreferences,
} from "@/lib/editor-preferences";

type EditorPreferencesContextValue = {
  preferences: EditorPreferences;
  updatePreferences: (updates: Partial<EditorPreferences>) => void;
  isSaving: boolean;
};

const EditorPreferencesContext = createContext<EditorPreferencesContextValue | null>(null);

export function useEditorPreferences() {
  const context = useContext(EditorPreferencesContext);

  if (!context) {
    throw new Error("useEditorPreferences must be used within EditorPreferencesProvider");
  }

  return context;
}

export function useOptionalEditorPreferences() {
  return useContext(EditorPreferencesContext);
}

export function EditorPreferencesProvider({
  children,
  initialPreferences,
}: {
  children: ReactNode;
  initialPreferences?: unknown;
}) {
  const normalizedInitialPreferences = normalizeEditorPreferences(initialPreferences);
  const [preferences, setPreferences] = useState(normalizedInitialPreferences);
  const [isSaving, setIsSaving] = useState(false);
  const saveTimeoutRef = useRef<number | null>(null);
  const hasMountedRef = useRef(false);
  const lastSavedPreferencesRef = useRef(normalizedInitialPreferences);
  const latestSaveRequestRef = useRef(0);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return undefined;
    }

    if (areEditorPreferencesEqual(preferences, lastSavedPreferencesRef.current)) {
      return undefined;
    }

    if (saveTimeoutRef.current) {
      window.clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = window.setTimeout(async () => {
      const saveRequestId = latestSaveRequestRef.current + 1;
      latestSaveRequestRef.current = saveRequestId;
      setIsSaving(true);

      const result = await updateEditorPreferencesAction(preferences);

      if (latestSaveRequestRef.current !== saveRequestId) {
        return;
      }

      setIsSaving(false);

      if (!result.success) {
        toast.error(result.error ?? "Unable to save editor preferences.");
        return;
      }

      lastSavedPreferencesRef.current = result.data;
      setPreferences(result.data);
      toast.success("Editor preferences saved.");
    }, 450);

    return () => {
      if (saveTimeoutRef.current) {
        window.clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [preferences]);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        window.clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const updatePreferences = (updates: Partial<EditorPreferences>) => {
    setPreferences((currentPreferences) => ({
      ...currentPreferences,
      ...updates,
    }));
  };

  return (
    <EditorPreferencesContext.Provider
      value={{
        preferences,
        updatePreferences,
        isSaving,
      }}
    >
      {children}
    </EditorPreferencesContext.Provider>
  );
}
