"use client";

import { useState } from "react";

import { useMutation } from "@tanstack/react-query";

import { useRouter } from "next/navigation";

import {
  Upload,
  FileText,
  X,
  Sparkles,
  ArrowLeft,
  Loader2,
} from "lucide-react";

import { uploadFiles } from "@/lib/uploadthing-client";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";

import { Label } from "@/components/ui/label";

type DocumentType =
  | "LAB_REPORT"
  | "XRAY"
  | "CT"
  | "MRI"
  | "NOTES"
  | "OTHER";

type SelectedDocument = {
  type: DocumentType;
  file: File;
};

const documentTypes: {
  type: DocumentType;
  label: string;
  description: string;
}[] = [
  {
    type: "LAB_REPORT",
    label: "Lab Report",
    description: "Blood work, pathology, urine tests...",
  },

  {
    type: "XRAY",
    label: "X-Ray",
    description: "Radiographic images",
  },

  {
    type: "CT",
    label: "CT Scan",
    description: "Computed tomography",
  },

  {
    type: "MRI",
    label: "MRI",
    description: "Magnetic resonance imaging",
  },

  {
    type: "NOTES",
    label: "Clinical Notes",
    description: "Previous notes or reports",
  },

  {
    type: "OTHER",
    label: "Other",
    description: "Any other relevant document",
  },
];

