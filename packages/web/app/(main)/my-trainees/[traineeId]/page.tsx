"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface Trainee {
  id: string;
  userId: string;
  goals: string[];
  experienceLevel: string;
  fitnessLevel: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    imageUrl: string;
  };
  sessionCount: number;
  lastSessionDate: string | null;
  noteCount: number;
  mediaCount: number;
}

interface Note {
  id: string;
  trainerId: string;
  traineeId: string;
  sessionId: string | null;
  note: string;
  createdAt: string;
  updatedAt: string;
  Session?: {
    scheduledAt: string;
    duration: number;
    status: string;
  };
}

interface Media {
  id: string;
  trainerId: string;
  traineeId: string;
  sessionId: string | null;
  mediaType: "photo" | "video";
  mediaUrl: string;
  thumbnailUrl: string | null;
  description: string | null;
  fileSizeBytes: number;
  createdAt: string;
}

type Tab = "overview" | "notes" | "photos" | "videos";

export default function TraineeProfilePage() {
  const params = useParams();
  const router = useRouter();
  const traineeId = params.traineeId as string;

  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [trainee, setTrainee] = useState<Trainee | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Note form state
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  // Upload state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState<"photo" | "video">("photo");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchTraineeData();
  }, [traineeId]);

  useEffect(() => {
    if (activeTab === "notes") {
      fetchNotes();
    } else if (activeTab === "photos" || activeTab === "videos") {
      fetchMedia(activeTab === "photos" ? "photo" : "video");
    }
  }, [activeTab, traineeId]);

  async function fetchTraineeData() {
    try {
      setLoading(true);
      const response = await fetch("/api/trainer-trainees");

      if (!response.ok) {
        throw new Error("Failed to fetch trainees");
      }

      const data = await response.json();
      const foundTrainee = data.data.find((t: Trainee) => t.id === traineeId);

      if (!foundTrainee) {
        setError("Trainee not found");
        return;
      }

      setTrainee(foundTrainee);
    } catch (err: any) {
      console.error("Error fetching trainee:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchNotes() {
    try {
      const response = await fetch(`/api/trainer-notes?traineeId=${traineeId}`);
      if (response.ok) {
        const data = await response.json();
        setNotes(data.data || []);
      }
    } catch (err) {
      console.error("Error fetching notes:", err);
    }
  }

  async function fetchMedia(mediaType: "photo" | "video") {
    try {
      const response = await fetch(
        `/api/trainee-media?traineeId=${traineeId}&mediaType=${mediaType}`,
      );
      if (response.ok) {
        const data = await response.json();
        setMedia(data.data || []);
      }
    } catch (err) {
      console.error("Error fetching media:", err);
    }
  }

  async function handleSaveNote() {
    if (!noteText.trim()) return;

    try {
      setSavingNote(true);
      const response = await fetch("/api/trainer-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          traineeId,
          note: noteText.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save note");
      }

      setNoteText("");
      setShowNoteForm(false);
      fetchNotes();
      fetchTraineeData(); // Refresh note count
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSavingNote(false);
    }
  }

  async function handleDeleteNote(noteId: string) {
    if (!confirm("Delete this note?")) return;

    try {
      const response = await fetch(`/api/trainer-notes/${noteId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete note");
      }

      fetchNotes();
      fetchTraineeData();
    } catch (err: any) {
      alert(err.message);
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("traineeId", traineeId);

      const response = await fetch("/api/trainee-media", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      setShowUploadModal(false);
      fetchMedia(activeTab === "photos" ? "photo" : "video");
      fetchTraineeData(); // Refresh media count
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleDeleteMedia(mediaId: string) {
    if (!confirm("Delete this media?")) return;

    try {
      const response = await fetch(`/api/trainee-media/${mediaId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete media");
      }

      fetchMedia(activeTab === "photos" ? "photo" : "video");
      fetchTraineeData();
    } catch (err: any) {
      alert(err.message);
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !trainee) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200">
              {error || "Trainee not found"}
            </p>
          </div>
          <Link
            href="/my-trainees"
            className="inline-block mt-4 text-indigo-600 hover:text-indigo-700"
          >
            ← Back to Trainees
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <Link
          href="/my-trainees"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-6"
        >
          <svg
            className="w-5 h-5 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Trainees
        </Link>

        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <div className="flex items-center space-x-6">
            {/* Avatar */}
            {trainee.user.imageUrl ? (
              <img
                src={trainee.user.imageUrl}
                alt={`${trainee.user.firstName} ${trainee.user.lastName}`}
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                <span className="text-3xl font-semibold text-indigo-600 dark:text-indigo-400">
                  {trainee.user.firstName?.[0]}
                  {trainee.user.lastName?.[0]}
                </span>
              </div>
            )}

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {trainee.user.firstName} {trainee.user.lastName}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {trainee.user.email}
              </p>
              <div className="flex space-x-6 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">
                    Sessions:
                  </span>
                  <span className="ml-2 font-semibold text-gray-900 dark:text-white">
                    {trainee.sessionCount}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">
                    Notes:
                  </span>
                  <span className="ml-2 font-semibold text-gray-900 dark:text-white">
                    {trainee.noteCount}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">
                    Media:
                  </span>
                  <span className="ml-2 font-semibold text-gray-900 dark:text-white">
                    {trainee.mediaCount}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab("overview")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "overview"
                    ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("notes")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "notes"
                    ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                Notes ({trainee.noteCount})
              </button>
              <button
                onClick={() => setActiveTab("photos")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "photos"
                    ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                📸 Photos
              </button>
              <button
                onClick={() => setActiveTab("videos")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "videos"
                    ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                🎥 Videos
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Training Goals
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {trainee.goals?.map((goal, index) => (
                      <span
                        key={index}
                        className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-3 py-1 rounded-full text-sm"
                      >
                        {goal}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Experience Level
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {trainee.experienceLevel}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Fitness Level
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {trainee.fitnessLevel}
                  </p>
                </div>
              </div>
            )}

            {/* Notes Tab */}
            {activeTab === "notes" && (
              <div className="space-y-4">
                {/* Add Note Button */}
                {!showNoteForm && (
                  <button
                    onClick={() => setShowNoteForm(true)}
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    + Add Note
                  </button>
                )}

                {/* Note Form */}
                {showNoteForm && (
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg space-y-3">
                    <textarea
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Write your note here..."
                      className="w-full h-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      autoFocus
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSaveNote}
                        disabled={savingNote || !noteText.trim()}
                        className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {savingNote ? "Saving..." : "Save Note"}
                      </button>
                      <button
                        onClick={() => {
                          setShowNoteForm(false);
                          setNoteText("");
                        }}
                        className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Notes List */}
                {notes.length === 0 && !showNoteForm && (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                    No notes yet. Add your first note!
                  </p>
                )}

                {notes.map((note) => (
                  <div
                    key={note.id}
                    className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(note.createdAt)}
                      </span>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                    <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                      {note.note}
                    </p>
                    {note.Session && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Session: {formatDate(note.Session.scheduledAt)} (
                        {note.Session.duration} min)
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Photos Tab */}
            {activeTab === "photos" && (
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <label className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors text-center cursor-pointer">
                    📸 Upload Photo
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                </div>

                {uploading && (
                  <p className="text-center text-gray-500">Uploading...</p>
                )}

                {/* Photos Grid */}
                {media.length === 0 && !uploading && (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                    No photos yet. Upload your first photo!
                  </p>
                )}

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {media.map((item) => (
                    <div
                      key={item.id}
                      className="relative group rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                    >
                      <div className="aspect-square bg-gray-100 dark:bg-gray-700">
                        <img
                          src={item.mediaUrl}
                          alt={item.description || "Photo"}
                          className="w-full h-full object-contain cursor-pointer"
                          onClick={() => window.open(item.mediaUrl, "_blank")}
                          onError={(e) => {
                            console.error(
                              "Image failed to load:",
                              item.mediaUrl,
                            );
                          }}
                          loading="lazy"
                        />
                      </div>
                      <div className="absolute top-2 right-2">
                        <button
                          onClick={() => handleDeleteMedia(item.id)}
                          className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-lg transition-colors"
                          title="Delete photo"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                      {item.description && (
                        <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                          <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                            {item.description}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Videos Tab */}
            {activeTab === "videos" && (
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <label className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors text-center cursor-pointer">
                    🎥 Upload Video
                    <input
                      type="file"
                      accept="video/mp4,video/quicktime,video/webm"
                      onChange={handleFileUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                </div>

                {uploading && (
                  <p className="text-center text-gray-500">
                    Uploading... (this may take a while for large videos)
                  </p>
                )}

                {/* Videos Grid */}
                {media.length === 0 && !uploading && (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                    No videos yet. Upload your first video!
                  </p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {media.map((item) => (
                    <div
                      key={item.id}
                      className="relative group rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700"
                    >
                      <video src={item.mediaUrl} controls className="w-full" />
                      <div className="p-3">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(item.createdAt)}
                        </p>
                        <button
                          onClick={() => handleDeleteMedia(item.id)}
                          className="mt-2 text-red-600 hover:text-red-700 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
