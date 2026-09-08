"use client";

import Link from "next/link";
import { useCase } from "@/hooks/use-cases";

import {
  ArrowLeft,
  Printer,
  Pencil,
  FileText,
  AlertTriangle,
  Brain,
  ClipboardList,
  User,
  CalendarDays,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export default function CaseDetailsClient({
  id,
}: {
  id: string;
}) {
  const {
    data: caseData,
    isLoading,
    isError,
  } = useCase(id);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#f7f8f6]">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="h-8 w-32 animate-pulse rounded-lg bg-zinc-200" />

          <div className="mt-8 space-y-5">
            <div className="h-40 animate-pulse rounded-3xl bg-zinc-200" />
            <div className="h-60 animate-pulse rounded-3xl bg-zinc-200" />
          </div>
        </div>
      </main>
    );
  }

  if (isError || !caseData) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f8f6]">
        <div className="text-center">
          <h1 className="text-xl font-semibold">
            Case not found
          </h1>

          <Link
            href="/dashboard"
            className="mt-4 inline-block text-sm text-zinc-500 hover:text-zinc-950"
          >
            Back to dashboard
          </Link>
        </div>
      </main>
    );
  }

  const latestAnalysis =
    caseData.analyses?.[0];

  return (
    <main
      id="case-print-area"
      className="min-h-screen bg-[#f7f8f6]"
    >
      <div className="mx-auto max-w-6xl px-6 py-10">

        {/* Top navigation */}
        <div className="mb-8 flex items-center justify-between">

          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm text-zinc-500 transition hover:text-zinc-950 print:hidden"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to cases
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-2 print:hidden">

            <Button
              variant="outline"
              onClick={() => window.print()}
              className="rounded-xl bg-white"
            >
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>

            <Link
              href={`/dashboard/cases/${id}/edit`}
            >
              <Button className="rounded-xl">
                <Pencil className="mr-2 h-4 w-4" />
                Update
              </Button>
            </Link>

          </div>
        </div>

        {/* Case header */}
        <section className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">

          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">

            <div>
              <div className="flex items-center gap-3">

                <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium">
                  {formatStatus(caseData.status)}
                </span>

                <span className="font-mono text-xs text-zinc-400">
                  {caseData.id}
                </span>

              </div>

              <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em]">
                {caseData.title}
              </h1>

              <div className="mt-4 flex flex-wrap gap-5 text-sm text-zinc-500">

                <span className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Age: {caseData.patientAge ?? "—"}
                </span>

                <span className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Gender: {caseData.patientGender ?? "—"}
                </span>

                <span className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  {new Date(
                    caseData.createdAt
                  ).toLocaleDateString()}
                </span>

              </div>
            </div>

          </div>

        </section>

        {/* Patient information */}
        <section className="mt-6 grid gap-6 md:grid-cols-2">

          <InformationCard
            title="Symptoms"
            icon={<ClipboardList className="h-5 w-5" />}
            content={caseData.symptoms}
          />

          <InformationCard
            title="Clinical Notes"
            icon={<FileText className="h-5 w-5" />}
            content={caseData.clinicalNotes}
          />

        </section>

        {/* Documents */}
        <section className="mt-6 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100">
              <FileText className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-xl font-semibold">
                Uploaded documents
              </h2>

              <p className="text-sm text-zinc-500">
                Supporting clinical documents
              </p>
            </div>
          </div>

          {caseData.documents.length === 0 ? (
            <p className="mt-6 text-sm text-zinc-500">
              No documents uploaded.
            </p>
          ) : (
            <div className="mt-6 space-y-3">
              {caseData.documents.map(
                (document: any) => (
                  <a
                    key={document.id}
                    href={document.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-2xl border border-zinc-200 p-4 transition hover:border-zinc-400 hover:bg-zinc-50"
                  >
                    <div className="flex items-center gap-4">

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-100">
                        <FileText className="h-5 w-5 text-zinc-600" />
                      </div>

                      <div>
                        <p className="font-medium">
                          {document.fileName}
                        </p>

                        <p className="mt-1 text-xs text-zinc-500">
                          {formatDocumentType(document.type)}
                        </p>
                      </div>

                    </div>

                    <span className="text-xs text-zinc-400">
                      Open
                    </span>
                  </a>
                )
              )}
            </div>
          )}

        </section>

        {/* AI analysis */}
        {latestAnalysis && (
          <>
            <section className="mt-6 rounded-3xl border border-violet-200 bg-white p-8 shadow-sm">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100">
                  <Brain className="h-5 w-5 text-violet-600" />
                </div>

                <div>
                  <h2 className="text-xl font-semibold">
                    AI Clinical Analysis
                  </h2>

                  <p className="text-sm text-zinc-500">
                    Clinical decision-support output
                  </p>
                </div>

              </div>

              <div className="mt-6 rounded-2xl bg-zinc-50 p-6">
                <h3 className="font-medium">
                  Summary
                </h3>

                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-zinc-600">
                  {latestAnalysis.summary}
                </p>
              </div>

            </section>

            {/* Differential diagnosis */}
            <section className="mt-6 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">

              <h2 className="text-xl font-semibold">
                Differential Diagnosis
              </h2>

              <div className="mt-6 space-y-4">

                {latestAnalysis.differentialDx.map(
                  (diagnosis: any, index: number) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-zinc-200 p-6"
                    >

                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                        <h3 className="font-semibold">
                          {diagnosis.diagnosis}
                        </h3>

                        <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium">
                          {diagnosis.likelihood}
                        </span>

                      </div>

                      <p className="mt-4 text-sm leading-6 text-zinc-600">
                        {diagnosis.reasoning}
                      </p>

                      {diagnosis.supportingEvidence?.length > 0 && (
                        <div className="mt-5">
                          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                            Supporting evidence
                          </p>

                          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-600">
                            {diagnosis.supportingEvidence.map(
                              (item: string, i: number) => (
                                <li key={i}>{item}</li>
                              )
                            )}
                          </ul>
                        </div>
                      )}

                      {diagnosis.contradictoryEvidence?.length > 0 && (
                        <div className="mt-5">
                          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                            Contradictory evidence
                          </p>

                          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-600">
                            {diagnosis.contradictoryEvidence.map(
                              (item: string, i: number) => (
                                <li key={i}>{item}</li>
                              )
                            )}
                          </ul>
                        </div>
                      )}

                    </div>
                  )
                )}

              </div>

            </section>

            {/* Red flags */}
            <section className="mt-6 rounded-3xl border border-red-200 bg-white p-8 shadow-sm">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                </div>

                <h2 className="text-xl font-semibold">
                  Red Flags
                </h2>

              </div>

              {latestAnalysis.redFlags.length === 0 ? (
                <p className="mt-6 text-sm text-zinc-500">
                  No red flags identified from the supplied information.
                </p>
              ) : (
                <ul className="mt-6 space-y-3">
                  {latestAnalysis.redFlags.map(
                    (flag: string, index: number) => (
                      <li
                        key={index}
                        className="rounded-xl bg-red-50 p-4 text-sm text-red-700"
                      >
                        {flag}
                      </li>
                    )
                  )}
                </ul>
              )}

            </section>

            {/* Recommendations */}
            <section className="mt-6 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">

              <h2 className="text-xl font-semibold">
                Recommendations
              </h2>

              <RecommendationSection
                title="Immediate Actions"
                items={
                  latestAnalysis.recommendations
                    .immediateActions
                }
              />

              <RecommendationSection
                title="Investigations"
                items={
                  latestAnalysis.recommendations
                    .investigations
                }
              />

              <RecommendationSection
                title="Clinical Considerations"
                items={
                  latestAnalysis.recommendations
                    .clinicalConsiderations
                }
              />

              <RecommendationSection
                title="Follow-up"
                items={
                  latestAnalysis.recommendations
                    .followUp
                }
              />

            </section>
          </>
        )}

        {/* Disclaimer */}
        <p className="mt-8 text-center text-xs leading-5 text-zinc-400">
          MediMind provides clinical decision support and does not replace
          professional medical judgment.
        </p>

      </div>
    </main>
  );
}

