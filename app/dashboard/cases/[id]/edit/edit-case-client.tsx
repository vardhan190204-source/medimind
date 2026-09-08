"use client";

import { useEffect, useState } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useParams, useRouter } from "next/navigation";

import {
  ArrowLeft,
  FileText,
  Loader2,
  Sparkles,
  Upload,
  X,
} from "lucide-react";

import { uploadFiles } from "@/lib/uploadthing-client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";


// ==================================================
// TYPES
// ==================================================

type DocumentType =
  | "LAB_REPORT"
  | "XRAY"
  | "CT"
  | "MRI"
  | "NOTES"
  | "OTHER";


type CaseDocument = {
  id: string;

  type: DocumentType;

  fileUrl: string;

  fileName: string;

  mimeType: string;

  extractedText: string | null;
};


type CaseData = {
  id: string;

  title: string;

  patientAge: number | null;

  patientGender: string | null;

  symptoms: string | null;

  clinicalNotes: string | null;

  documents: CaseDocument[];
};


type NewDocument = {
  type: DocumentType;

  fileUrl: string;

  fileName: string;

  mimeType: string;

  extractedText: string | null;
};


// ==================================================
// DOCUMENT TYPES
// ==================================================

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


// ==================================================
// GET CASE
// ==================================================

async function fetchCase(
  id: string
): Promise<CaseData> {
  const response = await fetch(
    `/api/cases/${id}`
  );

  const text = await response.text();

  let data: any = {};

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(
        "Server returned invalid JSON"
      );
    }
  }

  if (!response.ok) {
    throw new Error(
      data.error || "Unable to fetch case"
    );
  }

  return data;
}


// ==================================================
// COMPONENT
// ==================================================

export default function EditCaseClient() {
  const params = useParams();

  const router = useRouter();

  const queryClient = useQueryClient();

  const caseId = params.id as string;


  // ==================================================
  // FORM STATE
  // ==================================================

  const [title, setTitle] = useState("");

  const [age, setAge] = useState("");

  const [gender, setGender] = useState("");

  const [symptoms, setSymptoms] = useState("");

  const [clinicalNotes, setClinicalNotes] =
    useState("");


  // ==================================================
  // UPLOAD STATE
  // ==================================================

  const [selectedType, setSelectedType] =
    useState<DocumentType | null>(null);

  const [newDocuments, setNewDocuments] =
    useState<NewDocument[]>([]);

  const [uploading, setUploading] =
    useState(false);

  const [error, setError] = useState("");


// ==================================================
// FETCH CASE
// ==================================================

  const {
    data: caseData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["case", caseId],

    queryFn: () => fetchCase(caseId),

    enabled: !!caseId,
  });


// ==================================================
// POPULATE FORM
// ==================================================

  useEffect(() => {
    if (!caseData) return;

    setTitle(caseData.title);

    setAge(
      caseData.patientAge !== null
        ? String(caseData.patientAge)
        : ""
    );

    setGender(
      caseData.patientGender ?? ""
    );

    setSymptoms(
      caseData.symptoms ?? ""
    );

    setClinicalNotes(
      caseData.clinicalNotes ?? ""
    );
  }, [caseData]);


// ==================================================
// ADD DOCUMENT
// ==================================================

  async function handleFileSelect(
    file: File
  ) {
    if (!selectedType) {
      return;
    }

    try {
      setUploading(true);

      setError("");

      /*
       * Upload to your existing UploadThing
       * medicalDocument route.
       */
      const result = await uploadFiles(
        "medicalDocument",
        {
          files: [file],
        }
      );

      const uploadedFile = result[0];

      if (!uploadedFile) {
        throw new Error(
          `Unable to upload ${file.name}`
        );
      }

      const document: NewDocument = {
        type: selectedType,

        fileUrl: uploadedFile.ufsUrl,

        fileName: uploadedFile.name,

        mimeType: uploadedFile.type,

        /*
         * Your current UploadThing route does
         * not extract text yet.
         */
        extractedText: null,
      };

      setNewDocuments((previous) => [
        ...previous,
        document,
      ]);

      /*
       * Reset selected type after upload.
       */
      setSelectedType(null);
    } catch (error) {
      console.error(
        "UPLOAD ERROR:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to upload document"
      );
    } finally {
      setUploading(false);
    }
  }