export default function CreateClientPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");

  const [age, setAge] = useState("");

  const [gender, setGender] = useState("");

  const [symptoms, setSymptoms] = useState("");

  const [clinicalNotes, setClinicalNotes] = useState("");

  const [selectedType, setSelectedType] = useState<DocumentType | null>(null);

  const [documents, setDocuments] = useState<SelectedDocument[]>([]);

  const [error, setError] = useState("");

  const analyseMutation = useMutation({
    mutationFn: async () => {
      setError("");

      /*
       * Upload every selected file
       */
      const uploaded = [];

      for (const document of documents) {
        const result = await uploadFiles("medicalDocument", {
          files: [document.file],
        });

        const uploadedFile = result[0];

        if (!uploadedFile) {
          throw new Error(`Unable to upload ${document.file.name}`);
        }

        uploaded.push({
          type: document.type,

          fileUrl: uploadedFile.ufsUrl,

          fileName: document.file.name,

          mimeType: document.file.type,

          extractedText: null,
        });
      }

      /*
       * Send Case + Documents
       */
      const response = await fetch("/api/cases/analysis", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          case: {
            title,

            patientAge: age ? Number(age) : null,

            patientGender: gender || null,

            symptoms: symptoms || null,

            clinicalNotes: clinicalNotes || null,
          },

          documents: uploaded,
        }),
      });

      const text = await response.text();

      console.log("API STATUS:", response.status);
      console.log("API RESPONSE:", text);

      if (!response.ok) {
        throw new Error(`API error ${response.status}: ${text.slice(0, 500)}`);
      }

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Server returned invalid JSON: " + text.slice(0, 500));
      }

      return data;
    },

    onSuccess: (data) => {
      router.push(`/dashboard/cases/${data.case.id}`);

      router.refresh();
    },

    onError: (error) => {
      setError(error.message);
    },
  });

  function addDocument(file: File) {
    if (!selectedType) {
      return;
    }

    setDocuments((previous) => [
      ...previous.filter((document) => document.type !== selectedType),

      {
        type: selectedType,

        file,
      },
    ]);

    setSelectedType(null);
  }

  function removeDocument(type: DocumentType) {
    setDocuments((previous) =>
      previous.filter((document) => document.type !== type),
    );
  }

  const selectedDocuments = new Map(
    documents.map((document) => [document.type, document]),
  );

  return (
    <main className="min-h-screen bg-[#f7f8f6]">
      <div className="mx-auto max-w-5xl px-6 py-10">
        {/* Header */}

        <button
          onClick={() => router.back()}
          className="mb-8 flex items-center gap-2 text-sm text-zinc-500 transition hover:text-zinc-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="mb-10">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-950 text-white">
              <Sparkles className="h-4 w-4" />
            </div>

            <span className="text-sm font-medium text-zinc-500">
              AI Clinical Workspace
            </span>
          </div>

          <h1 className="text-4xl font-semibold tracking-[-0.04em]">
            Create Client
          </h1>

          <p className="mt-2 max-w-2xl text-zinc-500">
            Add patient information and supporting documents. MediMind will
            organize the information for clinical review.
          </p>
        </div>

        {/* Case information */}

        <section className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
          <div className="mb-8">
            <h2 className="text-xl font-semibold">Case information</h2>

            <p className="mt-1 text-sm text-zinc-500">
              Enter the information currently available.
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Case title</Label>

              <Input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Persistent chest pain"
                className="h-12 rounded-xl"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Patient age</Label>

                <Input
                  type="number"
                  min={0}
                  max={150}
                  value={age}
                  onChange={(event) => setAge(event.target.value)}
                  placeholder="42"
                  className="h-12 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label>Patient gender</Label>

                <select
                  value={gender}
                  onChange={(event) => setGender(event.target.value)}
                  className="h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-zinc-950"
                >
                  <option value="">Select gender</option>

                  <option value="Male">Male</option>

                  <option value="Female">Female</option>

                  <option value="Other">Other</option>

                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Symptoms</Label>

              <Textarea
                value={symptoms}
                onChange={(event) => setSymptoms(event.target.value)}
                placeholder="Describe the patient's current symptoms..."
                className="min-h-32 rounded-xl resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label>Clinical notes</Label>

              <Textarea
                value={clinicalNotes}
                onChange={(event) => setClinicalNotes(event.target.value)}
                placeholder="Write any clinical observations, history, examination findings or other relevant information..."
                className="min-h-40 rounded-xl resize-none"
              />
            </div>
          </div>
        </section>

        {/* Documents */}

        <section className="mt-6 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
          <div className="mb-8">
            <h2 className="text-xl font-semibold">Supporting documents</h2>

            <p className="mt-1 text-sm text-zinc-500">
              Attach relevant reports or medical images.
            </p>
          </div>

          {/* Document type selector */}

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {documentTypes.map((document) => {
              const selected = selectedDocuments.has(document.type);

              return (
                <button
                  type="button"
                  key={document.type}
                  onClick={() => setSelectedType(document.type)}
                  className={`group rounded-2xl border p-5 text-left transition ${
                    selected
                      ? "border-zinc-950 bg-zinc-950 text-white"
                      : "border-zinc-200 bg-white hover:border-zinc-400"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700 group-hover:bg-zinc-200">
                      <FileText className="h-5 w-5" />
                    </div>

                    {selected && <span className="text-xs">Added</span>}
                  </div>

                  <p className="mt-4 font-medium">{document.label}</p>

                  <p
                    className={`mt-1 text-xs ${
                      selected ? "text-zinc-400" : "text-zinc-500"
                    }`}
                  >
                    {document.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Upload panel */}

          {selectedType && (
            <div className="mt-6 rounded-2xl border-2 border-dashed border-zinc-300 bg-zinc-50 p-8 text-center">
              <Upload className="mx-auto h-8 w-8 text-zinc-400" />

              <h3 className="mt-3 font-medium">
                Upload{" "}
                {
                  documentTypes.find((item) => item.type === selectedType)
                    ?.label
                }
              </h3>

              <p className="mt-1 text-sm text-zinc-500">PNG, JPG or PDF</p>

              <label className="mt-5 inline-flex cursor-pointer">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0];

                    if (file) {
                      addDocument(file);
                    }
                  }}
                />

                <span className="rounded-xl bg-zinc-950 px-5 py-3 text-sm font-medium text-white">
                  Choose document
                </span>
              </label>
            </div>
          )}

          {/* Selected files */}

          {documents.length > 0 && (
            <div className="mt-6 space-y-3">
              {documents.map((document) => {
                const label = documentTypes.find(
                  (item) => item.type === document.type,
                )?.label;

                return (
                  <div
                    key={document.type}
                    className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-zinc-50 p-4"
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                        <FileText className="h-5 w-5 text-zinc-600" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-medium">{label}</p>

                        <p className="truncate text-xs text-zinc-500">
                          {document.file.name}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeDocument(document.type)}
                      className="rounded-lg p-2 text-zinc-400 hover:bg-white hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Error */}

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Analyse */}

        <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:gap-6">
  <div className="w-full sm:w-auto">
    <p className="text-base font-medium sm:text-lg">
      Ready for clinical analysis?
    </p>

    <p className="mt-1 text-xs text-zinc-500 sm:text-sm">
      Your information and uploaded documents will be processed by the
      AI system.
    </p>
  </div>

  <Button
    disabled={!title.trim() || analyseMutation.isPending}
    onClick={() => analyseMutation.mutate()}
    className="w-full justify-center rounded-xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-500 px-4 py-3 font-medium text-white shadow-lg transition hover:scale-[1.02] disabled:opacity-50 sm:w-auto sm:px-6 sm:py-2.5"
  >
    {analyseMutation.isPending ? (
      <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Analysing...
      </>
    ) : (
      <>
        <Sparkles className="mr-2 h-6 w-4" />
        Analyse with AI
      </>
    )}
  </Button>
</div>

        <p className="mt-4 text-center text-xs leading-5 text-zinc-400">
          MediMind provides clinical decision support and does not replace
          professional medical judgment.
        </p>
      </div>
    </main>
  );
}