function InformationCard({
  title,
  icon,
  content,
}: {
  title: string;
  icon: React.ReactNode;
  content: string | null;
}) {
  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">

      <div className="flex items-center gap-3">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100">
          {icon}
        </div>

        <h2 className="text-xl font-semibold">
          {title}
        </h2>

      </div>

      <p className="mt-6 whitespace-pre-wrap text-sm leading-7 text-zinc-600">
        {content || "Not provided."}
      </p>

    </section>
  );
}

function RecommendationSection({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div className="mt-6">

      <h3 className="text-sm font-semibold">
        {title}
      </h3>

      {items.length === 0 ? (
        <p className="mt-2 text-sm text-zinc-400">
          None provided.
        </p>
      ) : (
        <ul className="mt-3 space-y-2">
          {items.map((item, index) => (
            <li
              key={index}
              className="rounded-xl bg-zinc-50 p-4 text-sm text-zinc-600"
            >
              {item}
            </li>
          ))}
        </ul>
      )}

    </div>
  );
}

function formatStatus(status: string) {
  switch (status) {
    case "IN_PROGRESS":
      return "In progress";

    case "COMPLETED":
      return "Completed";

    case "ARCHIVED":
      return "Archived";

    default:
      return "Open";
  }
}

function formatDocumentType(type: string) {
  switch (type) {
    case "LAB_REPORT":
      return "Lab Report";

    case "XRAY":
      return "X-Ray";

    case "CT":
      return "CT Scan";

    case "MRI":
      return "MRI";

    case "NOTES":
      return "Clinical Notes";

    default:
      return "Other";
  }
}