// ==================================================
// REMOVE NEW DOCUMENT
// ==================================================

  function removeNewDocument(
    index: number
  ) {
    setNewDocuments((previous) =>
      previous.filter(
        (_, documentIndex) =>
          documentIndex !== index
      )
    );
  }


// ==================================================
// RE-ANALYSE
// ==================================================

  const reanalyseMutation = useMutation({
    mutationFn: async () => {
      setError("");

      /*
       * Send updated case information
       * + newly uploaded documents.
       *
       * The server will fetch the existing
       * documents itself.
       */
      const response = await fetch(
        `/api/cases/${caseId}/analysis`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            case: {
              title: title.trim(),

              patientAge:
                age.trim() === ""
                  ? null
                  : Number(age),

              patientGender:
                gender.trim() === ""
                  ? null
                  : gender.trim(),

              symptoms:
                symptoms.trim() === ""
                  ? null
                  : symptoms.trim(),

              clinicalNotes:
                clinicalNotes.trim() === ""
                  ? null
                  : clinicalNotes.trim(),
            },

            documents: newDocuments,
          }),
        }
      );

      const text = await response.text();

      console.log(
        "RE-ANALYSE STATUS:",
        response.status
      );

      console.log(
        "RE-ANALYSE RESPONSE:",
        text
      );

      let data: any = {};

      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          throw new Error(
            "Server returned invalid JSON: " +
              text.slice(0, 500)
          );
        }
      }

      if (!response.ok) {
        throw new Error(
          data.details ||
            data.error ||
            `API error ${response.status}`
        );
      }

      return data;
    },

    onSuccess: (data) => {
      /*
       * Refresh cached case.
       */
      queryClient.invalidateQueries({
        queryKey: ["case", caseId],
      });

      /*
       * Refresh dashboard case list.
       */
      queryClient.invalidateQueries({
        queryKey: ["cases"],
      });

      /*
       * Go back to case detail page.
       */
      router.push(
        `/dashboard/cases/${data.case.id}`
      );

      router.refresh();
    },

    onError: (error) => {
      console.error(
        "RE-ANALYSE ERROR:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to re-analyse case"
      );
    },
  });


// ==================================================
// LOADING
// ==================================================

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#f7f8f6]">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <div className="flex items-center gap-3 text-zinc-500">
            <Loader2 className="h-5 w-5 animate-spin" />

            Loading case...
          </div>
        </div>
      </main>
    );
  }


// ==================================================
// ERROR
// ==================================================

  if (isError || !caseData) {
    return (
      <main className="min-h-screen bg-[#f7f8f6]">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-600">
            Unable to load case.
          </div>
        </div>
      </main>
    );
  }


// ==================================================
// RENDER
// ==================================================

  return (
    <main className="min-h-screen bg-[#f7f8f6]">

      <div className="mx-auto max-w-5xl px-6 py-10">

        {/* ======================================== */}
        {/* HEADER */}
        {/* ======================================== */}

        <button
          type="button"
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
            Edit Case
          </h1>


          <p className="mt-2 max-w-2xl text-zinc-500">
            Update the patient's information or add
            new clinical evidence before running a
            new analysis.
          </p>

        </div>


        {/* ======================================== */}
        {/* CASE INFORMATION */}
        {/* ======================================== */}

        <section className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">

          <div className="mb-8">

            <h2 className="text-xl font-semibold">
              Case information
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Update the information currently
              available about this case.
            </p>

          </div>


          <div className="space-y-6">

            {/* TITLE */}

            <div className="space-y-2">

              <Label>Case title</Label>

              <Input
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                placeholder="e.g. Persistent chest pain"
                className="h-12 rounded-xl"
              />

            </div>


            {/* AGE + GENDER */}

            <div className="grid gap-5 md:grid-cols-2">

              <div className="space-y-2">

                <Label>Patient age</Label>

                <Input
                  type="number"
                  min={0}
                  max={150}
                  value={age}
                  onChange={(event) =>
                    setAge(event.target.value)
                  }
                  placeholder="42"
                  className="h-12 rounded-xl"
                />

              </div>


              <div className="space-y-2">

                <Label>Patient gender</Label>

                <select
                  value={gender}
                  onChange={(event) =>
                    setGender(event.target.value)
                  }
                  className="h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-zinc-950"
                >

                  <option value="">
                    Select gender
                  </option>

                  <option value="Male">
                    Male
                  </option>

                  <option value="Female">
                    Female
                  </option>

                  <option value="Other">
                    Other
                  </option>

                  <option value="Prefer not to say">
                    Prefer not to say
                  </option>

                </select>

              </div>

            </div>


            {/* SYMPTOMS */}

            <div className="space-y-2">

              <Label>Symptoms</Label>

              <Textarea
                value={symptoms}
                onChange={(event) =>
                  setSymptoms(event.target.value)
                }
                placeholder="Describe the patient's current symptoms..."
                className="min-h-32 resize-none rounded-xl"
              />

            </div>


            {/* CLINICAL NOTES */}

            <div className="space-y-2">

              <Label>Clinical notes</Label>

              <Textarea
                value={clinicalNotes}
                onChange={(event) =>
                  setClinicalNotes(event.target.value)
                }
                placeholder="Write clinical observations, history, examination findings or other relevant information..."
                className="min-h-40 resize-none rounded-xl"
              />

            </div>

          </div>

        </section>


        {/* ======================================== */}
        {/* EXISTING DOCUMENTS */}
        {/* ======================================== */}

        <section className="mt-6 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">

          <div className="mb-8">

            <h2 className="text-xl font-semibold">
              Existing evidence
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              These documents are already attached
              to this case and will be included in
              the next analysis.
            </p>

          </div>


          {caseData.documents.length === 0 ? (

            <div className="rounded-2xl border border-dashed border-zinc-300 p-8 text-center">

              <FileText className="mx-auto h-8 w-8 text-zinc-300" />

              <p className="mt-3 text-sm text-zinc-500">
                No documents attached yet.
              </p>

            </div>

          ) : (

            <div className="space-y-3">

              {caseData.documents.map(
                (document) => {

                  const label =
                    documentTypes.find(
                      (item) =>
                        item.type ===
                        document.type
                    )?.label ??
                    document.type;

                  return (
                    <div
                      key={document.id}
                      className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4"
                    >

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">

                        <FileText className="h-5 w-5 text-zinc-600" />

                      </div>


                      <div className="min-w-0">

                        <p className="font-medium">
                          {document.fileName}
                        </p>

                        <p className="mt-1 text-xs text-zinc-500">
                          {label}
                        </p>

                      </div>

                    </div>
                  );
                }
              )}

            </div>

          )}

        </section>


        {/* ======================================== */}
        {/* ADD NEW EVIDENCE */}
        {/* ======================================== */}

        <section className="mt-6 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">

          <div className="mb-8">

            <h2 className="text-xl font-semibold">
              Add new evidence
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Add a new report, X-ray, CT scan, MRI,
              clinical note, or other relevant file.
            </p>

          </div>


          {/* DOCUMENT TYPES */}

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

            {documentTypes.map(
              (document) => {

                const selected =
                  selectedType ===
                  document.type;

                return (
                  <button
                    key={document.type}
                    type="button"
                    disabled={uploading}
                    onClick={() =>
                      setSelectedType(
                        document.type
                      )
                    }
                    className={`group rounded-2xl border p-5 text-left transition ${
                      selected
                        ? "border-zinc-950 bg-zinc-950 text-white"
                        : "border-zinc-200 bg-white hover:border-zinc-400"
                    }`}
                  >

                    <div className="flex items-start justify-between">

                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                          selected
                            ? "bg-white/10 text-white"
                            : "bg-zinc-100 text-zinc-700"
                        }`}
                      >
                        <FileText className="h-5 w-5" />
                      </div>

                      {selected && (
                        <span className="text-xs text-zinc-300">
                          Selected
                        </span>
                      )}

                    </div>


                    <p className="mt-4 font-medium">
                      {document.label}
                    </p>


                    <p
                      className={`mt-1 text-xs ${
                        selected
                          ? "text-zinc-400"
                          : "text-zinc-500"
                      }`}
                    >
                      {document.description}
                    </p>

                  </button>
                );
              }
            )}

          </div>


          {/* UPLOAD BOX */}

          {selectedType && (

            <div className="mt-6 rounded-2xl border-2 border-dashed border-zinc-300 bg-zinc-50 p-8 text-center">

              {uploading ? (

                <>
                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-zinc-400" />

                  <p className="mt-3 font-medium">
                    Uploading document...
                  </p>

                  <p className="mt-1 text-sm text-zinc-500">
                    Please wait.
                  </p>
                </>

              ) : (

                <>
                  <Upload className="mx-auto h-8 w-8 text-zinc-400" />

                  <h3 className="mt-3 font-medium">

                    Upload{" "}

                    {
                      documentTypes.find(
                        (item) =>
                          item.type ===
                          selectedType
                      )?.label
                    }

                  </h3>


                  <p className="mt-1 text-sm text-zinc-500">
                    Images up to 16MB or PDF files
                    up to 32MB
                  </p>


                  <label className="mt-5 inline-flex cursor-pointer">

                    <input
                      type="file"
                      accept="image/*,.pdf"
                      className="hidden"
                      disabled={uploading}
                      onChange={(event) => {

                        const file =
                          event.target.files?.[0];

                        if (file) {
                          handleFileSelect(
                            file
                          );
                        }

                        /*
                         * Allow selecting the same
                         * file again later.
                         */
                        event.target.value = "";
                      }}
                    />


                    <span className="rounded-xl bg-zinc-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800">
                      Choose document
                    </span>

                  </label>


                  <button
                    type="button"
                    onClick={() =>
                      setSelectedType(null)
                    }
                    className="mt-3 block mx-auto text-xs text-zinc-500 hover:text-zinc-950"
                  >
                    Cancel
                  </button>

                </>

              )}

            </div>

          )}


          {/* NEW UPLOADED DOCUMENTS */}

          {newDocuments.length > 0 && (

            <div className="mt-6">

              <h3 className="mb-3 text-sm font-medium">
                New evidence
              </h3>


              <div className="space-y-3">

                {newDocuments.map(
                  (document, index) => {

                    const label =
                      documentTypes.find(
                        (item) =>
                          item.type ===
                          document.type
                      )?.label ??
                      document.type;

                    return (
                      <div
                        key={`${document.fileUrl}-${index}`}
                        className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-zinc-50 p-4"
                      >

                        <div className="flex min-w-0 items-center gap-4">

                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">

                            <FileText className="h-5 w-5 text-zinc-600" />

                          </div>


                          <div className="min-w-0">

                            <p className="font-medium">
                              {document.fileName}
                            </p>

                            <p className="mt-1 text-xs text-zinc-500">
                              {label}
                            </p>

                          </div>

                        </div>


                        <button
                          type="button"
                          disabled={
                            reanalyseMutation.isPending
                          }
                          onClick={() =>
                            removeNewDocument(
                              index
                            )
                          }
                          className="rounded-lg p-2 text-zinc-400 transition hover:bg-white hover:text-red-500"
                        >
                          <X className="h-4 w-4" />
                        </button>

                      </div>
                    );
                  }
                )}

              </div>

            </div>

          )}

        </section>


        {/* ======================================== */}
        {/* ERROR */}
        {/* ======================================== */}

        {error && (

          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">

            {error}

          </div>

        )}


        {/* ======================================== */}
        {/* RE-ANALYSE */}
        {/* ======================================== */}

        <section className="mt-8 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">

          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            <div>

              <p className="font-medium">
                Ready to re-analyse this case?
              </p>

              <p className="mt-1 max-w-xl text-xs leading-5 text-zinc-500">
                MediMind will use the updated patient
                information, existing evidence, and
                any new documents to generate a new
                clinical analysis.
              </p>

            </div>


            <Button
              disabled={
                !title.trim() ||
                reanalyseMutation.isPending ||
                uploading
              }
              onClick={() =>
                reanalyseMutation.mutate()
              }
              className="h-12 shrink-0 rounded-xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-500 px-6 font-medium text-white shadow-lg transition hover:scale-[1.02]"
            >

              {reanalyseMutation.isPending ? (

                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />

                  Re-analysing...
                </>

              ) : (

                <>
                  <Sparkles className="mr-2 h-4 w-4" />

                  Re-analyse Case
                </>

              )}

            </Button>

          </div>

        </section>


        {/* ======================================== */}
        {/* DISCLAIMER */}
        {/* ======================================== */}

        <p className="mt-4 text-center text-xs leading-5 text-zinc-400">
          MediMind provides clinical decision support
          and does not replace professional medical
          judgment.
        </p>

      </div>

    </main>
  );
}
